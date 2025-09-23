import {defineStore} from 'pinia'
import {useConfigsStore, useModelingStore} from '@stores'
import {PROFILE_TYPE, RULE_CELL_TYPES} from '@constants'
import {uniqId} from "@utils/index.js";
import CalcDecorTemplate from "@services/calculations/CalcDecorTemplate.js";


/**
 * Хранилище для управления декором ячеек фрамуг.
 * @returns {DecorStore} Объект хранилища декора.
 */
export const useDecorStore = defineStore('decor', {
    state: () => ({
        transoms: {},
        activeTransomId: null,
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
         * Возвращает индекс выбранной области (rect) в выбранной ячейке.
         * @returns {number|null} Индекс выбранной области или null, если область не выбрана.
         */
        selectedRectIndex(state) {
            const transom = this.activeTransom;
            return transom ? transom.selectedRectIndex : null;
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
         * Возвращает выбранную область (rect) в выбранной ячейке.
         * @returns {DecorRect|null} Объект выбранной области или null, если область не выбрана.
         */
        selectedRect(state) {
            const cell = this.selectedCell;
            if (!cell || !cell.presetRects?.items || this.selectedRectIndex === null) return null;
            return cell.presetRects.items[this.selectedRectIndex] || null;
        },

        /**
         * Возвращает доступные пресеты декора из конфигурации.
         * @returns {AvailableDecorPresets} Объект с пресетами декора.
         */
        decorPresets() {
            return this.configsStore.decorPresets
        },

        /**
         * Возвращает отступы для профилей из конфигурации.
         * @returns {ProfilesPaddings} Объект с отступами для профилей.
         */
        profilesPaddings() {
            return this.configsStore.profilesPaddings
        },

        /**
         * Возвращает отступы для профилей из конфигурации.
         * @returns {ProfilesAvailableDecorPresets} Объект с отступами для профилей.
         */
        profilesAvailableDecorPresets() {
            return this.configsStore.profilesAvailableDecorPresets
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
                selectedRectIndex: null,
                cells: {}
            };

            const cells = {};

            //Вставки для ячеек
            modelingTransom.cells.forEach((cell,index) => {
                if (cell.type !== PROFILE_TYPE) {
                    cells[index] = this.calculateCell(cell, 'default')
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
            this.setSelectedCellIndex(null);
            this.setSelectedRectIndex(null);

            const cells = {};

            //Вставки для ячеек
            modelingTransom.cells.forEach((cell, index) => {
                if (cell.type !== PROFILE_TYPE) {
                    const presetId = transom.cells[index]?.presetId ?? 'default';
                    cells[index] = this.calculateCell(cell, presetId)
                }
            });

            transom.cells = cells
            transom.updateKey = modelingTransom.updateKey;
        },

        /**
         * Вычисляет параметры ячейки с декором (координаты, размеры, пресет).
         * @param {TransomCell} cell - Ячейка из хранилища моделирования.
         * @param {string} [presetId='default'] - ID пресета декора.
         * @param {DecorPresetType|null} [presetType=null] - Тип пресета декора ('glueRail' или 'profileRail').
         * @returns {DecorCell} Объект ячейки с декором.
         */
        calculateCell(cell, presetId = 'default', presetType = null) {


            const x = cell.x + cell.offsets.left + 63/2; //toDo + paddingsW /2
            const y = cell.y + cell.offsets.left + 63/2; //toDo+ paddingsH /2

            const width = cell.innerWidth - 63; //toDo+paddingsW
            const height = cell.innerHeight - 63; //toDo +paddingsW
            const config =  this.decorPresets[presetId];
            const profile = 10; //ToDo ставить нужную ширину профиля

            const calcDecorTemplate = new CalcDecorTemplate();

            let presetRects = calcDecorTemplate.getDoorRects({config, width, height, profile})

            if (presetRects.items.some(item => item.height <= 0)) {
                presetId = 'default'
                const config =  this.decorPresets[presetId];
                presetRects = calcDecorTemplate.getDoorRects({config, width, height, profile})
                presetType = null
                console.warn(`Не хватает высоты для применения этого типа декора ${cell.idx}`) //ToDo showToast
            }

            return {
                x,
                y,
                width,
                height,
                presetId,
                presetRects,
                presetType,
                isFlip: false,
            }
        },

        /**
         * Возвращает доступные пресеты декора для профиля активной фрамуги.
         * @param {Transom} modelingTransom - Фрамуга из хранилища моделирования.
         * @returns {AvailableDecorPresets} Объект с доступными типами декора (glueRail, profileRail).
         */
        getAvailableDecorPresets(modelingTransom) {
            return this.profilesAvailableDecorPresets[modelingTransom.profileId]
        },

        //getPaddings

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

        /**
         * Устанавливает индекс выбранной области (rect) для активной фрамуги.
         * @param {number|null} index - Индекс области или null для сброса выбора.
         */
        setSelectedRectIndex(index) {
            const transom = this.activeTransom;
            if (transom) {
                transom.selectedRectIndex = index;
            }
        },

        /**
         * Устанавливает пресет декора для выбранной ячейки активной фрамуги.
         * @param {string} presetId - ID пресета декора ('v01', 'r02', ).
         * @param {DecorPresetType} presetType - Тип пресета декора (например, 'glueRail' или 'profileRail').
         */
        setPresetForSelectedCell(presetId, presetType) {

            const transom = this.activeTransom;
            if (!transom || transom.selectedCellIndex === null) return;

            const cellIndex = transom.selectedCellIndex;
            const cell = this.modelingStore.activeTransom.cells[cellIndex];

            if (cell) {
                transom.cells[cellIndex] = this.calculateCell(cell, presetId, presetType);
            }

        },

        /**
         * Устанавливает материал для области (rect) в выбранной ячейке активной фрамуги.
         * @param {number} cellIndex - Индекс ячейки.
         * @param {number} rectIndex - Индекс области в ячейке.
         * @param {string|null} material - ID материала или null для сброса.
         */
        setRectMaterial(cellIndex, rectIndex, material) {
            const transom = this.activeTransom;
            if (!transom) return;

            const cell = transom.cells[cellIndex];
            if (!cell || !cell.presetRects.items[rectIndex]) return;

            cell.presetRects.items[rectIndex].material = material;
        },

    }

});