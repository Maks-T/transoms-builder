// stores/modeling.store.js
import {defineStore} from 'pinia'
import {cloneObjectDeep} from '@utils'
import {useConfigsStore} from '@stores'
import { LEAF_TYPES, PROFILE_TYPE } from '@constants';

export const useModelingStore = defineStore('modeling', {
    state: () => ({
        transoms: [],
        activeTransomId: null,
        selectedProfileId: null,
        selectedTemplateId: null,
    }),

    getters: {
        configsStore() {
            return useConfigsStore()
        },

        activeTransom(state) {
            return state.transoms.find(transom => transom.id === state.activeTransomId)
        },

        selectedProfile(state) {
            return this.configsStore.getProfileById(state.selectedProfileId)
        },

        selectedTemplate(state) {
            return this.configsStore.getTransomTemplateById(state.selectedTemplateId)
        },

        profileTypesArray() {
            return this.configsStore.profileTypesArray
        },

        transomTemplatesArray() {
            return this.configsStore.transomTemplatesArray
        },

        colBoundaries() {
            const transom = this.activeTransom
            if (!transom || !transom.colWidths) return [0]

            let arr = [0]
            let sum = 0
            for (let w of transom.colWidths) {
                sum += w
                arr.push(sum)
            }
            return arr
        },

        rowBoundaries() {
            const transom = this.activeTransom
            if (!transom || !transom.rowHeights) return [0]

            let arr = [0]
            let sum = 0
            for (let h of transom.rowHeights) {
                sum += h
                arr.push(sum)
            }
            return arr
        },

       /* verticalHandles() {
            return this.colBoundaries.slice(1, -1)
        },

        horizontalHandles() {
            return this.rowBoundaries.slice(1, -1)
        },*/


        computedCells() {
            const transom = this.activeTransom
            if (!transom || !transom.cells) return []

            const rowCount = transom.rowHeights?.length || 0
            const colCount = transom.colWidths?.length || 0

            return transom.cells.map(cell => {
                const rowSpan = cell.rowSpan || 1
                const colSpan = cell.colSpan || 1

                let x = this.colBoundaries[cell.col - 1] || 0
                let y = this.rowBoundaries[cell.row - 1] || 0
                let width = 0
                let height = 0

                // Расчет ширины ячейки
                for (let i = 0; i < colSpan; i++) {
                    const colIndex = cell.col - 1 + i
                    if (colIndex < transom.colWidths.length) {
                        width += transom.colWidths[colIndex] || 0
                    }
                }

                // Расчет высоты ячейки
                for (let i = 0; i < rowSpan; i++) {
                    const rowIndex = cell.row - 1 + i
                    if (rowIndex < transom.rowHeights.length) {
                        height += transom.rowHeights[rowIndex] || 0
                    }
                }

                const offsets = this.calculateOffsets(cell, rowCount, colCount)
                const innerWidth = Math.max(0, width - offsets.left - offsets.right)
                const innerHeight = Math.max(0, height - offsets.top - offsets.bottom)

                return {
                    ...cell,
                    x,
                    y,
                    width,
                    height,
                    colSpan,
                    rowSpan,
                    offsets,
                    innerWidth,
                    innerHeight
                }
            })
        },

        hasActiveLeaf() {
            const transom = this.activeTransom
            if (!transom || !transom.cells) return false

            return transom.cells.some(cell =>
                cell.type === LEAF_TYPES.ACTIVE_LEAF ||
                cell.type === LEAF_TYPES.ACTIVE_LEAF_SMALL
            )
        }

    },

    actions: {
        // Создание новой фрамуги
        createTransom() { //or rename AddTransom
            const template = this.configsStore.getTransomTemplateById(this.selectedTemplateId)
            const profile = this.configsStore.getProfileById(this.selectedProfileId)

            if (!template || !profile) {
                console.warn('Не выбран template или profile')
                return null
            }

            const transomId = `transom-${Date.now()}`
            const newTransom = {
                ...cloneObjectDeep(template),
                id: transomId,
                name: `${template.name} #${this.transoms.length + 1}`,
                profileId: this.selectedProfileId,
                profile: cloneObjectDeep(profile),
                templateId: this.selectedTemplateId,
            }

            this.transoms.push(newTransom)
            this.activeTransomId = transomId

            this.logActiveTransom()
            return transomId
        },

        // Установка активной фрамуги
        setActiveTransom(transomId) {
            if (this.transoms.some(transom => transom.id === transomId)) {
                this.activeTransomId = transomId
                this.logActiveTransom()
            }
        },

        // Изменение типа профиля
        setProfileType(profileId) {
            if (this.configsStore.profileTypes[profileId]) {
                this.selectedProfileId = profileId

                // Если есть активная фрамуга - обновляем ее профиль
                if (this.activeTransom) {
                    this.updateActiveTransomProfile(profileId)
                }

                this.logActiveTransom()
            }
        },

        // Изменение шаблона фрамуги
        setTransomTemplate(templateId) {
            if (this.configsStore.transomTemplates[templateId]) {
                this.selectedTemplateId = templateId

                if (this.transoms.length === 0) {
                    // Если фрамуг нет — создаём новую
                    this.createTransom()
                } else if (this.activeTransom) {
                    // Если есть активная — обновляем её шаблон
                    this.updateActiveTransomTemplate(templateId)
                }

                this.logActiveTransom()
            }
        },

        // Обновление профиля активной фрамуги
        updateActiveTransomProfile(profileId) {
            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)

            if (transomIndex !== -1) {
                const profile = this.configsStore.getProfileById(profileId)
                if (profile) {
                    this.transoms[transomIndex].profileId = profileId
                    this.transoms[transomIndex].profile = cloneObjectDeep(profile)
                }
            }
        },

        // Обновление шаблона активной фрамуги
        updateActiveTransomTemplate(templateId) {
            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)

            if (transomIndex !== -1) {
                const template = this.configsStore.getTransomTemplateById(templateId)
                const profile = this.configsStore.getProfileById(this.selectedProfileId)

                if (template && profile) {
                    // Сохраняем ID и имя оригинальной фрамуги
                    const originalId = this.transoms[transomIndex].id
                    const originalName = this.transoms[transomIndex].name

                    // Пересоздаём объект с новым шаблоном
                    this.transoms[transomIndex] = {
                        ...cloneObjectDeep(template),
                        id: originalId,
                        name: originalName,
                        profileId: this.selectedProfileId,
                        profile: cloneObjectDeep(profile),
                        templateId: this.selectedTemplateId,
                    }
                }
            }
        },

        // Расчет отступов для ячейки
        calculateOffsets(cell, rowCount, colCount) {
            const offsets = { top: 0, bottom: 0, left: 0, right: 0 }
            const isActive = cell.type === LEAF_TYPES.ACTIVE_LEAF || cell.type === LEAF_TYPES.ACTIVE_LEAF_SMALL
            const isProfile = cell.type === PROFILE_TYPE
            const colStart = cell.col
            const colEnd = cell.col + (cell.colSpan || 1) - 1
            const rowStart = cell.row
            const rowEnd = cell.row + (cell.rowSpan || 1) - 1

            if (rowEnd === rowCount) {
                offsets.bottom = isActive ? 10 : 0
            }

            if (colStart === 1) {
                offsets.left = isActive ? 5 : (this.hasActiveLeaf ? 3 : 5)
            }

            if (colEnd === colCount) {
                offsets.right = isActive ? 5 : (this.hasActiveLeaf ? 3 : 5)
            }

            if (rowStart === 1) {
                offsets.top = isActive ? 5 : 3
            }

            if (isActive && rowStart !== 1 && rowEnd !== rowCount && colStart !== 1 && colEnd !== colCount) {
                offsets.top = 5
                offsets.bottom = 5
                offsets.left = 5
                offsets.right = 5
            }

            if (isActive && rowEnd === rowCount && colStart !== 1 && colEnd !== colCount) {
                offsets.top = 5
                offsets.left = 5
                offsets.right = 5
                offsets.bottom = 10
            }

            return offsets
        },

        // Обновление размеров ячеек
        updateCellSizes() {
            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)
            if (transomIndex === -1) return

            const computedCells = this.computedCells
            this.transoms[transomIndex].cells = computedCells.map(cell => ({
                ...cell,
                width: cell.width,
                height: cell.height,
                offsets: cell.offsets,
                innerWidth: cell.innerWidth,
                innerHeight: cell.innerHeight
            }))
        },

        // Обновление ширины колонки
        updateColWidth(index, newValue) {
            if (this.isColumnLocked(index)) return

            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)
            if (transomIndex === -1) return

            const transom = this.transoms[transomIndex]
            const newColWidths = [...transom.colWidths]
            const oldWidth = newColWidths[index]
            const delta = newValue - oldWidth

            if (index === newColWidths.length - 1) { //ToDo что делать если последняя колонка содержит профиль
                if (newColWidths[index] >= 100 && newColWidths[index - 1] >= 100) {
                    newColWidths[index] = newValue
                    newColWidths[index - 1] -= delta
                    if (newColWidths[index - 1] >= 100) {
                        this.transoms[transomIndex].colWidths = newColWidths.map(w => Math.round(w)) //this.transoms[transomIndex] -> transom
                        this.transoms[transomIndex].width = newColWidths.reduce((sum, w) => sum + w, 0)
                        this.updateCellSizes()
                    }
                }
            } else {
                if (newColWidths[index] >= 100 && newColWidths[index + 1] >= 100) {
                    newColWidths[index] = newValue
                    newColWidths[index + 1] -= delta
                    if (newColWidths[index + 1] >= 100) {
                        this.transoms[transomIndex].colWidths = newColWidths.map(w => Math.round(w))
                        this.transoms[transomIndex].width = newColWidths.reduce((sum, w) => sum + w, 0)
                        this.updateCellSizes()
                    }
                }
            }
        },

        // Обновление высоты строки
        updateRowHeight(index, newValue) {
            if (this.isRowLocked(index)) return

            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)
            if (transomIndex === -1) return

            const transom = this.transoms[transomIndex]
            const newRowHeights = [...transom.rowHeights]
            const oldHeight = newRowHeights[index]
            const delta = newValue - oldHeight

            if (index === newRowHeights.length - 1) {
                if (newRowHeights[index] >= 100 && newRowHeights[index - 1] >= 100) {
                    newRowHeights[index] = newValue
                    newRowHeights[index - 1] -= delta
                    if (newRowHeights[index - 1] >= 100) {
                        this.transoms[transomIndex].rowHeights = newRowHeights.map(h => Math.round(h))
                        this.transoms[transomIndex].height = newRowHeights.reduce((sum, h) => sum + h, 0)
                        this.updateCellSizes()
                    }
                }
            } else {
                if (newRowHeights[index] >= 100 && newRowHeights[index + 1] >= 100) {
                    newRowHeights[index] = newValue
                    newRowHeights[index + 1] -= delta
                    if (newRowHeights[index + 1] >= 100) {
                        this.transoms[transomIndex].rowHeights = newRowHeights.map(h => Math.round(h))
                        this.transoms[transomIndex].height = newRowHeights.reduce((sum, h) => sum + h, 0)
                        this.updateCellSizes()
                    }
                }
            }
        },


        // Проверка заблокированной колонки
        isColumnLocked(index) {
            const transom = this.activeTransom
            if (!transom || !transom.cells) return false

            return transom.cells.some(cell => {
                if (cell.type !== PROFILE_TYPE) return false

                const colSpan = cell.colSpan || 1
                const rowSpan = cell.rowSpan || 1
                const startCol = cell.col - 1
                const endCol = cell.col - 1 + colSpan

                // Проверяем, что индексы в пределах границ
                if (endCol > this.colBoundaries.length || startCol < 0) return false

                const width = this.colBoundaries[endCol] - this.colBoundaries[startCol]
                const height = this.rowBoundaries[cell.row - 1 + rowSpan] - this.rowBoundaries[cell.row - 1]

                return width < height && (startCol <= index && index < endCol)
            })
        },

        // Проверка заблокированной строки
        isRowLocked(index) {
            const transom = this.activeTransom
            if (!transom || !transom.cells) return false

            return transom.cells.some(cell => {
                if (cell.type !== PROFILE_TYPE) return false

                const rowSpan = cell.rowSpan || 1
                const colSpan = cell.colSpan || 1
                const startRow = cell.row - 1
                const endRow = cell.row - 1 + rowSpan

                // Проверяем, что индексы в пределах границ
                if (endRow > this.rowBoundaries.length || startRow < 0) return false

                const width = this.colBoundaries[cell.col - 1 + colSpan] - this.colBoundaries[cell.col - 1]
                const height = this.rowBoundaries[endRow] - this.rowBoundaries[startRow]

                return height < width && (startRow <= index && index < endRow)
            })
        },

        // Изменение типа ячейки
        changeCellType(cellIndex, newType) {
            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)
            if (transomIndex === -1) return

            const cell = this.computedCells[cellIndex]
            if (!cell || cell.type === PROFILE_TYPE) return

            const actualCellIndex = this.transoms[transomIndex].cells.findIndex(
                c => c.row === cell.row && c.col === cell.col
            )

            if (actualCellIndex !== -1) {
                this.transoms[transomIndex].cells[actualCellIndex].type = newType
                this.updateCellSizes()
            }
        },

        // Обновление ширины фрамуги
        setTransomWidth(newWidth) {
            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)
            if (transomIndex === -1) return false

            // Валидация
            const transom = this.transoms[transomIndex]
            const validatedWidth = Math.max(
                transom.minWidth || 100,
                Math.min(transom.maxWidth || 3000, newWidth)
            )

            this.transoms[transomIndex].width = Math.round(validatedWidth)
            this.updateCellSizes() // Пересчитываем размеры ячеек

            return true
        },

        // Обновление высоты фрамуги
        setTransomHeight(newHeight) {
            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)
            if (transomIndex === -1) return false

            // Валидация
            const transom = this.transoms[transomIndex]
            const validatedHeight = Math.max(
                transom.minHeight || 100,
                Math.min(transom.maxHeight || 3000, newHeight)
            )

            this.transoms[transomIndex].height = Math.round(validatedHeight)
            this.updateCellSizes() // Пересчитываем размеры ячеек

            return true
        },

        // Получение минимальных/максимальных размеров
        getTransomSizeLimits() {
            const transom = this.activeTransom
            if (!transom) return { minWidth: 100, maxWidth: 3000, minHeight: 100, maxHeight: 3000 }

            return {
                minWidth: transom.minWidth || 100,
                maxWidth: transom.maxWidth || 3000,
                minHeight: transom.minHeight || 100,
                maxHeight: transom.maxHeight || 3000
            }
        },

        // Логирование активной фрамуги
        logActiveTransom() {
            return
            if (this.activeTransom) {
                console.log('=== АКТИВНАЯ ФРАМУГА ===')
                console.log('ID:', this.activeTransom.id)
                console.log('Название:', this.activeTransom.name)
                console.log('Профиль:', this.activeTransom.profileId)
                console.log('Шаблон:', this.activeTransom.templateId)
                console.log('Размеры:', `${this.activeTransom.width}×${this.activeTransom.height}${this.activeTransom.unit}`)
                console.log('Ячеек:', this.activeTransom.cells.length)
                console.log('Объект:', this.activeTransom)
                console.log('=========================')
            } else {
                console.log('Нет активной фрамуги')
            }
        }
    }
})
