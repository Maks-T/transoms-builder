import {defineStore} from 'pinia';
import {cloneObjectDeep} from '@utils';
import {PROFILES_TYPES, TRANSOM_TEMPLATES} from '@src/configs'


export const useConfigsStore = defineStore('configs', {
    state: () => ({
        profileTypes: cloneObjectDeep(PROFILES_TYPES),
        transomTemplates: cloneObjectDeep(TRANSOM_TEMPLATES),
    }),

    getters: {
        profileTypesArray: (state) => Object.values(state.profileTypes)
            .map(o => ({
            label: o.name,
            value: o.id,
            imgSrc: o.imgSrc
        })),
        transomTemplatesArray: (state) => Object.values(state.transomTemplates)
            .map(o => ({
            label: o.name,
            value: o.id,
            imgSrc: o.imgSrc
        })),
        getProfileById: (state) => (id) => state.profileTypes[id],
        getTransomTemplateById: (state) => (id) => state.transomTemplates[id],
        defaultProfileId: (state) => Object.keys(state.profileTypes)[0],
        defaultTemplateId: (state) => Object.keys(state.transomTemplates)[8]
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