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
        /**
         * Возвращает экземпляр хранилища конфигураций.
         * @returns {ConfigsStore} Хранилище конфигураций.
         */
        configsStore() {
            return useConfigsStore();
        },

        decorPresets: this.configsStore.decorPresets,
        profilesPaddings: this.configsStore.profilesPaddings,
        profilesAvailableDecor: this.configsStore.profilesAvailableDecor


    }),

    getters: {

    },

    actions: {
        /**
         *
         * @param {Transom} transom
         */
       getAvailableDecor(transom) {

          return this.profilesAvailableDecor[transom.profileId]
       }

    }

});