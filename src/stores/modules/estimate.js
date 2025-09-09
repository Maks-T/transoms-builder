// stores/estimate.store.js
import { defineStore } from 'pinia'
import { useModelingStore } from '@stores'
import { PROFILE_TYPE, CELL_TYPES } from '@constants'

// Константы для типов профилей
export const ATTACH_PROFILE_TYPES = {
    MOUNT: 'mountProfile',      // АВД 0159
    CONNECTOR: 'connectorProfile', // S5х32
    ADAPTER: 'adapterProfile'   // АВД 7967
}


const PROFILE_LENGTH_ADJUSTMENT = 0;

const rules = {
    // Глухое полотно
    inactive: {
        left: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.MOUNT,
            active: ATTACH_PROFILE_TYPES.ADAPTER,
            profile: ATTACH_PROFILE_TYPES.MOUNT
        },
        right: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            active: ATTACH_PROFILE_TYPES.ADAPTER,
            profile: ATTACH_PROFILE_TYPES.MOUNT
        },
        top: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.MOUNT,
            active: null,
            profile: ATTACH_PROFILE_TYPES.MOUNT
        },
        bottom: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            active: ATTACH_PROFILE_TYPES.ADAPTER,
            profile: null
        }
    },

    // Активное полотно
    active: {
        left: {
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            profile: ATTACH_PROFILE_TYPES.CONNECTOR
        },
        right: {
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            profile: ATTACH_PROFILE_TYPES.CONNECTOR
        },
        top: {
            null: ATTACH_PROFILE_TYPES.CONNECTOR,
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            profile: ATTACH_PROFILE_TYPES.CONNECTOR
        },
        bottom: {
            // Активное полотно снизу не требует дополнительных профилей
        }
    },

    // Короб (профиль)
    profile: {
        left: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.ADAPTER,
            active: ATTACH_PROFILE_TYPES.ADAPTER
        },
        right: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.ADAPTER,
            active: ATTACH_PROFILE_TYPES.ADAPTER
        },
        top: {
            null: ATTACH_PROFILE_TYPES.MOUNT
        },
        bottom: {
            inactive: ATTACH_PROFILE_TYPES.ADAPTER,
            active: ATTACH_PROFILE_TYPES.ADAPTER
        }
    }
}

export const useEstimateStore = defineStore('estimate', {
    state: () => ({
    }),

    getters: {
        modelingStore() {
            return useModelingStore()
        },
    },

    actions: {
        getCellType(cell) {
            if (cell.type === PROFILE_TYPE) return CELL_TYPES.PROFILE;
            if (cell.isActive) return CELL_TYPES.ACTIVE;
            return CELL_TYPES.INACTIVE;
        },

        getNeighborsOnSide(neighbors, side) {
            return neighbors[side] && neighbors[side].length > 0 ? neighbors[side] : [];
        },

        getProfileRule(cellType, side, neighborType) {
            return rules[cellType]?.[side]?.[neighborType] || null;
        },

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
                id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                cellIdx: cell.idx,
                cellType: cell.type,
                side: side,
                profileType: profileType,
                originLength: Math.round(length),
                length: Math.round(length) + (PROFILE_LENGTH_ADJUSTMENT ?? 100), // минимальный запас длины профиля
                isVertical: isVertical,
                neighborIdx: neighbor ? neighbor.idx : null,
                timestamp: Date.now()
            };
        },

        calculateAttachCellProfiles(cell) {
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
                        const profileRule = this.getProfileRule(cellType, side, neighborType);

                        if (profileRule) {
                            const profile = this.createProfileObject(profileRule, cell, side, neighbor);
                            profiles[side].push(profile);
                        }
                    });
                } else {
                    // Обработка случая, когда нет соседей (граница фрамуги)
                    const profileRule = this.getProfileRule(cellType, side, null);
                    if (profileRule) {
                        const profile = this.createProfileObject(profileRule, cell, side, null);
                        profiles[side].push(profile);
                    }
                }
            });

            return profiles;
        },

        /**
         * Вычисляет профили для всех ячеек
         */
        calculateAllCellAttachProfiles(cells) {

            if (!cells || !Array.isArray(cells)) {
                console.warn('Нет ячеек для расчета профилей');
                return {};
            }

            const attachProfiles = {};

            cells.forEach(cell => {
                if (cell && cell.idx !== undefined) {
                    attachProfiles[cell.idx] = this.calculateAttachCellProfiles(cell);
                }
            });

            return attachProfiles;
        },

        /**
         * Вычисляет суммы длин профилей, сгруппированные по типам для каждой ячейки
         */
        calculateProfileSumLength(attachProfiles) {
            const profileSums = {};

            // Проходим по всем ячейкам в attachProfiles
            Object.entries(attachProfiles).forEach(([cellIdx, cellProfiles]) => {
                // Инициализируем объект для сумм профилей текущей ячейки
                profileSums[cellIdx] = { //ToDo iterate by types
                    [ATTACH_PROFILE_TYPES.MOUNT]: 0,
                    [ATTACH_PROFILE_TYPES.CONNECTOR]: 0,
                    [ATTACH_PROFILE_TYPES.ADAPTER]: 0
                };

                // Суммируем длины профилей по типам
                Object.values(cellProfiles).forEach(sideProfiles => {
                    sideProfiles.forEach(profile => {
                        if (profile && profile.profileType && profile.length) {
                            profileSums[cellIdx][profile.profileType] += profile.length;
                        }
                    });
                });
            });

            return profileSums;
        }

    }
});