import {defineStore} from 'pinia'
import {useConfigsStore, useModelingStore} from '@stores'
import {PROFILE_TYPE, RULE_CELL_TYPES} from '@constants'
import {uniqId} from "@utils/index.js";

/**
 * Хранилище для расчета материалов фрамуги
 * @returns MaterialsStore
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
         * @param {TransomCell} cell - Ячейка фрамуги
         * @param {string} side - Сторона ячейки ('left', 'right', 'top', 'bottom').
         * @param {TransomCell | null} neighbor - Сосед по стороне
         * @returns {MaterialConfig[] | null} Набор конфигураций материалов или null.
         */
        getMaterialsSet(cell, side, neighbor) {

            const neighborRuleType = neighbor?.ruleType || null;

            const rule = this.rules[cell.ruleType]?.[side]?.[neighborRuleType] || null;

            if (typeof rule === 'function') {
                return rule(cell, neighbor)
            }

            return rule
        },

        /**
         * Создает объект материала.
         * @param {MaterialConfig} materialCfg - Конфигурация материала.
         * @param {TransomCell} cell - Ячейка фрамуги.
         * @param {string} side - Сторона ячейки ('left', 'right', 'top', 'bottom').
         * @param {TransomCell | null} [neighbor=null] - Соседняя ячейка, если есть.
         * @param {Transom} transom - Расчетная фрамуга
         * @returns {MaterialObject | undefined} Объект материала или undefined, если прайс не найден.
         */
        createMaterialObject(materialCfg, cell, side, neighbor = null, transom) {
            const isVertical = side === 'left' || side === 'right';

            const price = this.configsStore.prices[materialCfg.id];

            if (!price) {
                console.error(`Ошибка: прайс с id=${materialCfg.id} не найден`);
                return;
            }

            // Если нет соседа, используем размеры текущей ячейки
            let length;
            let innerLength;

            if (neighbor) {
                length = isVertical
                    ? Math.min(cell.height, neighbor.height || cell.height)
                    : Math.min(cell.width, neighbor.width || cell.width);

                innerLength = isVertical
                    ? Math.min(cell.innerHeight, neighbor.innerHeight || cell.innerHeight)
                    : Math.min(cell.innerWidth, neighbor.innerWidth || cell.innerWidth);
            } else {
                length = isVertical ? cell.height : cell.width;
                innerLength = isVertical ? cell.innerHeight : cell.innerWidth;
            }

            const params = {
                length,
                innerLength,
                profileId: transom.profileId
            };

            let quantity = 0;

            try {
                quantity = typeof materialCfg.q === 'function' ? materialCfg.q(params) : Number(materialCfg.q);
            } catch (e) {
                console.warn('Ошибка парсинга формулы определения количества материала', materialCfg, e.message);
            }

            let conditionAllow = true;

            if (materialCfg?.c && typeof materialCfg?.c === 'function') {
                conditionAllow = materialCfg.c(params)
            }

            if (conditionAllow === false) {
                return;
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
         * Вычисляет материалы для одной ячейки. Проверяет соседей ячейки и применяет правила.
         * @param {TransomCell} cell - Ячейка фрамуги.
         * @param {Transom} transom - Расчетная фрамуга.
         * @returns {MaterialObject[]} Массив объектов материалов для ячейки.
         */
        calculateMaterialsByCell(cell, transom) {
            const materials = [];

            // Определяем стороны для основного профиля
            let profileSides;

            if (cell.ruleType === RULE_CELL_TYPES.VERTICAL_PROFILE) {
                profileSides = ['left']; // Вертикальный профиль только на длинной стороне
            } else if (cell.ruleType === RULE_CELL_TYPES.HORIZONTAL_PROFILE) {
                profileSides = ['top']; // Горизонтальный профиль только на длинной стороне
            } else {
                profileSides = ['left', 'right', 'top', 'bottom']; // Для полотен — прямоугольник из профилей
            }

            //Материалы применяются только один раз на сторону
            /** @type MaterialConfig[] */
            const singleSideMaterials = [ //ToDo вынести в конфиг
                {id: transom.profile.priceId, q: (p) => p.innerLength + 100}, //основной профиль S41x39
                {id: 'prF1_G', q: 1}, //Сухарь
                {id: 'seltht4_G', q: (p) => p.innerLength + 100, c: (p) => p.profileId === 'modulasg'}, // Уплотнитель Ш1/Т1 4мм для S41х39 + 100мм запас
            ]

            // Добавляем основной профиль для указанных сторон
            profileSides.forEach((side) => {

                singleSideMaterials.forEach((singleMaterial) => {
                    const material = this.createMaterialObject(
                        singleMaterial,
                        cell,
                        side,
                        null,
                        transom);

                    if (material) {
                        materials.push(material);
                    }
                })

            });

            // Добавляем остальные материалы
            // Обрабатываем каждую сторону ячейки
            const sides = ['left', 'right', 'top', 'bottom'];

            sides.forEach((side) => {

                const neighborsOnSide = cell.neighbors[side]

                // Если есть соседи на этой стороне
                if (neighborsOnSide.length > 0) {
                    neighborsOnSide.forEach((neighbor) => {

                        const materialsSet = this.getMaterialsSet(cell, side, neighbor);

                        if (Array.isArray(materialsSet)) {
                            materialsSet.forEach((materialSet) => {
                                const material = this.createMaterialObject(materialSet, cell, side, neighbor, transom);
                                if (material) {
                                    materials.push(material);
                                }
                            });
                        }
                    });
                } else {
                    // Обработка случая, когда нет соседей (граница фрамуги)
                    let materialsSet = this.getMaterialsSet(cell, side, null);

                    if (Array.isArray(materialsSet)) {
                        materialsSet.forEach((materialSet) => {
                            const material = this.createMaterialObject(materialSet, cell, side, null, transom);
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
                materials[cell.idx] = this.calculateMaterialsByCell(cell, transom);
            });

            return materials;
        },
    },
});
