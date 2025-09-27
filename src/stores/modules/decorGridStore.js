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
            const y = cell.y + cell.offsets.left + 63 / 2; //toDo+ paddingsH /2

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
            this.setDrawingStart(null); // Сброс
        },

        removeLine(lineId) {
            const transom = this.activeTransom;
            if (!transom) return;
            transom.lines = transom.lines.filter(line => line.id !== lineId);
        },

    }

});