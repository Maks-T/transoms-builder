import {defineStore} from 'pinia';
import {cloneObjectDeep} from '@utils';
import {PROFILES_TYPES, TRANSOM_TEMPLATES, PRICES, MATERIALS_ON_SIDE_RULES, DECOR_PRESETS,PROFILES_PADDINGS,
    PROFILES_AVAILABLE_DECOR} from '@src/configs'
import {LEAF_HINGE_SIDE, LEAF_HINGE_SIDE_NAMES, LEAF_SWING_DIRECTION, LEAF_SWING_DIRECTION_NAMES} from "@constants";



/**
 * Хранилище для управления конфигурационными данными приложения:
 * типами профилей, шаблонами фрамуг и справочными данными.
 * @returns ConfigsStore
 */
export const useConfigsStore = defineStore('configs', {
    state: () => ({
        profileTypes: cloneObjectDeep(PROFILES_TYPES),
        transomTemplates: cloneObjectDeep(TRANSOM_TEMPLATES), //ToDo cloneObjectDeep нужно ли?
        materialsRules: MATERIALS_ON_SIDE_RULES,
        prices: PRICES,

        //для расчета декора
        decorPresets: DECOR_PRESETS, //шаблоны (персеты) для накладного и секционного декора
        profilesPaddings: PROFILES_PADDINGS , //отсутпы для вставок для опреденного типа профиля  //ToDo Type
        profilesAvailableDecor: PROFILES_AVAILABLE_DECOR //Доступный накладной и секционный декор для вставок //ToDo Type
    }),

    getters: {
        /**
         * Возвращает массив типов профилей для использования в выпадающих списках
         * @returns {SelectOption[]} Массив объектов с полями label, value и imgSrc
         */
        profileTypesArray: (state) => Object.values(state.profileTypes)
            .map(o => ({
            label: o.name,
            value: o.id,
            imgSrc: o.imgSrc
        })),
        /**
         * Возвращает массив шаблонов фрамуг для использования в выпадающих списках
         * @returns {SelectOption[]} Массив объектов с полями label, value и imgSrc
         */
        transomTemplatesArray: (state) => Object.values(state.transomTemplates)
            .map(o => ({
            label: o.name,
            value: o.id,
            imgSrc: o.imgSrc
        })),
        /**
         * Возвращает массив сторон открывания (левое/правое)
         * @returns {SelectOption[]} Массив объектов с полями label и value
         */
        openingSidesArray() {
            return Object.values(LEAF_HINGE_SIDE).map(v => ({
                    label: LEAF_HINGE_SIDE_NAMES[v],
                    value: v
            }));
        },
        /**
         * Возвращает массив направлений открывания (наружу/внутрь)
         * @returns {SelectOption[]} Массив объектов с полями label и value
         */
        swingDirectionsArray() {
            return Object.values(LEAF_SWING_DIRECTION).map(v => ({
                label: LEAF_SWING_DIRECTION_NAMES[v],
                value: v
            }));
        },
        getProfileById: (state) => (id) => state.profileTypes[id],
        getTransomTemplateById: (state) => (id) => state.transomTemplates[id],
        defaultProfile: (state) => Object.keys(state.profileTypes)[0],
        defaultTemplate: (state) => Object.keys(state.transomTemplates)[0],
        getMaterialsRules: (state) => state.materialsRules
    },

    actions: {
        addProfileType(profile) {
            this.profileTypes[profile.id] = profile
        },

        addTemplate(template) {
            this.transomTemplates[template.id] = template
        },
    }
})