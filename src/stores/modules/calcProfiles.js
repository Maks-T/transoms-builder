
import { defineStore } from 'pinia'
import {useConfigsStore, useModelingStore} from '@stores'
import { PROFILE_TYPE, CELL_TYPES, ATTACH_PROFILE_TYPES } from '@constants'
import {uniqId} from "@utils/index.js";
import {ATTACH_PROFILE_RULES} from "@src/configs/index.js";

// Константы для типов профилей

const PROFILE_LENGTH_ADJUSTMENT = 100;

/**
 * Хранилище для расчета профилей фрамуги.
 * Управляет вычислением основных и дополнительных (attach) профилей для ячеек,
 * @returns {CalcProfilesStore} хранилища моделирования
 */
export const useCalcProfilesStore = defineStore('calc-profiles', {
    state: () => ({

    }),

    getters: {
        /**
         * Возвращает экземпляр хранилища конфигураций
         * @returns Хранилище конфигураций
         */
        configsStore() {
            return useConfigsStore()
        },
        /**
         * Возвращает экземпляр хранилища моделирования
         * @returns Хранилище моделирования
         */
        modelingStore() {
            return useModelingStore()
        },

        rules() {
            return ATTACH_PROFILE_RULES //ToDO
        }

    },

    actions: {
        /**
         * Определяет упрощенный тип ячейки на основе ее свойств.
         * @param {TransomCell} cell - Ячейка фрамуги.
         * @returns {string} Тип ячейки: 'profile', 'active', 'inactive'.
         */
        getCellType(cell) {
            if (cell.type === PROFILE_TYPE) return CELL_TYPES.PROFILE;
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
         * Возвращает правило для выбора типа дополнительного профиля.
         * @param {string} cellType - Упрощенный тип текущей ячейки ('profile', 'active', 'inactive').
         * @param {string} side - Сторона ячейки ('left', 'right', 'top', 'bottom').
         * @param {string | null} neighborType - Тип соседней ячейки или null, если соседа нет.
         * @returns {string | null} Тип профиля ('mountProfile', 'connectorProfile', 'adapterProfile') или null.
         */
        getAttachProfileRule(cellType, side, neighborType) {
            return this.rules[cellType]?.[side]?.[neighborType] || null;
        },

        /**
         * Создает объект профиля для ячейки.
         * @param {string} profileType - Тип профиля (например, 'mainProfile', 'mountProfile').
         * @param {TransomCell} cell - Ячейка фрамуги.
         * @param {string} side - Сторона ячейки ('left', 'right', 'top', 'bottom').
         * @param {TransomCell | null} [neighbor=null] - Соседняя ячейка, если есть.
         * @returns {ProfileObject} Объект профиля с параметрами.
         */
        createProfileObject(profileType, cell, side, neighbor = null) {
            const isVertical = side === 'left' || side === 'right';

            // Если нет соседа, используем размеры текущей ячейки
            let length;
            if (neighbor) {
                length = isVertical ?
                    Math.min(cell.innerHeight, neighbor.innerHeight || cell.innerHeight) :
                    Math.min(cell.innerWidth, neighbor.innerWidth || cell.innerWidth);
            } else {
                length = isVertical ? cell.innerHeight : cell.innerWidth;
            }

            return {
                id: uniqId('profile'),
                cellIdx: cell.idx,
                cellType: cell.type,
                side: side,
                profileType: profileType,
                originLength: Math.round(length),
                length: Math.round(length) + (PROFILE_LENGTH_ADJUSTMENT ?? 100), // минимальный запас длины профиля
                //isVertical: isVertical,
                neighborIdx: neighbor ? neighbor.idx : null,
               // timestamp: Date.now()
            };
        },

        /**
         * Вычисляет дополнительные (attach) профили для одной ячейки.
         * Проверяет соседей ячейки и применяет правила .
         * @param {TransomCell} cell - Ячейка фрамуги.
         * @returns {CellProfiles} Объект с профилями, сгруппированными по сторонам.
         */
        calculateAttachProfilesByCell(cell) {
            const profiles = {};
            const cellType = this.getCellType(cell);

            // Получаем соседей ячейки
            const neighbors = this.modelingStore.getNeighbors(cell);
            if (!neighbors) {
                console.warn('Не удалось получить соседей для ячейки', cell.idx);
                return profiles;
            }

            // Обрабатываем каждую сторону ячейки
            const sides = ['left', 'right', 'top', 'bottom'];

            sides.forEach(side => {
                if (
                    cellType === CELL_TYPES.PROFILE &&
                    ((cell.isVertical && ['top', 'bottom'].includes(side)) ||
                        (cell.isHorizontal && ['left', 'right'].includes(side)))
                ) {
                    return; //исключаем из расчета стороны ширины у ячейки типа Профиль (короб)
                }

                const neighborsOnSide = this.getNeighborsOnSide(neighbors, side);
                profiles[side] = [];

                // Если есть соседи на этой стороне
                if (neighborsOnSide.length > 0) {
                    neighborsOnSide.forEach(neighbor => {
                        const neighborType = neighbor ? this.getCellType(neighbor) : null;
                        const profileRule = this.getAttachProfileRule(cellType, side, neighborType);

                        if (profileRule) {
                            const profile = this.createProfileObject(profileRule, cell, side, neighbor);
                            profiles[side].push(profile);
                        }
                    });
                } else {
                    // Обработка случая, когда нет соседей (граница фрамуги)
                    const profileRule = this.getAttachProfileRule(cellType, side, null);
                    if (profileRule) {
                        const profile = this.createProfileObject(profileRule, cell, side, null);
                        profiles[side].push(profile);
                    }
                }
            });

            return profiles;
        },

        /**
         * Вычисляет дополнительные (attach) профили для всех ячеек.
         * @param {TransomCell[]} cells - Массив ячеек фрамуги.
         * @returns {AllProfiles} Объект с профилями для всех ячеек, индексированный по cellIdx.
         */
        calculateAllAttachProfilesByCells(cells) {

            if (!cells || !Array.isArray(cells)) {
                console.warn('Нет ячеек для расчета профилей');
                return {};
            }

            const attachProfiles = {};

            cells.forEach(cell => {
                if (cell && cell.idx !== undefined) {
                    attachProfiles[cell.idx] = this.calculateAttachProfilesByCell(cell);
                }
            });

            return attachProfiles;
        },


        /**
         * Вычисляет основные профили для одной ячейки.
         * @param {TransomCell} cell - Ячейка фрамуги.
         * @returns {CellProfiles} Объект с основными профилями, сгруппированными по сторонам.
         */
        calculateMainProfilesForCell(cell) {
            const profiles = {};
            const cellType = this.getCellType(cell);

            let sides;

            if (cellType === CELL_TYPES.PROFILE) {
                if (cell.isVertical) {
                    sides = ['left'];
                } else if (cell.isHorizontal) {
                    sides = ['top'];
                } else {
                    return profiles; // Если не вертикальный и не горизонтальный, пропускаем
                }

            } else {
                sides = ['left', 'right', 'top', 'bottom'];
            }

            sides.forEach(side => {
                profiles[side] = [];
                const profile = this.createProfileObject('mainProfile', cell, side, null);
                profiles[side].push(profile);
            });

            return profiles;
        },

        /**
         * Вычисляет основные профили для всех ячеек.
         * @param {TransomCell[]} cells - Массив ячеек фрамуги.
         * @returns {AllProfiles} Объект с основными профилями для всех ячеек, индексированный по cellIdx.
         */
        calculateAllMainProfiles(cells) {
            if (!cells || !Array.isArray(cells)) {
                console.warn('Нет ячеек для расчета основных профилей');
                return {};
            }

            const mainProfiles = {};

            cells.forEach(cell => {
                if (cell && cell.idx !== undefined) {
                    mainProfiles[cell.idx] = this.calculateMainProfilesForCell(cell);
                }
            });

            return mainProfiles;
        },

    }
});