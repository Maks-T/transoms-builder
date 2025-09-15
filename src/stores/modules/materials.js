import {defineStore} from 'pinia'
import {useConfigsStore, useModelingStore} from '@stores'
import {PROFILE_TYPE, CELL_TYPES} from '@constants'
import {uniqId} from "@utils/index.js";

/**
 * Хранилище для расчета материалов фрамуги
 * @returns MaterialConfig
 */
export const useMaterialsStore = defineStore('materials', {

    state: () => ({}),

    getters: {
        /**
         * Возвращает экземпляр хранилища конфигураций.
         * @returns {ConfigsStore} Хранилище конфигураций.
         */
        configsStore() {
            return useConfigsStore();
        },

        /**
         * Возвращает экземпляр хранилища моделирования.
         * @returns {ModelingStore} Хранилище моделирования.
         */
        modelingStore() {
            return useModelingStore();
        },

        /**
         * Возвращает правила для материалов.
         * @returns {MaterialsRules} Правила для материалов по типам ячеек, сторонам и соседям.
         */
        rules() {
            return this.configsStore.getMaterialsRules;
        },
    },

    actions: {
        /**
         * Определяет упрощенный тип ячейки на основе ее свойств.
         * @param {TransomCell} cell - Ячейка фрамуги.
         * @returns {string} Тип ячейки: 'profile', 'active', 'inactive'.
         */
        getCellType(cell) {
            if (cell.type === PROFILE_TYPE && cell.isVertical) return 'verticalProfile';
            if (cell.type === PROFILE_TYPE && cell.isHorizontal) return 'horizontalProfile';
            if (cell.isActive) return CELL_TYPES.ACTIVE;
            return CELL_TYPES.INACTIVE;
        },

        /**
         * Возвращает соседние ячейки для указанной стороны.
         * @param {Neighbors} neighbors - Объект с соседями ячейки по сторонам.
         * @param {string} side - Сторона ячейки ('left', 'right', 'top', 'bottom').
         * @returns {TransomCell[]} Массив соседних ячеек для указанной стороны или пустой массив.
         */
        getNeighborsOnSide(neighbors, side) {
            return neighbors[side] && neighbors[side].length > 0 ? neighbors[side] : [];
        },

        /**
         * Возвращает набор конфигов для материалов.
         * @param {string} cellType - Упрощенный тип текущей ячейки ('profile', 'active', 'inactive').
         * @param {string} side - Сторона ячейки ('left', 'right', 'top', 'bottom').
         * @param {string | null} neighborType - Тип соседней ячейки или null, если соседа нет.
         * @returns {MaterialConfig[] | null} Набор конфигураций материалов или null.
         */
        getMaterialsSet(cellType, side, neighborType) {
            return this.rules[cellType]?.[side]?.[neighborType] || null;
        },

        /**
         * Создает объект материала.
         * @param {MaterialConfig} materialCfg - Конфигурация материала.
         * @param {TransomCell} cell - Ячейка фрамуги.
         * @param {string} side - Сторона ячейки ('left', 'right', 'top', 'bottom').
         * @param {TransomCell | null} [neighbor=null] - Соседняя ячейка, если есть.
         * @returns {MaterialObject | undefined} Объект материала или undefined, если прайс не найден.
         */
        createMaterialObject(materialCfg, cell, side, neighbor = null) {
            const isVertical = side === 'left' || side === 'right';

            const price = this.configsStore.prices[materialCfg.id];

            if (!price) {
                console.error(`Ошибка: прайс с id=${materialCfg.id} не найден`);
                return;
            }

            // Если нет соседа, используем размеры текущей ячейки
            let length;
            if (neighbor) {
                length = isVertical
                    ? Math.min(cell.innerHeight, neighbor.innerHeight || cell.innerHeight)
                    : Math.min(cell.innerWidth, neighbor.innerWidth || cell.innerWidth);
            } else {
                length = isVertical ? cell.innerHeight : cell.innerWidth;
            }

            const params = {
                length,
            };

            let quantity = 0;

            try {
                quantity = typeof materialCfg.q === 'function' ? materialCfg.q(params) : Number(materialCfg.q);
            } catch (e) {
                console.warn('Ошибка парсинга формулы определения количества материала', materialCfg, e.message);
            }

            return {
                id: uniqId('mat'),
                cellIdx: cell.idx,
                price,
                side,
                quantity,
            };
        },

        /**
         * Применяет исключения для определения типа соседней ячейки.
         * @param {string} cellType - Тип текущей ячейки.
         * @param {string} side - Сторона ячейки ('left', 'right', 'top', 'bottom').
         * @param {string | null} neighborType - Исходный тип соседней ячейки.
         * @param {Neighbors} neighbors - Объект с соседями ячейки.
         * @returns {string | null} Скорректированный тип соседней ячейки.
         */
        applyExceptionsToNeighborType(cellType, side, neighborType, neighbors) {
            if (cellType !== CELL_TYPES.INACTIVE || !neighborType) return neighborType;

            // Исключение: для inactive ячейки справа с inactive соседом, если сверху есть horizontalProfile
            if (side === 'right' && neighborType === CELL_TYPES.INACTIVE) {
                const topNeighbors = this.getNeighborsOnSide(neighbors, 'top');
                if (topNeighbors.some((n) => this.getCellType(n) === 'horizontalProfile')) {
                    return 'verticalProfile'; // Соединение как с вертикальным профилем
                }
            }

            // Исключение: для inactive ячейки слева с inactive соседом, если первый сосед слева это horizontalProfile
            if (side === 'left' && neighborType === CELL_TYPES.INACTIVE) {
                const leftNeighbors = this.getNeighborsOnSide(neighbors, 'left');
                if (leftNeighbors && leftNeighbors.length && this.getCellType(leftNeighbors[0]) === 'horizontalProfile') {
                    return 'active'; // Соединение как с активной ячейкой
                }
            }

            return neighborType;
        },

        /**
         * Вычисляет материалы для одной ячейки. Проверяет соседей ячейки и применяет правила.
         * @param {TransomCell} cell - Ячейка фрамуги.
         * @param {Transom} transom - Расчетная фрамуга.
         * @returns {MaterialObject[]} Массив объектов материалов для ячейки.
         */
        calculateMaterialsByCell(cell, transom) {
            const materials = [];
            const cellType = this.getCellType(cell);

            // Получаем соседей ячейки
            const neighbors = this.modelingStore.getNeighbors(cell);
            if (!neighbors) {
                console.warn('Не удалось получить соседей для ячейки', cell.idx);
                return materials;
            }

            // Определяем стороны для основного профиля
            let profileSides;

            if (cellType === 'verticalProfile') {
                profileSides = ['left']; // Вертикальный профиль только на длинной стороне
            } else if (cellType === 'horizontalProfile') {
                profileSides = ['top']; // Горизонтальный профиль только на длинной стороне
            } else {
                profileSides = ['left', 'right', 'top', 'bottom']; // Для полотен — прямоугольник из профилей
            }

            // Добавляем основной профиль для указанных сторон
            profileSides.forEach((side) => {
                const mainProfile = this.createMaterialObject(
                    {id: transom.profile.priceId, q: (p) => p.length + 100},
                    cell,
                    side,
                    null);

                if (mainProfile) {
                    materials.push(mainProfile);
                }
            });

            // Добавляем остальные материалы
            // Обрабатываем каждую сторону ячейки
            const sides = ['left', 'right', 'top', 'bottom'];

            sides.forEach((side) => {
                /* if (
                     cellType === CELL_TYPES.PROFILE &&
                     ((cell.isVertical && ['top', 'bottom'].includes(side)) ||
                         (cell.isHorizontal && ['left', 'right'].includes(side)))
                 ) {
                     return; // Исключаем из расчета стороны ширины у ячейки типа Профиль (короб)
                 }*/

                const neighborsOnSide = this.getNeighborsOnSide(neighbors, side);

                // Если есть соседи на этой стороне
                if (neighborsOnSide.length > 0) {
                    neighborsOnSide.forEach((neighbor) => {
                        let neighborType = neighbor ? this.getCellType(neighbor) : null;
                        //применяем исключения
                        neighborType = this.applyExceptionsToNeighborType(cellType, side, neighborType, neighbors)

                        // ToDo вынести исключения

                        /*// Исключение: для inactive ячейки справа с inactive соседом, если сверху есть profile
                        if (
                            cellType === CELL_TYPES.INACTIVE &&
                            side === 'right' &&
                            neighborType === CELL_TYPES.INACTIVE
                        ) {
                            const topNeighbors = this.getNeighborsOnSide(neighbors, 'top');

                            if (topNeighbors.some((n) => this.getCellType(n) === 'horizontalProfile')) {
                                neighborType = 'verticalProfile' //соединение как с вертикальным профилем
                            }
                        }
                        // Исключение: для inactive ячейки слева с inactive соседом, если есть horizontalProfile слева
                        if (
                            cellType === CELL_TYPES.INACTIVE &&
                            side === 'left' &&
                            neighborType === CELL_TYPES.INACTIVE
                        ) {
                            const leftNeighbors = this.getNeighborsOnSide(neighbors, 'left');

                            if (leftNeighbors && leftNeighbors.length && this.getCellType(leftNeighbors[0]) === 'horizontalProfile') {
                                neighborType = 'active' //соединение как с активной ячейкой
                            }
                        }*/

                        //ToDo добавить для зеркальной конфигурации

                        const materialsSet = this.getMaterialsSet(cellType, side, neighborType);

                        if (Array.isArray(materialsSet)) {
                            materialsSet.forEach((materialSet) => {
                                const material = this.createMaterialObject(materialSet, cell, side, neighbor);
                                if (material) {
                                    materials.push(material);
                                }
                            });
                        }
                    });
                } else {
                    // Обработка случая, когда нет соседей (граница фрамуги)
                    let materialsSet = this.getMaterialsSet(cellType, side, null);

                    if (Array.isArray(materialsSet)) {
                        materialsSet.forEach((materialSet) => {
                            const material = this.createMaterialObject(materialSet, cell, side, null);
                            if (material) {
                                materials.push(material);
                            }
                        });
                    }
                }
            });

            return materials;
        },

        /**
         * Вычисляет все материалы для фрамуги.
         * @param {Transom} transom - Объект фрамуги.
         * @returns {MaterialsObject} Объект с материалами для всех ячеек, индексированный по cellIdx.
         */
        calculateTransomMaterials(transom) {
            const cells = transom.cells;

            if (!cells || !Array.isArray(cells)) {
                console.warn('Нет ячеек для фрамуги');
                return {};
            }

            const materials = {};


            cells.forEach((cell) => {
                if (cell && cell.idx !== undefined) {
                    materials[cell.idx] = this.calculateMaterialsByCell(cell, transom);
                }
            });

            return materials;
        },
    },
});
