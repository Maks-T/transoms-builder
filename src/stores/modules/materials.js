import {defineStore} from 'pinia'
import {useConfigsStore, useModelingStore} from '@stores'
import {PROFILE_TYPE, RULE_CELL_TYPES} from '@constants'
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
        getRuleCellType(cell) {
            if (cell.type === PROFILE_TYPE && cell.isVertical) return RULE_CELL_TYPES.VERTICAL_PROFILE;
            if (cell.type === PROFILE_TYPE && cell.isHorizontal) return RULE_CELL_TYPES.HORIZONTAL_PROFILE;
            if (cell.isActive) return RULE_CELL_TYPES.ACTIVE;
            return RULE_CELL_TYPES.INACTIVE;
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
         * @param {TransomCell} cell - Текущая ячейка фрамуги
         * @param {string} cellType - Тип текущей ячейки.
         * @param {string} side - Сторона ячейки ('left', 'right', 'top', 'bottom').
         * @param {string | null} neighborType - Исходный тип соседней ячейки.
         * @param {Neighbors} neighbors - Объект с соседями ячейки.
         * @returns {string | null} Скорректированный динамически тип соседней ячейки относительно одной ее стороны.
         */
        applyExceptionsToNeighborType(cell, cellType, side, neighborType, neighbors) {
            if (cellType !== RULE_CELL_TYPES.INACTIVE || !neighborType) return neighborType;

            // 1. Исключение: для inactive ячейки справа с inactive соседом, если сверху есть horizontalProfile
            if (side === 'right' && neighborType === RULE_CELL_TYPES.INACTIVE) {
                const topNeighbors = this.getNeighborsOnSide(neighbors, 'top');
                if (topNeighbors.some((n) => this.getRuleCellType(n) === RULE_CELL_TYPES.HORIZONTAL_PROFILE)) {
                    return RULE_CELL_TYPES.VERTICAL_PROFILE; // Соединение как с вертикальным профилем
                }
            }

            // 2. Исключение: для inactive ячейки слева с inactive соседом, если первый сосед слева это horizontalProfile
            if (side === 'left' && neighborType === RULE_CELL_TYPES.INACTIVE) {
                const leftNeighbors = this.getNeighborsOnSide(neighbors, 'left');
                if (leftNeighbors && leftNeighbors.length && this.getRuleCellType(leftNeighbors[0]) === RULE_CELL_TYPES.HORIZONTAL_PROFILE) {
                    return 'active'; // Соединение как с активной ячейкой
                }
            }

            // 3. Если есть слева и справа inactive сосед и их высота равна высоте ячейки
            // и если снизу active сосед и его ширина равна ширине ячейки
            if (side === 'bottom'
                && neighborType === RULE_CELL_TYPES.ACTIVE
                && cell.width === neighbors.bottom[0]?.width
                && cell.height === neighbors.left[0]?.height
                && cell.height === neighbors.right[0]?.height
                //ToDo возмоно добавить, что слева и справа inactive
            ) {
               return RULE_CELL_TYPES.FORCED_ACTIVE
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
            const cellType = this.getRuleCellType(cell);

            // Получаем соседей ячейки
            const neighbors = this.modelingStore.getNeighbors(cell, transom);

            if (!neighbors) {
                console.warn('Не удалось получить соседей для ячейки', cell.idx);
                return materials;
            }

            // Определяем стороны для основного профиля
            let profileSides;

            if (cellType === RULE_CELL_TYPES.VERTICAL_PROFILE) {
                profileSides = ['left']; // Вертикальный профиль только на длинной стороне
            } else if (cellType === RULE_CELL_TYPES.HORIZONTAL_PROFILE) {
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

                const neighborsOnSide = this.getNeighborsOnSide(neighbors, side);

                // Если есть соседи на этой стороне
                if (neighborsOnSide.length > 0) {
                    neighborsOnSide.forEach((neighbor) => {
                        let neighborType = neighbor ? this.getRuleCellType(neighbor) : null;
                        //применяем исключения
                        neighborType = this.applyExceptionsToNeighborType(cell, cellType, side, neighborType, neighbors)

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
