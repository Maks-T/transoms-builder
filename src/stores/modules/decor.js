import {defineStore} from 'pinia'
import {useConfigsStore, useModelingStore} from '@stores'
import {PROFILE_TYPE, RULE_CELL_TYPES} from '@constants'
import {uniqId} from "@utils/index.js";


/**
 * Хранилище для расчета декора полотен
 * @returns DecorStore
 */
export const useDecorStore = defineStore('decor', {

    state: () => ({
        transoms: {}
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
                    cells[index] = this.calculateCell(cell, 'default')
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
                    console.log('transom.cells[index].presetId', index, transom.cells[index], transom)
                    const presetId = transom.cells[index]?.presetId ?? 'default';
                    cells[index] = this.calculateCell(cell, presetId)
                }

            });

            transom.cells = cells
            transom.updateKey = modelingTransom.updateKey;
        },

        calculateCell(cell, presetId = 'default') {
            const x = cell.x + cell.offsets.left + 63/2; //toDo + paddingsW /2
            const y = cell.y + cell.offsets.left + 63/2; //toDo+ paddingsH /2
            const width = cell.innerWidth - 63; //toDo+paddingsW
            const height = cell.innerHeight - 63; //toDo +paddingsW

            return {
                x,
                y,
                width,
                height,
                presetId
            }
        },


        /**
         *
         * @param {Transom} modelingTransom
         */
        getAvailableDecor(modelingTransom) {
            return this.profilesAvailableDecor[modelingTransom.profileId]
        }

        //getPaddings

    }

});