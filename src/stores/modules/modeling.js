// stores/modeling.store.js
import {defineStore} from 'pinia'
import {cloneObjectDeep} from '@utils'
import {useConfigsStore} from '@stores'
import {LEAF_HINGE_SIDE, LEAF_SWING_DIRECTION, LEAF_TYPES, PROFILE_TYPE} from '@constants';
import {LEAF_LIMITS} from "@src/configs";

/**
 * Создает хранилище моделирования фрамуг с использованием
 * @returns {ModelingStore} хранилища моделирования
 */
export const useModelingStore = defineStore('modeling', {
    state: () => ({
        transoms: [],
        activeTransomId: null,
        selectedProfileId: null,
        selectedTemplateId: null,
        showDimensions: true,
        showLeafsNames: true,
        showDividers: false,
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
         * Возвращает активную фрамугу
         * @param state Состояние хранилища
         * @returns {Transom | undefined} Объект активной фрамуги или undefined
         */
        activeTransom(state) {
            return state.transoms.find(transom => transom.id === state.activeTransomId)
        },
        /**
         * Возвращает массив типов профилей для использования в селектах
         * @returns {SelectOption[]} Массив объектов с полями label, value и imgSrc
         */
        profileTypesArray() {
            return this.configsStore.profileTypesArray
        },
        /**
         * Возвращает массив шаблонов фрамуг для использования в селектах
         * @returns {SelectOption[]} Массив объектов с полями label, value и imgSrc
         */
        transomTemplatesArray() {
            return this.configsStore.transomTemplatesArray
        },

        /**
         * Возвращает массив сторон открывания (левое/правое)
         * @returns {SelectOption[]} Массив объектов с полями label и value
         */
        openingSidesArray() {
            return this.configsStore.openingSidesArray
        },

        /**
         * Возвращает массив направлений открывания (наружу/внутрь)
         * @returns {SelectOption[]} Массив объектов с полями label и value
         */
        swingDirectionsArray() {
            return this.configsStore.swingDirectionsArray
        },

        /**
         * Вычисляет границы колонок активной фрамуги
         * @returns {number[]} Массив координат границ колонок
         */
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

        /**
         * Вычисляет границы строк активной фрамуги
         * @returns {number[]} Массив координат границ строк
         */
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

        /**
         * Возвращает позиции вертикальных разделителей
         * @returns {number[]} Массив координат вертикальных разделителей
         */
        verticalDividers() {
            return this.colBoundaries.slice(1, -1)
        },

        /**
         * Возвращает позиции горизонтальных разделителей
         * @returns {number[]} Массив координат горизонтальных разделителей
         */
        horizontalDividers() {
            return this.rowBoundaries.slice(1, -1)
        },

        /**
         * Вычисляет параметры ячеек активной фрамуги
         * @returns {TransomCell[] | undefined} Массив вычисленных ячеек или undefined
         */
        calculatedCells() {
            const transom = this.activeTransom;

            if (!transom || !transom.cells) return

            const rowCount = transom.rowHeights?.length || 0
            const colCount = transom.colWidths?.length || 0

            //ToDo 1. если rowHeights и colWidths не заданы, то посчитать их от схемы с максимальными размерами полотен
            //ToDo 2. подумать над автоматическим добавлением ячеек с профилем

            console.log('calculatedCells')
            return transom.cells.map((cell, index) => {

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
                const isActive = cell.type === LEAF_TYPES.ACTIVE_LEAF || cell.type === LEAF_TYPES.ACTIVE_LEAF_SMALL
                const hingeSide = cell.hingeSide || LEAF_HINGE_SIDE.RIGHT //петли слева/справа
                const swingDirection = cell.swingDirection || LEAF_SWING_DIRECTION.OUTWARD //открывание наружу/внутрь

                const resultCell = {
                    ...cell,
                    idx: index,
                    x,
                    y,
                    width,
                    height,
                    colSpan,
                    rowSpan,
                    isActive,
                    hingeSide,
                    swingDirection,
                }

                if (cell.type === PROFILE_TYPE) {
                    if (width > height) {
                        // Горизонтальная ячейка
                        resultCell.isHorizontal = true;
                    } else if (width < height) {
                        // Вертикальная ячейка
                        resultCell.isVertical = true;
                    }
                }

                const offsets = this.calculateOffsets(resultCell, rowCount, colCount)

                resultCell.innerWidth = width - offsets.left - offsets.right
                resultCell.innerHeight = height - offsets.top - offsets.bottom

                resultCell.offsets = offsets

                resultCell.validationData = this.getValidationCellData(resultCell);

                return resultCell
            })
        },

        /**
         * Проверяет наличие активных полотен в фрамуге
         * @returns {boolean} True, если есть активные полотна, иначе false
         */
        hasActiveLeaf() {
            if (!this.activeTransom || !this.activeTransom.cells) return false

            return this.activeTransom.cells.some(cell =>
                cell.type === LEAF_TYPES.ACTIVE_LEAF ||
                cell.type === LEAF_TYPES.ACTIVE_LEAF_SMALL
            )
        },

        /**
         * @private
         * Проверяет валидность активной фрамугиб записывает данные и соощения об ошибке
         */
        getActiveTransomValidationData() {
            const transom = this.activeTransom;
            if (!transom) return {};

            const sumRowHeights = transom.rowHeights.reduce((s, h) => s + h, 0);
            const sumColWidths = transom.colWidths.reduce((s, w) => s + w, 0);

            const params = {
                widthDiff: sumColWidths - transom.width,
                heightDiff: sumRowHeights - transom.height,
            };

            const errors = {};

            if (params.widthDiff) {
                errors.widthDiff = `Оставшаяся ширина: ${params.widthDiff} мм`;
            }
            if (params.heightDiff) {
                errors.heightDiff = `Оставшаяя высота: ${params.heightDiff} мм`;
            }

            return {
                isValid: Object.values(params).every(v => v === 0),
                params,
                errors,
            };

        }
    },

    actions: {
        /**
         * Создает объект новой фрамуги
         * @private
         * @returns {Transom | null} Объект фрамуги или null, если шаблон или профиль не выбраны
         */
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

                validationData: {
                    errors: {
                        widthDiff: '',
                        heightDiff: '',
                    },
                    params: {
                        widthDiff: 0,
                        heightDiff: 0,
                    },
                    isValid: true,
                },

            }
        },

        /**
         * Создает и добавляет новую фрамугу
         */
        addTransom() {
            const newTransom = this.createTransomObject();

            if (!newTransom) {
                return;
            }

            this.transoms.push(newTransom)
            this.activeTransomId = newTransom.id;

            this.updateHeights()
            this.updateWidths()
            this.updateCellSizes();
        },

        /**
         * Устанавливает активную фрамугу
         * @param transomId Идентификатор фрамуги
         */
        setActiveTransom(transomId) {
            if (this.transoms.some(transom => transom.id === transomId)) {
                this.activeTransomId = transomId
            }
        },

        /**
         * Устанавливает тип профиля
         * @param profileId Идентификатор профиля
         */
        setProfileType(profileId) {
            if (this.configsStore.profileTypes[profileId]) {
                this.selectedProfileId = profileId

                // Если есть активная фрамуга - обновляем ее профиль
                if (this.activeTransom) {
                    this.updateActiveTransomProfile(profileId);
                }

            }
        },

        /**
         * Устанавливает шаблон фрамуги
         * @param templateId Идентификатор шаблона
         */
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

        /**
         * Обновляет профиль активной фрамуги
         * @private
         * @param profileId Идентификатор профиля
         */
        updateActiveTransomProfile(profileId) {
            const transom = this.activeTransom
            if (!transom) return;

            const profile = this.configsStore.getProfileById(profileId)
            if (profile) {
                transom.profileId = profileId
                transom.profile = cloneObjectDeep(profile)

                this.updateHeights()
                this.updateWidths()
                this.updateCellSizes();
            }

        },

        /**
         * Обновляет шаблон активной фрамуги
         * @private
         * @param templateId Идентификатор шаблона
         */
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
                this.updateHeights()
                this.updateWidths()
                this.updateCellSizes()
            }
        },

        /**
         * Определяет соседние ячейки для текущей ячейки
         * @private
         * @param {TransomCell} currentCell Ячейка для анализа         *
         * @returns {Neighbors} Объект с массивами соседних ячеек (top, bottom, left, right)
         */
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

        /**
         * Рассчитывает отступы для ячейки
         * @private
         * @param cell Ячейка
         * @param rowCount Количество строк
         * @param colCount Количество колонок
         * @returns {CellOffsets} Объект с отступами
         */
        calculateOffsets(cell, rowCount, colCount) {

            const offsets = {top: 0, bottom: 0, left: 0, right: 0}
            const isActive = cell.isActive
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

        /**
         * Получаем валидацию и лимиты для указанной ячейки
         * @param {TransomCell} cell - объект ячейки или null если тип profile
         * @returns {ValidationCellData | {}}
         */
        getValidationCellData(cell) {
            if (cell.type === PROFILE_TYPE) return {}

            const cellTypeKey = cell.isActive ? 'active' : 'inactive';
            const limits = LEAF_LIMITS[cellTypeKey];

            const {minInnerWidth, maxInnerWidth, minInnerHeight, maxInnerHeight} = limits;
            const {innerWidth, innerHeight, offsets} = cell;

            const offsetsW = offsets.left + offsets.right
            const offsetsH = offsets.top + offsets.bottom

            const titles = {innerWidth: '', innerHeight: '', width: '', height: ''};
            const errors = {innerWidth: '', innerHeight: '', width: '', height: ''};

            //ToDo translate
            titles.innerWidth = `от ${minInnerWidth} до ${maxInnerWidth}`;
            titles.width = `от ${minInnerWidth + offsetsW} до ${maxInnerWidth + offsetsW}`;
            titles.innerHeight = `от ${minInnerHeight} до ${maxInnerHeight}`;
            titles.height = `от ${minInnerHeight + offsetsH} до ${maxInnerHeight + offsetsH}`;

            // Проверка размеров и запись ошибок
            if (innerWidth < minInnerWidth) {
                errors.innerWidth = `Должна быть => ${minInnerWidth}`;
                errors.width = `Должна быть => ${minInnerWidth + offsetsW}`;
            }
            if (innerWidth > maxInnerWidth) {
                errors.innerWidth = `Должна быть <= ${maxInnerWidth}`;
                errors.width = `Должна быть <= ${maxInnerWidth + offsetsW}`;
            }
            if (innerHeight < minInnerHeight) {
                errors.innerHeight = `Должна быть => ${minInnerHeight}`;
                errors.height = `Должна быть => ${minInnerHeight + offsetsH}`;
            }
            if (innerHeight > maxInnerHeight) {
                errors.innerHeight = `Должна быть <= ${maxInnerHeight}`;
                errors.height = `Должна быть <= ${maxInnerHeight + offsetsH}`;
            }

            return {
                isValid: Object.keys(errors).length === 0,
                errors,
                titles
            };

        },

        /**
         * Обновляет размеры ячеек активной фрамуги
         * @private
         * @returns {boolean} True, если обновление успешно, иначе false
         */
        updateCellSizes() {
            const transom = this.activeTransom
            if (!transom || !transom.cells) return false

            transom.cells = cloneObjectDeep(this.calculatedCells)
            transom.validationData = this.getActiveTransomValidationData;
        },

        /**
         * Изменяет тип ячейки
         * @param cellIndex Индекс ячейки
         * @param newType Новый тип ячейки
         * ToDo
         */
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

        /**
         * Устанавливает ширину активной фрамуги
         * @param newWidth Новая ширина
         * @returns {boolean} True, если установка успешна
         */
        setTransomWidth(newWidth) {
            const transom = this.activeTransom
            if (!transom) return false;

            transom.width = newWidth

            this.updateWidths()
            this.updateCellSizes();
            return true;
        },

        /**
         * Устанавливает высоту активной фрамуги
         * @param newHeight Новая высота
         * @returns {boolean} True, если установка успешна
         */
        setTransomHeight(newHeight) {
            const transom = this.activeTransom

            if (!transom) return;

            transom.height = newHeight
            this.updateHeights()
            this.updateCellSizes();

            return true; //ToDo
        },

        /**
         * Вычисляет ширины колонок с профилями
         * @private
         * @returns {{ [key: number]: number }} Объект с ширинами колонок
         */
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
                        const offsets = cell.offsets
                        const width = profile.width + offsets.left + offsets.right;

                        columnWidths[colIndex] = Math.max(profile.width, width);
                    }
                }
            });

            return columnWidths;
        },

        /**
         * Вычисляет высоты строк с профилями
         * @private
         * @returns {{ [key: number]: number }} Объект с высотами строк
         */
        calculateProfileRowHeights() {

            const transom = this.activeTransom;
            if (!transom || !transom.profile || !transom.cells) return {};

            const profile = transom.profile;
            const rowCount = transom.rowHeights?.length || 0;

            const rowHeights = {};

            this.calculatedCells.forEach(cell => {
                if (
                    cell.type === PROFILE_TYPE &&
                    cell.isHorizontal
                ) {
                    const rowIndex = cell.row - 1;
                    if (rowIndex >= 0 && rowIndex < rowCount) {
                        const offsets = cell.offsets
                        const height = profile.width + offsets.top + offsets.bottom;
                        rowHeights[rowIndex] = Math.max(profile.width, height);
                    }
                }
            });

            return rowHeights;
        },

        /**
         * Обновляет ширины колонок фрамуги
         * @private
         */
        updateWidths() {
            const transom = this.activeTransom
            // Пересчет colWidths пропорционально
            const currentWidth = transom.colWidths.reduce((sum, w) => sum + w, 0);

            if (currentWidth > 0) {
                const ratio = transom.width / currentWidth;
                // получаем ширины колонок с вертикальным профилем
                const columnProfileWidths = this.calculateProfileColumnWidths()

                const newColWidths = transom.colWidths.map((width, index) => {
                    // Если колонка содержит профиль
                    if (index in columnProfileWidths) {
                        return Math.round(columnProfileWidths[index]);
                    }

                    return Math.round(width * ratio);
                });

                // Корректировка для точного соответствия validatedWidth
                const newTotalWidth = newColWidths.reduce((sum, w) => sum + w, 0);
                const diff = transom.width - newTotalWidth;

                if (diff !== 0 && newColWidths.length > 0) {
                    const lastUnlockedIndex = newColWidths.findLastIndex((_, idx) => !columnProfileWidths[idx]);
                    if (lastUnlockedIndex !== -1) {
                        newColWidths[lastUnlockedIndex] = newColWidths[lastUnlockedIndex] + diff;
                    }
                }

                transom.colWidths = newColWidths;
            }
        },

        /**
         * Обновляет высоты строк фрамуги
         * @private
         */
        updateHeights() {
            const transom = this.activeTransom
            // Пересчет rowHeights пропорционально
            const currentHeight = transom.rowHeights.reduce((sum, h) => sum + h, 0);

            if (currentHeight > 0) {
                const ratio = transom.height / currentHeight;

                const columnProfileHeights = this.calculateProfileRowHeights()

                const newRowHeights = transom.rowHeights.map((height, index) => {
                    // Если строка содержит профиль
                    if (index in columnProfileHeights) {
                        return Math.round(columnProfileHeights[index]);
                    }

                    return Math.round(height * ratio);
                });

                // Корректировка для точного соответствия высоте фрамуги
                const newTotalHeight = newRowHeights.reduce((sum, h) => sum + h, 0);
                const diff = transom.height - newTotalHeight;

                if (diff !== 0 && newRowHeights.length > 0) {
                    const lastUnlockedIndex = newRowHeights.findLastIndex((_, idx) => !columnProfileHeights[idx]);
                    if (lastUnlockedIndex !== -1) {
                        newRowHeights[lastUnlockedIndex] = newRowHeights[lastUnlockedIndex] + diff;
                    }
                }

                transom.rowHeights = newRowHeights;
            }
        },

        /**
         * Устанавливает ширину ячейки
         * @param cellIndex Индекс ячейки
         * @param newWidth Новая ширина
         */
        setCellWidth(cellIndex, newWidth) {
            const transom = this.activeTransom;
            if (!transom || !transom.profile || !transom.cells) return;
            const cell = transom.cells[cellIndex];
            if (!cell) return;

            const colSpan = cell.colSpan || 1;
            const colStart = cell.col - 1;
            const colEnd = colStart + colSpan - 1;

            const ratio = cell.width / newWidth;

            //ToDo profile columns

            //Пропорционально масштабируем колонки
            for (let i = colStart; i <= colEnd; i++) {
                transom.colWidths[i] = Math.round(transom.colWidths[i] / ratio);
            }

            this.updateCellSizes();
        },

        /**
         * Устанавливает высоту ячейки
         * @param cellIndex Индекс ячейки
         * @param newHeight Новая высота
         */
        setCellHeight(cellIndex, newHeight) {
            const transom = this.activeTransom;
            if (!transom || !transom.profile || !transom.cells) return;
            const cell = transom.cells[cellIndex];

            const rowSpan = cell.rowSpan || 1;
            const rowStart = cell.row - 1;
            const rowEnd = rowStart + rowSpan - 1;

            const ratio = cell.height / newHeight;

            //ToDo profile columns

            //Пропорционально масштабируем строки
            for (let i = rowStart; i <= rowEnd; i++) {
                transom.rowHeights[i] = Math.round(transom.rowHeights[i] / ratio);
            }

            this.updateCellSizes();
        },

    }
})
