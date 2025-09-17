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
        transomsCellsDecor: {}
    }),

    getters: {
        /**
         * Возвращает экземпляр хранилища конфигураций.
         * @returns {ConfigsStore} Хранилище конфигураций.
         */
        configsStore() {
            return useConfigsStore();
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

        calculatedTransomCellsDecor: (state) => (transom) => {
          /* const cells = state.transomsCellsDecor[transom.id]

            console.log('transom', transom)

            if (!cells) {
                state.transomsCellsDecor[transom.id] = state.createCellsDecorObject(transom)
            }

           return state.transomsCellsDecor[transom.id];*/

            const cells = {}

            transom.cells.forEach(cell => {
                const x = cell.x + cell.offsets.left + 63/2; //toDo + paddingsW /2
                const y = cell.y + cell.offsets.left + 63/2; //toDo+ paddingsH /2
                const width = cell.innerWidth - 63; //toDo+paddingsW
                const height = cell.innerHeight - 63; //toDo +paddingsW
                const presetId = 'default'

                cells[cell.idx] = {
                    x,
                    y,
                    width,
                    height,
                    presetId
                }
            });

            return cells
        },

    },

    actions: {

        /**
         *
         * @param {Transom} transom
         * @returns {{}}
         */
        createCellsDecorObject(transom) {
            console.log(transom, 'transom')
            //Вставки для декора
            const cells = {}

            transom.cells.forEach(cell => {
                const x = cell.x + cell.offsets.left + 63/2; //toDo + paddingsW /2
                const y = cell.y + cell.offsets.left + 63/2; //toDo+ paddingsH /2
                const width = cell.innerWidth - 63; //toDo+paddingsW
                const height = cell.innerHeight - 63; //toDo +paddingsW
                const presetId = 'default'

                cells[cell.idx] = {
                    x,
                    y,
                    width,
                    height,
                    presetId
                }
            });

            return cells
        },

        /**
         *
         * @param {Transom} transom
         */
        getAvailableDecor(transom) {
            return this.profilesAvailableDecor[transom.profileId]
        }

        //getPaddings

    }

});