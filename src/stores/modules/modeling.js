// stores/modeling.store.js
import {defineStore} from 'pinia'
import {cloneObjectDeep} from '@utils'
import {useConfigsStore} from '@stores'
import {LEAF_HINGE_SIDE, LEAF_SWING_DIRECTION, LEAF_TYPES, PROFILE_TYPE} from '@constants';

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

                // Дополнительные свойства для расчетов
                cell.isActive = cell.type === LEAF_TYPES.ACTIVE_LEAF || cell.type === LEAF_TYPES.ACTIVE_LEAF_SMALL
                cell.hingeSide = cell.hingeSide || LEAF_HINGE_SIDE.LEFT //петли слева/справа
                cell.swingDirection = cell.swingDirection || LEAF_SWING_DIRECTION.OUTWARD //открывание наружу/внутрь

                if (cell.type === PROFILE_TYPE) {
                    if (width > height) {
                        // Горизонтальная ячейка
                        cell.isHorizontal = true;
                    } else if (width < height) {
                        // Вертикальная ячейка
                        cell.isVertical = true;
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
        getNeighbors(currentCell) {
            const transom = this.activeTransom;
            if (!transom || !transom.cells) return {top: [], bottom: [], left: [], right: []};

            const neighbors = {top: [], bottom: [], left: [], right: []};
            const cells = transom.cells;

            cells.forEach(cell => {
                if (cell === currentCell) return;

                const colStart = cell.col;
                const colEnd = cell.col + (cell.colSpan || 1) - 1;
                const rowStart = cell.row;
                const rowEnd = cell.row + (cell.rowSpan || 1) - 1;

                const currentColStart = currentCell.col;
                const currentColEnd = currentCell.col + (currentCell.colSpan || 1) - 1;
                const currentRowStart = currentCell.row;
                const currentRowEnd = currentCell.row + (currentCell.rowSpan || 1) - 1;

                // Сверху: нижняя граница другой ячейки касается верхней текущей
                if (rowEnd === currentRowStart - 1 && Math.max(colStart, currentColStart) <= Math.min(colEnd, currentColEnd)) {
                    neighbors.top.push(cell);
                }

                // Снизу: верхняя граница другой ячейки касается нижней текущей
                if (rowStart === currentRowEnd + 1 && Math.max(colStart, currentColStart) <= Math.min(colEnd, currentColEnd)) {
                    neighbors.bottom.push(cell);
                }

                // Слева: правая граница другой ячейки касается левой текущей
                if (colEnd === currentColStart - 1 && Math.max(rowStart, currentRowStart) <= Math.min(rowEnd, currentRowEnd)) {
                    neighbors.left.push(cell);
                }

                // Справа: левая граница другой ячейки касается правой текущей
                if (colStart === currentColEnd + 1 && Math.max(rowStart, currentRowStart) <= Math.min(rowEnd, currentRowEnd)) {
                    neighbors.right.push(cell);
                }
            });

            return neighbors;
        },

       // Расчет отступов для ячейки
        calculateOffsets(cell, rowCount, colCount) {

            const offsets = {top: 0, bottom: 0, left: 0, right: 0}
            const isActive = /*cell.isActive ||*/ cell.type === LEAF_TYPES.ACTIVE_LEAF || cell.type === LEAF_TYPES.ACTIVE_LEAF_SMALL //ToDo cell.isActive
            const isProfile = cell.type === PROFILE_TYPE
            const isLeaf = cell.type !== PROFILE_TYPE
            const colStart = cell.col
            const colEnd = cell.col + (cell.colSpan || 1) - 1
            const rowStart = cell.row
            const rowEnd = cell.row + (cell.rowSpan || 1) - 1

            // Получаем соседние соседние ячейки
            const neighbors = this.getNeighbors(cell);

            // Базовые offsets
            // Если ячейка находится в последней строке фрамуги (нижняя граница фрамуги)
            if (rowEnd === rowCount) {
                // Для активного полотна (isActive) устанавливаем нижний отступ 10 мм,
                // иначе (для профиля или других типов) отступ 0 мм
                offsets.bottom = isActive ? 10 : 0;
            }

            // Если ячейка находится в первой колонке (левая граница фрамуги)
            if (colStart === 1) {
                // Для активного полотна устанавливаем левый отступ 5 мм.
                // Для неактивных ячеек: если в фрамуге есть активные полотна (this.hasActiveLeaf),
                // отступ 3 мм, иначе 5 мм (для согласованности с общими отступами)
                offsets.left = isActive ? 5 : (this.hasActiveLeaf ? 3 : 5);
            }

            // Если ячейка находится в последней колонке (правая граница фрамуги)
            if (colEnd === colCount) {
                // Аналогично для правого отступа: 5 мм для активного полотна,
                // 3 мм для неактивных, если есть активные полотна, иначе 5 мм
                offsets.right = isActive ? 5 : (this.hasActiveLeaf ? 3 : 5);
            }

            // Если ячейка находится в первой строке (верхняя граница фрамуги)
            if (rowStart === 1) {
                // Для активного полотна верхний отступ 5 мм,
                // для неактивных — 3 мм (меньший отступ для профилей или других типов)
                offsets.top = isActive ? 5 : 3;
            }

            // Если ячейка — активное полотно и находится внутри фрамуги
            // (не касается ни одной из границ: ни первой/последней строки, ни первой/последней колонки)
            if (isActive && rowStart !== 1 && rowEnd !== rowCount && colStart !== 1 && colEnd !== colCount) {
                // Устанавливаем отступы 5 мм со всех сторон для активного полотна,
                // чтобы обеспечить одинаковое расстояние от соседних ячеек
                offsets.top = 5;
                offsets.bottom = 5;
                offsets.left = 5;
                offsets.right = 5;
            }

            // Корретировка отступов с учетом соседей
            if (isLeaf) {
                // Если граничит с вертикальным профилем (слева или справа) → со всех сторон 5 мм
                if (
                    neighbors.left.some(n => n && n.isVertical && n.type === PROFILE_TYPE) ||
                    neighbors.right.some(n => n && n.isVertical && n.type === PROFILE_TYPE)
                ) {
                    offsets.top = offsets.bottom = offsets.left = offsets.right = 5;
                }

                // Если граничит с горизонтальным профилем (сверху или снизу) → со всех сторон 5 мм
                if (
                    neighbors.top.some(n => n && n.isHorizontal && n.type === PROFILE_TYPE) ||
                    neighbors.bottom.some(n => n && n.isHorizontal && n.type === PROFILE_TYPE)
                ) {
                    offsets.top = offsets.bottom = offsets.left = offsets.right = 5;
                }

                // Если граничит с другим активным полотном справа → убираем правый отступ
                if (neighbors.right.some(n => n && n.isActive && n.col > cell.col)) {
                    offsets.right = 0;
                }

                // Если граничит с другим активным полотном снизу → убираем нижний отступ
                if (neighbors.bottom.some(n => n && n.isActive && n.row > cell.row)) {
                    offsets.bottom = 0;
                }
            }

            // Если ячейка — активное полотно, находится в последней строке,
            // но не в первой/последней колонке (т.е. нижняя граница фрамуги, но не боковые)
            if (isActive && rowEnd === rowCount && colStart !== 1 && colEnd !== colCount) {
                // Устанавливаем верхний и боковые отступы 5 мм,
                // нижний отступ 10 мм (учитываем нижнюю границу фрамуги для активного полотна)
                offsets.top = 5;
                offsets.left = 5;
                offsets.right = 5;
                offsets.bottom = 10;
            }

            return offsets
        },

       /* calculateOffsets(cell, rowCount, colCount) {
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
*/
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
                    cell.isVertical
                ) {
                    const colIndex = cell.col - 1;
                    if (colIndex >= 0 && colIndex < colCount) {
                        const offsets = cell.offsets// this.calculateOffsets(cell, rowCount, colCount);
                        const width = profile.width + offsets.left + offsets.right;

                        columnWidths[colIndex] = Math.max(profile.width, width);
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
                    cell.isHorizontal
                ) {
                    const rowIndex = cell.row - 1;
                    if (rowIndex >= 0 && rowIndex < rowCount) {
                        const offsets = cell.offsets //this.calculateOffsets(cell, rowCount, colCount);
                        const height = profile.width + offsets.top + offsets.bottom;
                        rowHeights[rowIndex] = Math.max(profile.width, height);
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
                console.log('columnProfileWidths', columnProfileWidths)

                const newColWidths = transom.colWidths.map((width, index) => {
                    // Если колонка содержит профиль
                    if (index in columnProfileWidths) {
                        return Math.round(columnProfileWidths[index]);
                    }

                  //  return Math.max(minWidth, width);

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

                  /*  return Math.max(minHeight, height);*/

                    const newHeight = Math.round(height * ratio);
                    console.log('height', height, 'newHeight', newHeight, )

                    return Math.max(minHeight, newHeight); // Минимальная высота 100*/
                });

                console.log('newRowHeights before', newRowHeights)
                // Корректировка для точного соответствия validatedHeight
                const newTotalHeight = newRowHeights.reduce((sum, h) => sum + h, 0);
                const diff = transom.height - newTotalHeight;

                if (diff !== 0 && newRowHeights.length > 0) {
                    const lastUnlockedIndex = newRowHeights.findLastIndex((_, idx) => !columnProfileHeights[idx]);
                    if (lastUnlockedIndex !== -1) {
                        newRowHeights[lastUnlockedIndex] = Math.max(minHeight, newRowHeights[lastUnlockedIndex] + diff);
                    }
                }
                console.log('newRowHeights after', newRowHeights)
                transom.rowHeights = newRowHeights;
            }
        },

        updateColWidth(index, newValue) {
            const transom = this.activeTransom
            if (!transom || !transom.colWidths || index < 0 || index >= transom.colWidths.length) return false;

            const minWidth = transom.profile.width * 3;
            const maxWidth = transom.maxWidth;

            const newWidth = Math.max(minWidth, Math.min(maxWidth, newValue));

            const currentTotalWidth = transom.colWidths.reduce((sum, w) => sum + w, 0);
            const widthDiff = newWidth - transom.colWidths[index];

            if (widthDiff === 0) return true;

            transom.colWidths[index] = newWidth;

            const newTotalWidth = transom.colWidths.reduce((sum, w) => sum + w, 0);
            if (newTotalWidth !== transom.width) {
                transom.width = newTotalWidth;
            }

            this.updateCellSizes();
            return true;
        },

        updateRowHeight(index, newValue) {
            const transom = this.activeTransom
            if (!transom || !transom.rowHeights || index < 0 || index >= transom.rowHeights.length) return false;

            const minHeight = transom.profile.width * 3;
            const maxHeight = transom.maxHeight || 3000;
            const newHeight = Math.max(minHeight, Math.min(maxHeight, newValue));

            const currentTotalHeight = transom.rowHeights.reduce((sum, h) => sum + h, 0);
            const heightDiff = newHeight - transom.rowHeights[index];

            if (heightDiff === 0) return true;

            transom.rowHeights[index] = newHeight;

            const newTotalHeight = transom.rowHeights.reduce((sum, h) => sum + h, 0);
            if (newTotalHeight !== transom.height) {
                transom.height = newTotalHeight;
            }

            this.updateCellSizes();
            return true;
        },

        updateInnerWidth(cellIndex, newValue) {
            const transom = this.activeTransom
            if (!transom || !transom.cells || cellIndex < 0 || cellIndex >= this.calculatedCells.length) return false;

            const cell = this.calculatedCells[cellIndex];
            if (!cell || cell.type === PROFILE_TYPE) return false;

            const minWidth = transom.profile.width * 3;
            const maxWidth = transom.maxWidth || 3000;
            const newInnerWidth = Math.max(minWidth, Math.min(maxWidth, newValue));

            const offsets = cell.offsets;
            const newOuterWidth = newInnerWidth + offsets.left + offsets.right;

            const colSpan = cell.colSpan || 1;
            const colIndex = cell.col - 1;

            if (colSpan === 1) {
                this.updateColWidth(colIndex, newOuterWidth);
            } else {
                const currentColWidths = transom.colWidths.slice(colIndex, colIndex + colSpan);
                const currentTotalWidth = currentColWidths.reduce((sum, w) => sum + w, 0);
                const ratio = newOuterWidth / currentTotalWidth;

                for (let i = 0; i < colSpan; i++) {
                    const newColWidth = Math.round(currentColWidths[i] * ratio);
                    this.updateColWidth(colIndex + i, Math.max(minWidth, newColWidth));
                }
            }

            this.updateCellSizes();
            return true;
        },

        updateInnerHeight(cellIndex, newValue) {
            const transom = this.activeTransom
            if (!transom || !transom.cells || cellIndex < 0 || cellIndex >= this.calculatedCells.length) return false;

            const cell = this.calculatedCells[cellIndex];
            if (!cell || cell.type === PROFILE_TYPE) return false;

            const minHeight = transom.profile.width * 3;
            const maxHeight = transom.maxHeight || 3000;
            const newInnerHeight = Math.max(minHeight, Math.min(maxHeight, newValue));

            const offsets = cell.offsets;
            const newOuterHeight = newInnerHeight + offsets.top + offsets.bottom;

            const rowSpan = cell.rowSpan || 1;
            const rowIndex = cell.row - 1;

            if (rowSpan === 1) {
                this.updateRowHeight(rowIndex, newOuterHeight);
            } else {
                const currentRowHeights = transom.rowHeights.slice(rowIndex, rowIndex + rowSpan);
                const currentTotalHeight = currentRowHeights.reduce((sum, h) => sum + h, 0);
                const ratio = newOuterHeight / currentTotalHeight;

                for (let i = 0; i < rowSpan; i++) {
                    const newRowHeight = Math.round(currentRowHeights[i] * ratio);
                    this.updateRowHeight(rowIndex + i, Math.max(minHeight, newRowHeight));
                }
            }

            this.updateCellSizes();
            return true;
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

    }
})
