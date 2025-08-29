// stores/modeling.store.js
import {defineStore} from 'pinia'
import {cloneObjectDeep} from '@utils'
import {useConfigsStore} from '@stores'
import {LEAF_HINGE_SIDE, LEAF_TYPES, PROFILE_TYPE} from '@constants';

export const useModelingStore = defineStore('modeling', {
    state: () => ({
        transoms: [],
        activeTransomId: null,
        selectedProfileId: null,
        selectedTemplateId: null,
        showDimensions: true,
        showDividers: false
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

        verticalDividers() {
            return this.colBoundaries.slice(1, -1)
        },

        horizontalDividers() {
            return this.rowBoundaries.slice(1, -1)
        },

        calculatedCells() {
            const transom = this.activeTransom;

            if (!transom || !transom.cells) return

            const rowCount = transom.rowHeights?.length || 0
            const colCount = transom.colWidths?.length || 0

            //ToDo если rowHeights и colWidths не заданы, то посчитать их от схемы
            //ToDo подумать над автоматическим добавлением ячеек с профилем

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
                const isActive = cell.type === LEAF_TYPES.ACTIVE_LEAF || cell.type === LEAF_TYPES.ACTIVE_LEAF_SMALL
                const hingeSide = cell.hingeSide || LEAF_HINGE_SIDE.LEFT

                return {
                    ...cell,
                    isActive,
                    hingeSide,
                    x,
                    y,
                    width,
                    height,
                    colSpan,
                    rowSpan,
                    offsets,
                    innerWidth,
                    innerHeight,

                }
            })
        },

        hasActiveLeaf() {
            if (!this.activeTransom || !this.activeTransom.cells) return false

            return this.activeTransom.cells.some(cell =>
                cell.type === LEAF_TYPES.ACTIVE_LEAF ||
                cell.type === LEAF_TYPES.ACTIVE_LEAF_SMALL
            )
        }
    },

    actions: {
        // Создание объекта новой фрамуги
        createTransomObject() {
            const template = this.configsStore.getTransomTemplateById(this.selectedTemplateId)
            const profile = this.configsStore.getProfileById(this.selectedProfileId)

            if (!template || !profile) {
                console.warn('Не выбран template или profile')
                return null
            }

            const transomId = `transom-${Date.now()}`

            return {
                ...cloneObjectDeep(template),
                id: transomId,
                name: `${'Фрамуга '} #${this.transoms.length + 1}`,
                profileId: this.selectedProfileId,
                profile: cloneObjectDeep(profile),
                templateId: this.selectedTemplateId,
            }
        },
        //Создание и добавление новой фрамуги
        addTransom() {
            const newTransom = this.createTransomObject();

            if (!newTransom) {
                return;
            }

            this.transoms.push(newTransom)
            this.activeTransomId = newTransom.id;

            this.updateCellSizes();
        },

        // Установка активной фрамуги
        setActiveTransom(transomId) {
            if (this.transoms.some(transom => transom.id === transomId)) {
                this.activeTransomId = transomId
            }
        },

        // Изменение типа профиля
        setProfileType(profileId) {
            if (this.configsStore.profileTypes[profileId]) {
                this.selectedProfileId = profileId

                // Если есть активная фрамуга - обновляем ее профиль
                if (this.activeTransom) {
                    this.updateActiveTransomProfile(profileId);
                }

            }
        },

        // Изменение шаблона фрамуги
        setTransomTemplate(templateId) {
            if (this.configsStore.transomTemplates[templateId]) {
                this.selectedTemplateId = templateId

                if (this.transoms.length === 0) {
                    // Если фрамуг нет — создаём новую
                    this.addTransom()
                } else if (this.activeTransom) {
                    // Если есть активная — обновляем её шаблон
                    this.updateActiveTransomTemplate(templateId)
                }
            }
        },

        // Обновление профиля активной фрамуги
        updateActiveTransomProfile(profileId) {
            const transom = this.activeTransom
            if (!transom) return;

            const profile = this.configsStore.getProfileById(profileId)
            if (profile) {
                transom.profileId = profileId
                transom.profile = cloneObjectDeep(profile)

                this.updateCellSizes();
            }

        },

        // Обновление шаблона активной фрамуги
        updateActiveTransomTemplate(templateId) {
            const transomIndex = this.transoms.findIndex(t => t.id === this.activeTransomId)

            if (transomIndex === -1) {
                return
            }

            const originalId = this.transoms[transomIndex].id
            const originalName = this.transoms[transomIndex].name

            const newTransom = this.createTransomObject()

            if (newTransom) {
                // Сохраняем оригинальные ID и имя
                newTransom.id = originalId
                newTransom.name = originalName

                // Заменяем фрамугу в массиве
                this.transoms[transomIndex] = newTransom
                this.updateCellSizes()
            }
        },

        // Расчет отступов для ячейки
        calculateOffsets(cell, rowCount, colCount) {
            const offsets = {top: 0, bottom: 0, left: 0, right: 0}
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

            const transom = this.activeTransom
            if (!transom || !transom.cells) return false

            this.updateHeights()
            this.updateWidths()

            transom.cells = cloneObjectDeep(this.calculatedCells)/*.map(cell => ({
                ...cell,
                width: cell.width,
                height: cell.height,
                offsets: cell.offsets,
                innerWidth: cell.innerWidth,
                innerHeight: cell.innerHeight
            }))*/
        },

        // Обновление ширины колонки
        updateColWidth(index, newValue) { //draft version
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
        updateRowHeight(index, newValue) { //draft version
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
            const transom = this.activeTransom
            if (!transom) return;

            const cell = this.calculatedCells[cellIndex]
            if (!cell || cell.type === PROFILE_TYPE) return

            const actualCellIndex = transom.cells.findIndex(
                c => c.row === cell.row && c.col === cell.col
            )

            if (actualCellIndex !== -1) {
                transom.cells[actualCellIndex].type = newType
                this.updateCellSizes()
            }
        },

        setTransomWidth(newWidth) {
            const transom = this.activeTransom
            if (!transom) return;

            transom.width = Math.max(
                transom.minWidth,
                Math.min(transom.maxWidth, newWidth)
            );

            this.updateCellSizes();
            return true;
        },


        setTransomHeight(newHeight) {
            const transom = this.activeTransom

            if (!transom) return;

            transom.height = Math.max(
                transom.minHeight,
                Math.min(transom.maxHeight, newHeight)
            );

            this.updateCellSizes();

            return true; //ToDo
        },

        /*calculateColumnWidthIsHasProfile(columnIndex) {
            const transom = this.activeTransom;
            if (!transom || !transom.profile || !transom.cells) return 0;

            const profile = transom.profile;
            const rowCount = transom.rowHeights?.length || 0;
            const colCount = transom.colWidths?.length || 0;

            // Находим все ячейки профиля для указанной колонки
            const profileCells = transom.cells.filter(cell =>
                cell.type === PROFILE_TYPE &&
                cell.col === columnIndex + 1 &&
                (cell.colSpan === 1 || cell.colSpan === undefined) &&
                (cell.rowSpan !== 1 && cell.rowSpan !== undefined)
            );

            console.log('profileCells', profileCells, 'columnIndex', columnIndex)

            if (profileCells.length === 0) return 0;

            // Вычисляем максимальную ширину
            const maxWidth = profileCells.reduce((max, cell) => {
                const offsets = this.calculateOffsets(cell, rowCount, colCount);
                const width = profile.width + Math.max(offsets.left, offsets.right);
                return Math.max(max, width);
            }, 0);

            return Math.round(maxWidth);
        },*/


        calculateProfileColumnWidths() {
            const transom = this.activeTransom;
            if (!transom || !transom.profile || !transom.cells) return {};

            const profile = transom.profile;
            const rowCount = transom.rowHeights?.length || 0;
            const colCount = transom.colWidths?.length || 0;

            const columnWidths = {}

            this.calculatedCells.forEach(cell => {
                if (
                    cell.type === PROFILE_TYPE &&
                    cell.height > cell.width //проверяем на вертикальность
                    /* (cell.colSpan === 1 || cell.colSpan === undefined) &&
                     (cell.rowSpan !== 1 && cell.rowSpan !== undefined)*/
                ) {
                    const colIndex = cell.col - 1;
                    if (colIndex >= 0 && colIndex < colCount) {
                        const offsets = this.calculateOffsets(cell, rowCount, colCount);
                        const width = profile.width + Math.max(offsets.left, offsets.right);
                        // Сохраняем максимальную ширину для колонки
                        columnWidths[colIndex] = Math.max(columnWidths[colIndex] || 0, width);
                    }
                }
            });

            return columnWidths;
        },

        calculateProfileRowHeights() {
            const transom = this.activeTransom;
            if (!transom || !transom.profile || !transom.cells) return {};

            const profile = transom.profile;
            const rowCount = transom.rowHeights?.length || 0;
            const colCount = transom.colWidths?.length || 0;

            const rowHeights = {};

            this.calculatedCells.forEach(cell => {
                if (
                    cell.type === PROFILE_TYPE &&
                    cell.height < cell.width //проверяем на горизонтальность
                    /*(cell.rowSpan === 1 || cell.rowSpan === undefined) &&
                    (cell.colSpan !== 1 && cell.colSpan !== undefined)*/
                ) {
                    const rowIndex = cell.row - 1;
                    if (rowIndex >= 0 && rowIndex < rowCount) {
                        const offsets = this.calculateOffsets(cell, rowCount, colCount);
                        const height = profile.width + Math.max(offsets.top, offsets.bottom);
                        rowHeights[rowIndex] = Math.max(rowHeights[rowIndex] || 0, height);
                    }
                }
            });

            return rowHeights;
        },

        updateWidths() {
            const transom = this.activeTransom
            // Пересчет colWidths пропорционально
            const currentWidth = transom.colWidths.reduce((sum, w) => sum + w, 0);
            const minWidth = transom.profile.width * 3; //ToDo min

            if (currentWidth > 0) {
                const ratio = transom.width / currentWidth;
                // получаем ширины колонок с вертикальным профилем
                const columnProfileWidths = this.calculateProfileColumnWidths()

                const newColWidths = transom.colWidths.map((width, index) => {
                    // Если колонка содержит профиль
                    if (index in columnProfileWidths) {
                        return Math.round(columnProfileWidths[index]);
                    }

                    const newWidth = Math.round(width * ratio);
                    return Math.max(minWidth, newWidth);
                });

                // Корректировка для точного соответствия validatedWidth
                const newTotalWidth = newColWidths.reduce((sum, w) => sum + w, 0);
                const diff = transom.width - newTotalWidth;

                if (diff !== 0 && newColWidths.length > 0) {
                    const lastUnlockedIndex = newColWidths.findLastIndex((_, idx) => !columnProfileWidths[idx]);
                    if (lastUnlockedIndex !== -1) {
                        newColWidths[lastUnlockedIndex] = Math.max(minWidth, newColWidths[lastUnlockedIndex] + diff);
                    }
                }

                transom.colWidths = newColWidths;
            }
        },

        updateHeights() {
            const transom = this.activeTransom
            // Пересчет rowHeights пропорционально
            const currentHeight = transom.rowHeights.reduce((sum, h) => sum + h, 0);
            const minHeight = transom.profile.width * 3; //ToDo min

            if (currentHeight > 0) {
                const ratio = transom.height / currentHeight;

                const columnProfileHeights = this.calculateProfileRowHeights()

                console.log('columnProfileHeights', columnProfileHeights)
                //ToDo min
                const newRowHeights = transom.rowHeights.map((height, index) => {
                    // Если строка содержит профиль
                    if (index in columnProfileHeights) {
                        return Math.round(columnProfileHeights[index]);
                    }

                    // if (this.isRowLocked(index)) return height; // Не изменяем заблокированные строки
                    const newHeight = Math.round(height * ratio);
                    return Math.max(minHeight, newHeight); // Минимальная высота 100
                });

                // Корректировка для точного соответствия validatedHeight
                const newTotalHeight = newRowHeights.reduce((sum, h) => sum + h, 0);
                const diff = transom.height - newTotalHeight;
                if (diff !== 0 && newRowHeights.length > 0) {
                    const lastUnlockedIndex = newRowHeights.findLastIndex((_, idx) => !columnProfileHeights[idx]);
                    if (lastUnlockedIndex !== -1) {
                        newRowHeights[lastUnlockedIndex] = Math.max(minHeight, newRowHeights[lastUnlockedIndex] + diff);
                    }
                }

                transom.rowHeights = newRowHeights;
            }
        },
        // Получение минимальных/максимальных размеров
        getTransomSizeLimits() {
            const transom = this.activeTransom
            if (!transom) return {minWidth: 100, maxWidth: 3000, minHeight: 100, maxHeight: 3000}

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
