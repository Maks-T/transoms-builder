// stores/estimate.store.js
import { defineStore } from 'pinia'
import { useModelingStore, useConfigsStore } from '@stores'
import { LEAF_TYPES, PROFILE_TYPE } from '@constants'

/**
 * Создает хранилище для расчета профилей на основе моделирования фрамуг.
 * @returns {EstimateStore} Хранилище расчета профилей
 */
export const useEstimateStore = defineStore('estimate', {
    state: () => ({}),

    getters: {
        /**
         * Возвращает экземпляр хранилища моделирования
         * @returns ModelingStore
         */
        modelingStore() {
            return useModelingStore()
        },

        /**
         * Возвращает экземпляр хранилища конфигураций
         * @returns ConfigsStore
         */
        configsStore() {
            return useConfigsStore()
        },

        /**
         * Получает дополнительные профили для текущего основного профиля
         * @returns {{mountProfile: {id: string, gradeName: string}, connectorProfile: {id: string, gradeName: string}, adapterProfile: {id: string, gradeName: string}}}
         */
        additionalProfiles() { //ToDo
            const transom = this.modelingStore.activeTransom
            if (!transom || !transom.profileId) return null

            const profile = this.configsStore.getProfileById(transom.profileId)
            return profile && profile.additionalProfiles ? profile.additionalProfiles[0] : null
        },

        /**
         * Вычисляет дополнительные профили (крепления) для каждой ячейки активной фрамуги по сторонам
         * @returns {Array<{cellIdx: number, profiles: {top?: {profileIds: string[], length: number}, bottom?: {profileIds: string[], length: number}, left?: {profileIds: string[], length: number}, right?: {profileIds: string[], length: number}}}>}
         */
        additionalProfilesPerCell() {
            const modeling = this.modelingStore
            const transom = modeling.activeTransom
            if (!transom || !transom.cells) return []

            const additionalProfiles = this.additionalProfiles
            if (!additionalProfiles) return []

            const cells = modeling.calculatedCells || []
            const hasActive = modeling.hasActiveLeaf
            const directions = ['top', 'bottom', 'left', 'right']

            const result = []

            cells.forEach(cell => {
                const cellProfiles = {
                    cellIdx: cell.idx,
                    profiles: {}
                }

                directions.forEach(dir => {
                    const neighCells = modeling.getNeighbors(cell)[dir]
                    let neighborType

                    if (neighCells.length === 0) {
                        neighborType = 'external'
                    } else {
                        const neigh = neighCells[0]
                        neighborType = this.getSimpleType(neigh.type) //ToDo
                    }

                    const cellType = this.getSimpleType(cell.type)
                    const profileIds = this.getProfileForSide(cellType, neighborType, dir, hasActive)

                    if (profileIds && profileIds.length > 0) {
                        cellProfiles.profiles[dir] = {
                            profiles: profileIds.map(profileId => ({
                                id: profileId,
                                length: (dir === 'top' || dir === 'bottom')
                                    ? (cell.type === PROFILE_TYPE ? cell.width : cell.innerWidth)
                                    : (profileId === additionalProfiles.mountProfile.id || cell.type === PROFILE_TYPE ? cell.height : cell.innerHeight)
                            }))
                        }
                    }
                })

                result.push(cellProfiles)
            })

            return result
        },

        /**
         * Вычисляет профили для каждой ячейки (включая каркасный профиль)
         * @returns {Array<{cellIdx: number, materials: Array<{id: string, unit: string, quantity: number}>}>}
         */
        profilesPerCell() {
            const modeling = this.modelingStore
            const transom = modeling.activeTransom
            if (!transom || !transom.cells || !transom.profile) return []

            const cells = modeling.calculatedCells || []
            const result = []

            cells.forEach(cell => {
                const materials = []

                // Добавляем каркасный профиль
                const frameLength = cell.type === PROFILE_TYPE
                    ? 2 * (cell.width + cell.height) / 1000 // м, для profile используем width и height
                    : 2 * (cell.innerWidth + cell.innerHeight) / 1000 // м, для leaf используем inner размеры

                materials.push({
                    id: transom.profile.id, // ID основного профиля (например, modulasg, spaziosg)
                    unit: 'мп',
                    quantity: frameLength
                })

                // Добавляем дополнительные профили из additionalProfilesPerCell
                materials.push(...this.getAdditionalProfilesForCell(cell.idx))

                result.push({
                    cellIdx: cell.idx,
                    materials
                })
            })

            return result
        },

        /**
         * Вычисляет общие длины всех профилей, включая каркасный
         * @returns {{ [key: string]: number }} Объект с ID профилей и их общими длинами в м
         */
        totalProfiles() {
            const modeling = this.modelingStore
            const transom = modeling.activeTransom
            if (!transom || !transom.cells) return {}

            const additionalProfiles = this.additionalProfiles
            if (!additionalProfiles) return {}

            // Инициализация длин профилей
            let lengths = {
                [transom.profile.id]: 0,
                [additionalProfiles.mountProfile.id]: 0,
                [additionalProfiles.connectorProfile.id]: 0,
                [additionalProfiles.adapterProfile.id]: 0
            }

            // Расчет профилей из profilesPerCell
            this.profilesPerCell.forEach(cellData => {
                cellData.materials.forEach(mat => {
                    lengths[mat.id] = (lengths[mat.id] || 0) + mat.quantity
                })
            })

            return lengths
        },
    },

    actions: {
        /**
         * @private
         * Возвращает упрощенный тип ячейки
         * @param {string} type Тип ячейки
         * @returns {string} 'active' | 'inactive' | 'profile'
         */
        getSimpleType(type) {
            if (type === LEAF_TYPES.ACTIVE_LEAF || type === LEAF_TYPES.ACTIVE_LEAF_SMALL) return 'active'
            if (type === LEAF_TYPES.INACTIVE_LEAF || type === LEAF_TYPES.INACTIVE_LEAF_SMALL) return 'inactive'
            if (type === PROFILE_TYPE) return 'profile'
            return 'unknown'
        },

        /**
         * @private
         * Определяет профили для крепления на стороне ячейки к соседу
         * @param {string} cellType Упрощенный тип текущей ячейки
         * @param {string} neighborType Упрощенный тип соседней ячейки
         * @param {string} dir Направление стороны ('top', 'bottom', 'left', 'right')
         * @param {boolean} hasActive Наличие активных полотен в фрамуге
         * @returns {string[]} Массив ID профилей или пустой массив
         */
        getProfileForSide(cellType, neighborType, dir, hasActive) {
            const additionalProfiles = this.additionalProfiles
            if (!additionalProfiles) return []

            const profileIds = []

            // Логика для внешних сторон
            if (neighborType === 'external') {
                if (cellType === 'inactive' || cellType === 'profile') {
                    profileIds.push(additionalProfiles.mountProfile.id) // p0159_G
                } else if (cellType === 'active') {
                    profileIds.push(additionalProfiles.connectorProfile.id) // s532_G
                }
                return profileIds
            }

            // Логика для соединений между ячейками
            if (cellType === 'profile' && neighborType === 'inactive') {
                // Если текущая ячейка - короб, а соседняя - глухое полотно,
                // используются два профиля: адаптер (АВД 7967) для соединения короба с полотном
                // и крепежный профиль (АВД 0159) для дополнительной фиксации
                profileIds.push(additionalProfiles.adapterProfile.id) // p7967_G
                profileIds.push(additionalProfiles.mountProfile.id) // p0159_G
            } else if (cellType === 'inactive' && neighborType === 'profile') {
                // Если текущая ячейка - глухое полотно, а соседняя - короб,
                // используется только крепежный профиль (АВД 0159) для фиксации полотна к коробу
                profileIds.push(additionalProfiles.mountProfile.id) // p0159_G
            } else if (cellType === 'profile' && neighborType === 'active') {
                // Если текущая ячейка - короб, а соседняя - активное полотно,
                // используются два профиля: адаптер (АВД 7967) для соединения короба с активным полотном
                // и соединительный профиль (S 5х32) для дополнительной фиксации активного полотна
                profileIds.push(additionalProfiles.adapterProfile.id) // p7967_G
                profileIds.push(additionalProfiles.connectorProfile.id) // s532_G
            } else if (cellType === 'active' && neighborType === 'profile') {
                // Если текущая ячейка - активное полотно, а соседняя - короб,
                // используется только соединительный профиль (S 5х32) для соединения активного полотна с коробом
                profileIds.push(additionalProfiles.connectorProfile.id) // s532_G
            } else if (cellType === 'inactive' && neighborType === 'active') {
                // Если текущая ячейка - глухое полотно, а соседняя - активное полотно,
                // используются два профиля: адаптер (АВД 7967) и соединительный (S 5х32)
                // для соединения глухого и активного полотен
                profileIds.push(additionalProfiles.adapterProfile.id) // p7967_G
                profileIds.push(additionalProfiles.connectorProfile.id) // s532_G
            } else if (cellType === 'active' && neighborType === 'inactive') {
                // Если текущая ячейка - активное полотно, а соседняя - глухое полотно,
                // используется только соединительный профиль (S 5х32) для их соединения
                profileIds.push(additionalProfiles.connectorProfile.id) // s532_G
            } else if (cellType === 'inactive' && neighborType === 'inactive' && !hasActive) {
                // Если обе ячейки - глухие полотна и в фрамуге нет активных полотен,
                // выбор профиля зависит от направления стороны
                const isHorizontal = (dir === 'top' || dir === 'bottom')
                if (isHorizontal) {
                    // Для горизонтальных сторон (top, bottom)
                    if (dir === 'bottom') {
                        // На нижней стороне используется крепежный профиль (АВД 0159)
                        profileIds.push(additionalProfiles.mountProfile.id) // p0159_G
                    } else if (dir === 'top') {
                        // На верхней стороне используется соединительный профиль (S 5х32)
                        profileIds.push(additionalProfiles.connectorProfile.id) // s532_G
                    }
                } else {
                    // Для вертикальных сторон (left, right)
                    if (dir === 'right') {
                        // На правой стороне используется крепежный профиль (АВД 0159)
                        profileIds.push(additionalProfiles.mountProfile.id) // p0159_G
                    } else if (dir === 'left') {
                        // На левой стороне используется соединительный профиль (S 5х32)
                        profileIds.push(additionalProfiles.connectorProfile.id) // s532_G
                    }
                }
            }

            return [...new Set(profileIds)] // Удаляем возможные дубликаты
        },

        /**
         * @private
         * Возвращает дополнительные профили для ячейки в формате материалов
         * @param {number} cellIdx Индекс ячейки
         * @returns {Array<{id: string, unit: string, quantity: number}>}
         */
        getAdditionalProfilesForCell(cellIdx) {
            const cellProfiles = this.additionalProfilesPerCell.find(p => p.cellIdx === cellIdx)
            if (!cellProfiles) return []

            const materials = []
            Object.values(cellProfiles.profiles).forEach(side => {
                side.profiles.forEach(profile => {
                    materials.push({
                        id: profile.id,
                        unit: 'мп',
                        quantity: profile.length / 1000 // в метрах
                    })
                })
            })
            return materials
        }
    }
})