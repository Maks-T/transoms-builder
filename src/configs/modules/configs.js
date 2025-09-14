import {ATTACH_PROFILE_TYPES} from "@constants/index.js";


const ATTACH_PROFILES_TYPES =
    {
        mountProfile: { // Крепление к внешним поверхностям и неподвижным элементам АВД 0159
            id: 'p0159_G',
            gradeName: 'Профиль АВД 0159',
        },
        connectorProfile: { // Соединение полотен с коробом или между собой S5x32
            id: 's532_G',
            gradeName: 'Профиль S5х32',
        },
        adapterProfile: {// Комбинированное соединение короба с полотнами АВД 7967
            id: 'p7967_G',
            gradeName: 'Профиль АВД 7967',
        },
    }
;

/** @type {ProfilesTypes} */const PROFILES_TYPES = {
    'modulasg': {
        id: 'modulasg',
        name: 'Modula',
        width: 39,
        height: 41,
        imgSrc: 'https://configdoor.com/public/images/door/modulasl.webp',
        gradeName: 'Профиль S41X39',
        priceId: 's4139_G'
    },
    'spaziosg': {
        id: 'spaziosg',
        name: 'Spazio',
        width: 70,
        height: 41,
        imgSrc: 'https://configdoor.com/public/images/door/spaziosl.webp',
        gradeName: 'Профиль S41X39',
        priceId: 's4139_G'
    },
    'spazioltsl': {
        id: 'spazioltsl',
        name: 'Spazio Light',
        width: 20,
        height: 41,
        imgSrc: 'https://configdoor.com/public/images/door/spazioltsl.webp',
        gradeName: 'Профиль S41X39',
        priceId: 's4139_G'
    },
};

/** @type {TransomTemplates} */
const TRANSOM_TEMPLATES = {
    'transoms-type-1': {
        id: 'transoms-type-1',
        name: 'Фрамуга 1',
        width: 3100,
        height: 2519,
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
            },
            {
                row: 1,
                col: 2,
                type: 'inactive-leaf',
            },
            {
                row: 1,
                col: 3,
                type: 'inactive-leaf',
            },

        ],
        cfgMaterials: [
            //= на каждое полотно и фрамугу по 4 шт. соответственно
            {priceId: 'prF1_G', cellsIdx: [0,1,2], fnCondition: '', fnQuantity: 1, fnPosition: ''}, //если cellIdx === null || undefined || '' то применить ко всем ячейкам
            //кол-во профиля АВД 0159
            {priceId: 'dowel_Chapai', cellsIdx: '[0,1,2]', fnCondition: '', fnQuantity: '3', fnPosition: ''}, //пока нет в базе
            {priceId: 'dowel_Chapai', cellsIdx: '[0,2]', fnCondition: '', fnQuantity: '3', fnPosition: ''},
            {priceId: 'dowel_Chapai', cellsIdx: '[1]', fnCondition: '', fnQuantity: '2', fnPosition: ''},
            {priceId: 'fix440_G', cellsIdx: '[0,1,2]', fnCondition: '', fnQuantity: '3', fnPosition: ''}, //пока нет в базе
            {priceId: 'fix440_G', cellsIdx: '[0,2]', fnCondition: '', fnQuantity: '3', fnPosition: ''},
            {priceId: 'fix440_G', cellsIdx: '[1]', fnCondition: '', fnQuantity: '2', fnPosition: ''},
            {priceId: 'fix7985_G', cellsIdx: '[1]', fnCondition: '', fnQuantity: '2', fnPosition: ''},
            //уплотнитель = кол-во м.п. профиля S41x39
            //perimeter = (cell.width + cell.height) * 2
            {priceId: 'seltht4_G', cellsIdx: '[0,1,2]', fnCondition: "modulasg['modulasg', 'spaziosg', 'spazioltsl'].includes(profileId)", fnQuantity: 'perimeter', fnPosition: ''},
            {priceId: 'film17500del_D', cellsIdx: '[0,1,2]', fnCondition: '', fnQuantity: '5', fnPosition: ''},
        ]
    },
    'transoms-type-2': {
        id: 'transoms-type-2',
        name: 'Фрамуга 2',
        width: 2068,
        height: 2519,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '2x1',
        colWidths: [1034, 1034],
        rowHeights: [2519],

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
                type: 'inactive-leaf',
            },
        ]
    },
    'transoms-type-3': {
        id: 'transoms-type-3',
        name: 'Фрамуга 3',
        width: 2288,
        height: 2519,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '2x2',
        colWidths: [1144, 1144],
        rowHeights: [503, 2016],
        imgSrc: './img/transomTemplates/transom-3.svg',
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
                row: 2,
                col: 1,
                type: 'inactive-leaf',
            },
            {
                row: 2,
                col: 2,
                type: 'inactive-leaf',
            },
        ]
    },
    'transoms-type-4': {
        id: 'transoms-type-4',
        name: 'Фрамуга 4',
        width: 3100,
        height: 2015,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x1',
        colWidths: [1145, 810, 1145],
        rowHeights: [2015],
        imgSrc: './img/transomTemplates/transom-4.svg',
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
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x2',
        colWidths: [1145, 810, 1145],
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
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x3',
        colWidths: [1145, 810, 1145],
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
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x2',
        colWidths: [1145, 810, 1145],
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
            },
            {
                row: 1,
                col: 1,
                colSpan: 3, //пересекает
                type: 'profile',
            },
            {
                row: 1,
                col: 3,
                rowSpan: 3,
                type: 'profile',
            },
            {
                row: 2,
                col: 2,
                type: 'inactive-leaf-small',
            },
            {
                row: 3,
                col: 2,
                type: 'active-leaf',
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
            },
            {
                row: 1,
                col: 2,
                type: 'profile',
            },
            {
                row: 2,
                col: 2,
                type: 'inactive-leaf-small',
            },
            {
                row: 3,
                col: 2,
                type: 'active-leaf',
            },
            {
                row: 1,
                col: 3,
                rowSpan: 3,
                type: 'inactive-leaf',
            },
        ]
    },
};

//Внутренние ограничения размеров ячеек (полотен)
const LEAF_LIMITS = {
    'active': { //размеры активных полотен
        minInnerWidth: 300,
        maxInnerWidth: 1100,
        minInnerHeight: 600,
        maxInnerHeight: 3000
    },
    'inactive': { //размеры глухих полотен
        minInnerWidth: 400,
        maxInnerWidth: 1500,
        minInnerHeight: 300,
        maxInnerHeight: 3100
    },
}

/**
 * length - длина соседнего полотна, если left или right, то cell.innerHeight, если top или bottom, то cell.innerWidth
 */

const MT_SETS = {
    INACTIVE_NULL: [
        {id: 'p0159_G', q: (p) => p.length + 100}, //attach
        {id: 'seltht4_G', q: (p) => p.length + 100}, //Уплотнитель
        {id: 'prF1_G', q: 1}, //Сухарь
        {id: 'dowel_chapai', q: (p) => Math.ceil(p.length / 400) + 1},
        {id: 'fix7985_G', q: 1}, //Винт M4х14 DIN 7985
    ]
}

//правила для материалов
const MATERIALS_ON_SIDE_RULES = {
    // Глухое полотно
    inactive: {
        left: {
            null: [...MT_SETS.INACTIVE_NULL],
            inactive: [],
            active: [],
            profile: {}
        },
        right: {
            null: [...MT_SETS.INACTIVE_NULL],
            inactive: [],
            active: [],
            profile:{}
        },
        top: {
            null: [...MT_SETS.INACTIVE_NULL],
            inactive: [],
            active: null,
            profile: {}
        },
        bottom: {
            null: [...MT_SETS.INACTIVE_NULL],
            inactive: [],
            active: [],
            profile: null
        }
    },

    // Активное полотно
    active: {
        left: {
            inactive: [],
            profile: {}
        },
        right: {
            inactive: [],
            profile: {}
        },
        top: {
            null: [],
            inactive: [],
            profile: {}
        },
        bottom: {
            null: [],
        }
    },

    // Короб (профиль)
    profile: {
        left: {
            null: [],
            inactive: [],
            active: {}
        },
        right: {
            null: [],
            inactive: [],
            active: {}
        },
        top: {
            null: {}
        },
        bottom: {
            inactive: [],
            active: {}
        }
    }
}

//правила для определения дополнительных профилей креплений
const ATTACH_PROFILE_RULES = {
    // Глухое полотно
    inactive: {
        left: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.MOUNT,
            active: ATTACH_PROFILE_TYPES.ADAPTER,
            profile: ATTACH_PROFILE_TYPES.MOUNT
        },
        right: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            active: ATTACH_PROFILE_TYPES.ADAPTER,
            profile: ATTACH_PROFILE_TYPES.MOUNT
        },
        top: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.MOUNT,
            active: null,
            profile: ATTACH_PROFILE_TYPES.MOUNT
        },
        bottom: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            active: ATTACH_PROFILE_TYPES.ADAPTER,
            profile: null
        }
    },

    // Активное полотно
    active: {
        left: {
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            profile: ATTACH_PROFILE_TYPES.CONNECTOR
        },
        right: {
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            profile: ATTACH_PROFILE_TYPES.CONNECTOR
        },
        top: {
            null: ATTACH_PROFILE_TYPES.CONNECTOR,
            inactive: ATTACH_PROFILE_TYPES.CONNECTOR,
            profile: ATTACH_PROFILE_TYPES.CONNECTOR
        },
        bottom: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
        }
    },

    // Короб (профиль)
    profile: {
        left: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.ADAPTER,
            active: ATTACH_PROFILE_TYPES.ADAPTER
        },
        right: {
            null: ATTACH_PROFILE_TYPES.MOUNT,
            inactive: ATTACH_PROFILE_TYPES.ADAPTER,
            active: ATTACH_PROFILE_TYPES.ADAPTER
        },
        top: {
            null: ATTACH_PROFILE_TYPES.MOUNT
        },
        bottom: {
            inactive: ATTACH_PROFILE_TYPES.ADAPTER,
            active: ATTACH_PROFILE_TYPES.ADAPTER
        }
    }
}

export {PROFILES_TYPES, TRANSOM_TEMPLATES, LEAF_LIMITS, ATTACH_PROFILE_RULES, MATERIALS_ON_SIDE_RULES}