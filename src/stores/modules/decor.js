import {defineStore} from 'pinia'
import {useConfigsStore, useModelingStore} from '@stores'
import {PROFILE_TYPE, RULE_CELL_TYPES} from '@constants'
import {uniqId} from "@utils/index.js";
import CalcDecorTemplate from "@services/calculations/CalcDecorTemplate.js";


/**
 * Хранилище для расчета декора полотен
 * @returns DecorStore
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
         * Возвращает активный transom.
         * @param {Object} state
         * @returns {Object|null}
         */
        activeTransom(state) {
            return state.activeTransomId ? state.transoms[state.activeTransomId] || null : null;
        },

        /**
         * Возвращает индекс выбранной ячейки для активного transom.
         * @param {Object} state
         * @returns {Number|null}
         */
        selectedCellIndex(state) {
            const transom = this.activeTransom;
            return transom ? transom.selectedCellIndex : null;
        },

        /**
         * Возвращает индекс выбранной области (rect) в выбранной ячейке.
         * @param {Object} state
         * @returns {Number|null}
         */
        selectedRectIndex(state) {
            const transom = this.activeTransom;
            return transom ? transom.selectedRectIndex : null;
        },

        /**
         * Возвращает выбранную ячейку для активного transom.
         * @param {Object} state
         * @returns {Object|null}
         */
        selectedCell(state) {
            const transom = this.activeTransom;
            if (!transom || transom.selectedCellIndex === null) return null;
            return transom.cells[transom.selectedCellIndex] || null;
        },

        /**
         * Возвращает выбранную область (rect) в выбранной ячейке.
         * @param {Object} state
         * @returns {Object|null}
         */
        selectedRect(state) {
            const cell = this.selectedCell;
            if (!cell || !cell.presetRects?.items || this.selectedRectIndex === null) return null;
            return cell.presetRects.items[this.selectedRectIndex] || null;
        },

        decorPresets() {
            return this.configsStore.decorPresets
        },

        profilesPaddings() {
            return this.configsStore.profilesPaddings
        },
        profilesAvailableDecor() {
            return this.configsStore.profilesAvailableDecor
        },

        //ToDo убрать стрелку?
        calculatedCells(state) {
           return function (modelingTransom) {

                 console.log('update calculatedCells modelingTransom.updateKey', modelingTransom.updateKey)

                if (!modelingTransom) return;
                //Устанавливаем для упрощения использования методов стора в интерфейсе
                state.activeTransomId = modelingTransom.id;

                let transom = state.transoms[modelingTransom.id];

                if (!transom) {
                    transom = state.createTransomObject(modelingTransom)
                }

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
         *
         * @param {Transom} modelingTransom
         * @returns {{}}
         */
        createTransomObject(modelingTransom) {

            const transom = {};
            transom.updateKey = modelingTransom.updateKey;
            transom.profile = modelingTransom.profile;

            const cells = {};

            //Вставки для ячеек
            modelingTransom.cells.forEach((cell,index) => {
                if (cell.type !== PROFILE_TYPE) {
                    cells[index] = this.calculateCell(cell, 'v01')
                }
            });

            transom.cells = cells

            this.transoms[modelingTransom.id] = transom

            return transom;
        },

        updateTransomCells(transom, modelingTransom) {

            const cells = {};

            //Вставки для ячеек
            modelingTransom.cells.forEach((cell, index) => {
                if (cell.type !== PROFILE_TYPE) {
                    const presetId = transom.cells[index]?.presetId ?? 'v01';
                    cells[index] = this.calculateCell(cell, presetId)
                }
            });

            transom.cells = cells
            transom.updateKey = modelingTransom.updateKey;
        },

        calculateCell(cell, presetId = 'v01', presetType = null) {
            console.log({cell, presetId})

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
         *
         * @param {Transom} modelingTransom
         */
        getAvailableDecor(modelingTransom) {
            return this.profilesAvailableDecor[modelingTransom.profileId]
        },

        //getPaddings

        /**
         * Устанавливает индекс выбранной ячейки для активной фрамуги.
         * @param {Number|null} index
         */
        setSelectedCellIndex(index) {
            const transom = this.activeTransom;
            if (transom) {
                transom.selectedCellIndex = index;
            }
        },

        /**
         * Устанавливает индекс выбранной области для активной фрамуги.
         * @param {Number|null} index
         */
        setSelectedRectIndex(index) {
            const transom = this.activeTransom;
            if (transom) {
                transom.selectedRectIndex = index;
            }
        },

        /**
         * Устанавливает presetId для выбранной ячейки активной фрамуги и пересчитывает её.
         * @param {String} presetId
         * @param {String} presetType
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
         * Устанавливает материал для прямоугольника в ячейке активной фрамуги.
         * @param {Number} cellIndex
         * @param {Number} rectIndex
         * @param {String|null} material
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