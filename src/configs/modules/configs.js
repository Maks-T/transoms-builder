import {defineStore} from 'pinia';
import {cloneObjectDeep} from '@utils';

/** @type {ProfilesTypes} */
const PROFILES_TYPES = {
    'modulasg': {
        id: 'modulasg',
        name: 'Modula',
        width: 39,
        height: 41,
        imgSrc: 'https://configdoor.com/public/images/door/modulasl.webp',
        gradeName: 'Профиль S41X39'
    },
    'spaziosg': {
        id: 'spaziosg',
        name: 'Spazio',
        width: 70,
        height: 41,
        imgSrc: 'https://configdoor.com/public/images/door/spaziosl.webp',
        gradeName: 'Профиль S41X39'
    },
    'spazioltsl': {
        id: 'spazioltsl',
        name: 'Spazio Light',
        width: 20,
        height: 41,
        imgSrc: 'https://configdoor.com/public/images/door/spazioltsl.webp',
        gradeName: 'Профиль S41X39'
    },
};

const TRANSOM_TEMPLATES = {
    'transoms-type-1': {
        id: 'transoms-type-1',
        name: 'Фрамуга 1',
        width: 3100,
        height: 2519,
        minWidth: 800,
        minHeight: 800,
        maxWidth: 6000,
        maxHeight: 6000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '1x3',
        colWidths: [1035, 1030, 1035],
        rowHeights: [519],
        imgSrc: './img/transomTemplates/transom-1.svg',
        cells: [
            {
                row: 1,
                col: 1,
                type: 'inactive-leaf',
                offsets: {top: 3, bottom: 0, left: 5, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 2,
                type: 'inactive-leaf',
                offsets: {top: 3, bottom: 0, left: 0, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 3,
                type: 'inactive-leaf',
                offsets: {top: 3, bottom: 0, left: 0, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },

        ]
    },
    'transoms-type-2': {
        id: 'transoms-type-2',
        name: 'Фрамуга 2',
        width: 2068,
        height: 2519,
        minWidth: 800,
        minHeight: 800,
        maxWidth: 6000,
        maxHeight: 6000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '2x1',
        colWidths: [1034,1034],
        rowHeights: [519],
        imgSrc: './img/transomTemplates/transom-2.svg',
        cells: [
            {
                row: 1,
                col: 1,
                type: 'inactive-leaf',
                offsets: {top: 3, bottom: 0, left: 5, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 2,
                type: 'inactive-leaf',
                offsets: {top: 3, bottom: 0, left: 0, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },


        ]
    },
    'transoms-type-3': {
        id: 'transoms-type-3',
        name: 'Фрамуга 3',
        width: 2288,
        height: 2519,
        minWidth: 800,
        minHeight: 800,
        maxWidth: 6000,
        maxHeight: 6000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '2x2',
        colWidths: [1144,1144],
        rowHeights: [503, 2016],
        imgSrc: './img/transomTemplates/transom-3.svg',
        cells: [
            {
                row: 1,
                col: 1,
                type: 'inactive-leaf-small',
                offsets: {top: 3, bottom: 0, left: 5, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 2,
                type: 'inactive-leaf-small',
                offsets: {top: 3, bottom: 0, left: 0, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 2,
                col: 1,
                type: 'inactive-leaf',
                offsets: {top: 0, bottom: 0, left: 5, right: 0},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 2,
                col: 2,
                type: 'inactive-leaf',
                offsets: {top: 0, bottom: 0, left: 0, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },

        ]
    },
    'transoms-type-4': {
        id: 'transoms-type-4',
        name: 'Фрамуга 4',
        width: 3100,
        height: 2015,
        minWidth: 800,
        minHeight: 800,
        maxWidth: 6000,
        maxHeight: 6000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x1',
        colWidths: [1145,810,1145],
        rowHeights: [2015],
        imgSrc: './img/transomTemplates/transom-2.svg',
        cells: [
            {
                row: 1,
                col: 1,
                type: 'inactive-leaf',
            },
            {
                row: 1,
                col: 2,
                type: 'active-leaf',
            },
            {
                row: 1,
                col: 3,
                type: 'inactive-leaf',
            },

        ]
    },
    'transoms-type-5': {
        id: 'transoms-type-5',
        name: 'Фрамуга 5',
        width: 3100,
        height: 2519,
        minWidth: 800,
        minHeight: 800,
        maxWidth: 6000,
        maxHeight: 6000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x2',
        colWidths: [1145,810,1145],
        rowHeights: [504, 2015],
        imgSrc: './img/transomTemplates/transom-5.svg',
        cells: [
            {
                row: 1,
                col: 1,
                colSpan: 3,
                type: 'inactive-leaf-small',
            },
            {
                row: 2,
                col: 1,
                type: 'inactive-leaf',
            },
            {
                row: 2,
                col: 2,
                type: 'active-leaf',
            },
            {
                row: 2,
                col: 3,
                type: 'inactive-leaf',
            },

        ]
    },
    'transoms-type-6': {
        id: 'transoms-type-6',
        name: 'Фрамуга 6',
        width: 3100,
        height: 2519,
        minWidth: 800,
        minHeight: 800,
        maxWidth: 6000,
        maxHeight: 6000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x3',
        colWidths: [1145,810,1145],
        rowHeights: [504, 2015],
        imgSrc: './img/transomTemplates/transom-6.svg',
        cells: [
            {
                row: 1,
                col: 1,
                type: 'inactive-leaf-small',
            },
            {
                row: 1,
                col: 2,
                type: 'inactive-leaf-small',
            },
            {
                row: 1,
                col: 3,
                type: 'inactive-leaf-small',
            },
            {
                row: 2,
                col: 1,
                type: 'inactive-leaf',
            },
            {
                row: 2,
                col: 2,
                type: 'active-leaf',
            },
            {
                row: 2,
                col: 3,
                type: 'inactive-leaf',
            },

        ]
    },
    'transoms-type-7': {
        id: 'transoms-type-7',
        name: 'Фрамуга 7',
        width: 3100,
        height: 2519,
        minWidth: 800,
        minHeight: 800,
        maxWidth: 6000,
        maxHeight: 6000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x2',
        colWidths: [1145,810,1145],
        rowHeights: [504, 2015],
        imgSrc: './img/transomTemplates/transom-7.svg',
        cells: [
            {
                row: 1,
                rowSpan: 2,
                col: 1,
                type: 'inactive-leaf',
            },
            {
                row: 1,
                col: 2,
                type: 'inactive-leaf-small',
            },
            {
                row: 2,
                col: 2,
                type: 'active-leaf',
            },
            {
                row: 1,
                rowSpan: 2,
                col: 3,
                type: 'inactive-leaf',
            },

        ]
    },
    'transoms-type-8': {
        id: 'transoms-type-8',
        name: 'Фрамуга 8',
        width: 894,
        height: 3000,
        minWidth: 800,
        minHeight: 800,
        maxWidth: 5000,
        maxHeight: 5000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x3',
        colWidths: [42, 810, 42],
        rowHeights: [42, 943, 2015],
        imgSrc: './img/transomTemplates/transom-8.svg',
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
                colSpan: 3,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 0, right: 3},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 3,
                rowSpan: 3,
                type: 'profile',
                offsets: {top: 3, bottom: 0, left: 0, right: 3},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 2,
                col: 2,
                type: 'inactive-leaf-small',
                offsets: {top: 5, bottom: 0, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 3,
                col: 2,
                type: 'active-leaf',
                offsets: {top: 5, bottom: 10, left: 5, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },

        ]
    },
    'transoms-type-9': {
        id: 'transoms-type-9',
        name: 'Фрамуга 9',
        width: 1667,
        height: 3000,
        minWidth: 800,
        minHeight: 800,
        maxWidth: 5000,
        maxHeight: 5000,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x3',
        colWidths: [42, 810, 815],
        rowHeights: [42, 943, 2015],
        imgSrc: './img/transomTemplates/transom-9.svg',
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
                offsets: {top: 5, bottom: 10, left: 0, right: 5},
                innerWidth: 0,
                innerHeight: 0
            },
            {
                row: 1,
                col: 3,
                rowSpan: 3,
                type: 'inactive-leaf',
                offsets: {top: 3, bottom: 0, left: 0, right: 3},
                innerWidth: 0,
                innerHeight: 0
            },
        ]
    },
};

export {PROFILES_TYPES, TRANSOM_TEMPLATES}