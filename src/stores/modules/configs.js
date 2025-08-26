import { defineStore } from 'pinia';
import { cloneObjectDeep } from '@utils';



const PROFILES_TYPES = {
    'modulasg': {
        id: 'modulasg',
        name: 'Modula',
        width: 39,
        height: 41,
        imgSrc: '',
        gradeName: 'Профиль S41X39'
    },
    'spaziosg': {
        id: 'spaziosg',
        name: 'Spazio',
        width: 39,
        height: 41,
        imgSrc: '',
        gradeName: 'Профиль S41X39'
    },
    'spazioltsl': {
        id: 'spazioltsl',
        name: 'Spazio Light',
        width: 39,
        height: 41,
        imgSrc: '',
        gradeName: 'Профиль S41X39'
    },
};


const TRANSOM_TEMPLATES = {
    'transoms-type-9': {
        id: 'transoms-type-9',
        name: 'Фрамуга 9',
        width: 1667,
        height: 3000,
        minWidth: 1000,
        minHeight: 1000,
        maxWidth: 1667,
        maxHeight: 3000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x3',
        colWidths: [42, 810, 815],
        rowHeights: [42, 948, 2010],
        imgSrc: '',
        cells: [
            {
                row: 1,
                col: 1,
                rowSpan: 3,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 3, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 2,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 0, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 2,
                col: 2,
                type: 'inactive-leaf-small',
                offsets: {top: 5, bottom: 5, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 3,
                col: 2,
                type: 'active-leaf',
                offsets: {top: 3, bottom: 0, left: 0, right: 3},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 3,
                rowSpan: 3,
                type: 'inactive-leaf',
                offsets: {top: 5, bottom: 5, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
        ]
    },
    'transoms-type-8': {
        id: 'transoms-type-8',
        name: 'Фрамуга 8',
        width: 1400,
        height: 3000,
        minWidth: 1000,
        minHeight: 1000,
        maxWidth: 1667,
        maxHeight: 3200,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x3',
        colWidths: [42, 810, 815],
        rowHeights: [42, 948, 2010],
        imgSrc: '',
        cells: [
            {
                row: 1,
                col: 1,
                rowSpan: 3,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 3, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 2,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 0, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 2,
                col: 2,
                type: 'inactive-leaf-small',
                offsets: {top: 5, bottom: 5, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 3,
                col: 2,
                type: 'active-leaf',
                offsets: {top: 3, bottom: 0, left: 0, right: 3},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 3,
                rowSpan: 3,
                type: 'inactive-leaf',
                offsets: {top: 5, bottom: 5, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
        ]
    }
};

export const useConfigsStore = defineStore('configs', {
    state: () => ({
        profileTypes: cloneObjectDeep(PROFILES_TYPES),
        transomTemplates: cloneObjectDeep(TRANSOM_TEMPLATES),
    }),

    getters: {
        profileTypesArray: (state) => Object.values(state.profileTypes),
        transomTemplatesArray: (state) => Object.values(state.transomTemplates),
        getProfileById: (state) => (id) => state.profileTypes[id],
        getTransomTemplateById: (state) => (id) => state.transomTemplates[id],
        defaultProfileId: (state) => Object.keys(state.profileTypes)[0],
        defaultTemplateId: (state) => Object.keys(state.transomTemplates)[0]
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