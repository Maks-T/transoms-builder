import {defineStore} from 'pinia'
import {useConfigsStore, useModelingStore} from '@stores'
import {PROFILE_TYPE} from '@constants'
import {uniqId} from '@utils' // Предполагаем, что uniqId доступен для генерации ID

/**
 * Хранилище для управления декором ячеек фрамуг.
 * @returns {DecorStore} Объект хранилища декора.
 */
export const useDecorGridStore = defineStore('decorGrid', {
    state: () => ({
        transoms: {},
        activeTransomId: null,
        drawingStart: null, // {x: number, y: number} | null — стартовая точка для рисования
        stepWidth: 200,
        gridOffset: { x: 0, y: 0 }, // смещение сетки в мм
        showGrid: true,
        showPolyline: false,
    }),

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
         * Возвращает активную фрамугу из хранилища декора.
         * @returns {DecorTransom|null} Объект активной фрамуги или null, если фрамуга не выбрана.
         */
        activeTransom(state) {
            return state.activeTransomId ? state.transoms[state.activeTransomId] || null : null;
        },

        /**
         * Возвращает индекс выбранной ячейки для активной фрамуги.
         * @returns {number|null} Индекс выбранной ячейки или null, если ячейка не выбрана.
         */
        selectedCellIndex(state) {
            const transom = this.activeTransom;
            return transom ? transom.selectedCellIndex : null;
        },

        /**
         * Возвращает выбранную ячейку для активной фрамуги.
         * @returns {DecorCell|null} Объект выбранной ячейки или null, если ячейка не выбрана.
         */
        selectedCell(state) {
            const transom = this.activeTransom;
            if (!transom || transom.selectedCellIndex === null) return null;
            return transom.cells[transom.selectedCellIndex] || null;
        },

        /**
         * Возвращает отступы для профилей из конфигурации.
         * @returns {ProfilesPaddings} Объект с отступами для профилей.
         */
        profilesPaddings() {
            return this.configsStore.profilesPaddings
        },

        /**
         * Вычисляет ячейки с декором для указанной фрамуги из modelingStore.
         * @returns {(modelingTransom: Transom) => Record<number, DecorCell>|undefined} Функция, возвращающая объект с ячейками декора или undefined.
         */
        calculatedCells(state) {
            return function (modelingTransom) {

                if (!modelingTransom) return;
                //Устанавливаем для упрощения использования методов стора в интерфейсе
                state.activeTransomId = modelingTransom.id;

                let transom = state.transoms[modelingTransom.id];

                if (!transom) {
                    transom = state.createTransomObject(modelingTransom)
                }

                //Если параметры фрамуги были изменены в моделировании, то пересчитываем ячейки
                if (transom.updateKey !== modelingTransom.updateKey) {
                    this.setSelectedCellIndex(null);

                    state.updateTransomCells(transom, modelingTransom)
                }

                state.transoms[modelingTransom.id] = transom;

                return transom.cells;
            }
        },

    },

    actions: {

        /**
         * Создает объект фрамуги для декора на основе данных из modelingStore.
         * @param {Transom} modelingTransom - Фрамуга из хранилища моделирования.
         * @returns {DecorTransom} Объект фрамуги с декором.
         */
        createTransomObject(modelingTransom) {

            const transom = {
                updateKey: modelingTransom.updateKey,
                profile: modelingTransom.profile,
                selectedCellIndex: null,
                selectedLine: null,
                cells: {},
                lines: [], // Массив декоративных линий
            };

            const cells = {};

            //Вставки для ячеек
            modelingTransom.cells.forEach((cell, index) => {
                if (cell.type !== PROFILE_TYPE) {
                    cells[index] = this.calculateCell(cell)
                }
            });

            transom.cells = cells

            this.transoms[modelingTransom.id] = transom

            return transom;
        },

        /**
         * Обновляет ячейки фрамуги с декором на основе данных из modelingStore.
         * @param {DecorTransom} transom - Фрамуга с декором.
         * @param {Transom} modelingTransom - Фрамуга из хранилища моделирования.
         */
        updateTransomCells(transom, modelingTransom) {

            const cells = {};

            //Вставки для ячеек
            modelingTransom.cells.forEach((cell, index) => {
                if (cell.type !== PROFILE_TYPE) {

                    cells[index] = this.calculateCell(cell)
                }
            });

            transom.cells = cells
            transom.updateKey = modelingTransom.updateKey;
        },

        /**
         * Вычисляет параметры ячейки с декором (координаты, размеры, пресет).
         * @param {TransomCell} cell - Ячейка из хранилища моделирования.
         * @returns {DecorCell} Объект ячейки с декором.
         */
        calculateCell(cell) {

            const x = cell.x + cell.offsets.left + 63 / 2; //toDo + paddingsW /2
            const y = cell.y + cell.offsets.top + 63 / 2; //toDo+ paddingsH /2

            const width = cell.innerWidth - 63; //toDo+paddingsW
            const height = cell.innerHeight - 63; //toDo +paddingsW
            const profile = 10; //ToDo ставить нужную ширину профиля


            return {
                x,
                y,
                width,
                height,
                profile,
            }
        },
        /**
         * Обновляет свойства выбранной ячейки на основе переданных параметров и пересчитывает её декор.
         * @param {Partial<DecorCell>} cellParams - Объект с параметрами для обновления ячейки
         * (например, { isFlip: boolean, presetId: string, presetType: DecorPresetType | null }).
         */
        updateSelectedCell(cellParams) {
            const cell = this.selectedCell;
            if (!cell) return

            Object.entries(cellParams).forEach(([param, value]) => {
                cell[param] = value
            })
        },

        /**
         * Устанавливает индекс выбранной ячейки для активной фрамуги.
         * @param {number|null} index - Индекс ячейки или null для сброса выбора.
         */
        setSelectedCellIndex(index) {
            const transom = this.activeTransom;
            if (transom) {
                transom.selectedCellIndex = index;
            }
        },

        // Новые actions для рисования
        setDrawingStart(point) {
            this.drawingStart = point ? { ...point } : null;
        },

        addLine(start, end) {
            const transom = this.activeTransom;
            if (!transom) return;

            if (start.x === end.x && start.y !== end.y) {
                // Вертикальная
                transom.lines.push({
                    id: uniqId(),
                    start,
                    end,
                    type: 'vertical'
                });
            } else if (start.y === end.y && start.x !== end.x) {
                // Горизонтальная
                transom.lines.push({
                    id: uniqId(),
                    start,
                    end,
                    type: 'horizontal'
                });
            } // Иначе игнор

            if (this.showPolyline) {
                //Если активирован режим полилиний,
                //то записываем последнюю точку
                this.setDrawingStart({...end});
            } else {
                this.setDrawingStart(null); // Сброс
            }

        },



        setStepWidth(width) {
            this.stepWidth = width
        },

        setGridOffsetX(x) {
            this.gridOffset.x = x
        },
        setGridOffsetY(y) {
            this.gridOffset.y = y
        },

        setSelectedLine(lineId) {
            const transom = this.activeTransom;
            if (!transom) return;

            transom.selectedLine = transom.lines.find(l => l.id === lineId);
        },

        setLineMargin(margin) {
           const selectedLine = this.activeTransom?.selectedLine;
           if (!selectedLine) return;

           if (selectedLine.type === 'vertical') {
               selectedLine.start.x = selectedLine.end.x = margin
           } else {
               selectedLine.start.y = selectedLine.end.y = margin
           }
        },

        removeLineByIndex(lineId) {
            const transom = this.activeTransom;
            if (!transom) return;
            transom.lines = transom.lines.filter(line => line.id !== lineId);
        },

        removeSelectedLine() {
            const transom = this.activeTransom;
            const selectedLine = transom?.selectedLine;
            if (!selectedLine) return;

            transom.lines = transom.lines.filter(line => line.id !== selectedLine.id);

            if (transom.lines.length > 0) {
                transom.selectedLine =  transom.lines[transom.lines.length - 1]

                console.log('last',  transom.selectedLine)
            } else {
                transom.selectedLine = null;
            }

        },
        /**
         * Разделяет все линии активной фрамуги на сегменты, чтобы каждый сегмент находился внутри одной ячейки.
         * Заменяет оригинальные линии на новые сегменты.
         */
        splitLinesToCells() {
            const transom = this.activeTransom;
            if (!transom) return;

            const newLines = [];
            const cells = Object.values(transom.cells); // Массив ячеек

            transom.lines.forEach(line => {
                const segments = this.getLineSegments(line, cells);
                newLines.push(...segments);
            });

            transom.lines = newLines;
        },

        /**
         * Вспомогательная функция для разделения одной линии на сегменты по ячейкам.
         * @param {Object} line - Линия для разделения ({start, end, type}).
         * @param {Array} cells - Массив ячеек.
         * @returns {Array} Массив сегментов линии.
         */
        getLineSegments(line, cells) {
            const segments = [];

            if (line.type === 'horizontal') {
                const y = line.start.y; // y фиксирован (start.y === end.y)
                const left = Math.min(line.start.x, line.end.x);
                const right = Math.max(line.start.x, line.end.x);

                // Находим пересекающиеся ячейки
                const intersectingCells = cells.filter(cell =>
                    cell.y <= y && y <= cell.y + cell.height &&
                    cell.x < right && cell.x + cell.width > left
                ).sort((a, b) => a.x - b.x);

                intersectingCells.forEach(cell => {
                    const segLeft = Math.max(left, cell.x);
                    const segRight = Math.min(right, cell.x + cell.width);
                    if (segLeft < segRight) {
                        segments.push({
                            id: uniqId(),
                            start: { x: segLeft, y },
                            end: { x: segRight, y },
                            type: 'horizontal'
                        });
                    }
                });
            } else if (line.type === 'vertical') {
                const x = line.start.x; // x фиксирован (start.x === end.x)
                const top = Math.min(line.start.y, line.end.y);
                const bottom = Math.max(line.start.y, line.end.y);

                // Находим пересекающиеся ячейки
                const intersectingCells = cells.filter(cell =>
                    cell.x <= x && x <= cell.x + cell.width &&
                    cell.y < bottom && cell.y + cell.height > top
                ).sort((a, b) => a.y - b.y);

                intersectingCells.forEach(cell => {
                    const segTop = Math.max(top, cell.y);
                    const segBottom = Math.min(bottom, cell.y + cell.height);
                    if (segTop < segBottom) {
                        segments.push({
                            id: uniqId(),
                            start: { x, y: segTop },
                            end: { x, y: segBottom },
                            type: 'vertical'
                        });
                    }
                });
            }

            return segments;
        }

    }

});