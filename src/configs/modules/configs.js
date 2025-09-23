

/** @type {ProfilesAvailableDecorPresets} */const PROFILES_AVAILABLE_DECOR_PRESETS = {
    'modulasg': {
        glueRail: ["r01", "r02", "r03", "r04", "r05", "r06", "r07", "r08", "r09", "r10", "r11", "r12", "r13", "r14", "r15", "r21", "r22", "r23", "r24", "r25", "r26"],
        profileRail: ["v01", "v02", "v03"],
    },
    'spaziosg': {
        glueRail: [],
        profileRail: ["v01", "v02", "v03", "v04", "v05", "v06"],

    },
    'spazioltsl': {
        glueRail: [],
        profileRail: [],
    },
}

/** @type {ProfilesPaddings} */const PROFILES_PADDINGS = { 
    'modulasg': {
        other: {
            nonTempered: {w: 63, h: 63},
            tempered: null
        },
        4: {
            nonTempered: {w: 63, h: 63},
            tempered: {w: 63, h: 64}
        },
        6: {
            nonTempered: {w: 64, h: 64},
            tempered: null
        },
        8: {
            nonTempered: {w: 63, h: 63},
            tempered: {w: 63, h: 64}
        }
    },
    'spaziosg': {
        other: {
            nonTempered: {w: 12, h: 12},
            tempered: null
        },
        4: {
            nonTempered: {w: 12, h: 12},
            tempered: {w: 12, h: 13}
        }
    },
    'spazioltsl': {
        other: {
            nonTempered: {w: 12, h: 12},
            tempered: null
        },
        4: {
            nonTempered: {w: 12, h: 12},
            tempered: {w: 12, h: 13}
        }
    }
};

/** @type {ProfilesTypes} */const PROFILES_TYPES = {
    'modulasg': {
        id: 'modulasg',
        name: 'Modula',
        width: 39,
        height: 41,
        imgSrc: 'https://configdoor.com/public/images/door/modulasl.webp',

        priceId: 's4139_G'
    },
    'spaziosg': {
        id: 'spaziosg',
        name: 'Spazio',
        width: 39,
        height: 41,
        imgSrc: 'https://configdoor.com/public/images/door/spaziosl.webp',

        priceId: 's4139_G'
    },
    'spazioltsl': {
        id: 'spazioltsl',
        name: 'Spazio Light',
        width: 39,
        height: 41,
        imgSrc: 'https://configdoor.com/public/images/door/spazioltsl.webp',

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
                col: 1,
                colSpan: 2,
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
    'transoms-type-10': {
        id: 'transoms-type-10',
        name: 'Фрамуга 10',
        width: 894,
        height: 2057,
        profileId: 'modulasg',
        unit: 'mm',
        schema: '3x3',
        colWidths: [42, 810, 42],
        rowHeights: [42, 2015],
        imgSrc: './img/transomTemplates/transom-10.svg',
        cells: [
            {
                row: 1,
                col: 1,
                rowSpan: 2,
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
                rowSpan: 2,
                type: 'profile',
            },
            {
                row: 2,
                col: 2,
                type: 'active-leaf',
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
 * length - длина соседнего полотна, если сторона left или right, то cell.innerHeight, если top или bottom, то cell.innerWidth
 * q - quantity - количество материала или число или функция с формулой
 * c - condition - функция условия применения
 */

//ToDo для каждого профиля modula,  spazio и spazio light сделать свои наборы или правила,
// пока добавил применение уплотнителя условием

const MT_SETS = {
    // Комплект для глухого полотна или профиля со стеной
    INACTIVE_OR_PROFILE_NULL: [
        {id: 'p0159_G', q: (p) => p.length + 100}, // Профиль АВД 0159 (пристенный) + 100мм запас
       // {id: 'seltht4_G', q: (p) => p.length + 100, c: (p) => p.profileId === 'modulasg'}, // Уплотнитель Ш1/Т1 4мм для S41х39 для профиля S41х39 + 100мм запас
       // {id: 'prF1_G', q: 1}, // Сухарь - 1 шт на полотно/фрамугу
        {id: 'dowel_chapai', q: (p) => Math.floor(p.length / 400) + 1}, // Дюбель чапай: профиль 0159/400мм + 1 шт на отверстие 6мм
        {id: 'fix440_G', q: (p) => Math.floor(p.length / 400) + 1}, // Саморез 4х40 = количеству дюбелей чапай
    ],

    // Комплект для левой/нижней стороны глухого полотна с неактивным полотном
    INACTIVE_LEFT_TOP_INACTIVE: [
        {id: 'p0159_G', q: (p) => p.length + 100}, // Профиль АВД 0159 (соединительный) + 100мм запас
       // {id: 'seltht4_G', q: (p) => p.length + 100, c: (p) => p.profileId === 'modulasg'}, // Уплотнитель Ш1/Т1 4мм для S41х39 + 100мм запас
       // {id: 'prF1_G', q: 1}, // Сухарь - 1 шт на полотно
        {id: 'fix7985_G', q: (p) => Math.max(Math.floor(p.length / 300) + 1, 3)}, // Винт M4х14: профиль 0159/300мм для соединения полотен
    ],

    // Комплект для правой/верхней стороны глухого полотна с неактивным полотном
    INACTIVE_RIGHT_BOTTOM_INACTIVE: [
        {id: 's532_G', q: (p) => p.length + 100}, // Профиль S 5х32 + 100мм запас
    ],

    // Комплект для левой/нижней/верхней стороны с активным полотном
    INACTIVE_LEFT_BOTTOM_TOP_ACTIVE: [
        {id: 'p7967_G', q: (p) => p.length + 100}, // Профиль АВД 7967 + 100мм запас
        //{id: 'seltht4_G', q: (p) => p.length + 100, c: (p) => p.profileId === 'modulasg'}, // Уплотнитель Ш1/Т1 4мм для S41х39 + 100мм запас
        {id: 'sealAl43_G', q: (p) => p.length + 100, c: (p) => p.profileId === 'modulasg'}, // Уплотнитель АЛ-43 для профиля 7996 + 100мм запас
       // {id: 'prF1_G', q: 1}, // Сухарь - 1 шт на полотно
    ],

    // Комплект для профиля с профильным соседом
    INACTIVE_PROFILE: [
        {id: 'p0159_G', q: (p) => p.length + 100}, // Профиль АВД 0159 + 100мм запас
      //  {id: 'seltht4_G', q: (p) => p.length + 100, c: (p) => p.profileId === 'modulasg'}, // Уплотнитель Ш1/Т1 4мм для S41х39 + 100мм запас
       // {id: 'prF1_G', q: 1}, // Сухарь - 1 шт на полотно
        {id: 'fix7985_G', q: (p) => Math.max(Math.floor(p.length / 300) + 1, 3)}, // Винт M4х14: профиль 0159/300мм
    ],

    // Комплект для активного полотна с любым соседом
    ACTIVE_ANY: [
        {id: 's532_G', q: (p) => p.length + 100}, // Профиль S 5х32 + 100мм запас
        //{id: 'seltht4_G', q: (p) => p.length + 100, c: (p) => p.profileId === 'modulasg'}, // Уплотнитель Ш1/Т1 4мм для S41х39 + 100мм запас
    ],

    // Комплект для профиля с полотном в качестве соседа
    PROFILE_LEAF: [
        {id: 'p7967_G', q: (p) => p.length + 100}, // Профиль АВД 7967 + 100мм запас
        //{id: 'seltht4_G', q: (p) => p.length + 100, c: (p) => p.profileId === 'modulasg'},  Уплотнитель Ш1/Т1 4мм для S41х39 + 100мм запас
        {id: 'sealAl43_G', q: (p) => p.length + 100, c: (p) => p.profileId === 'modulasg'}, // Уплотнитель АЛ-43 + 100мм запас
       // {id: 'prF1_G', q: 1}, // Сухарь - 1 шт на полотно
    ],

    // Дополнительный комплект для профиля (левая/правая стороны) - крепление к стене
    PROFILE_RIGHT_LEFT_NULL: [
        {id: 'dowel_chapai', q: (p) => Math.floor((p.length - 200) / 575) + 1}, // Дюбель чапай для отверстий 6мм
        {id: 'fix440_G', q: (p) => Math.floor((p.length - 200) / 575) + 1}, // Саморез 4х40 = количеству дюбелей чапай
        {id: 'fix430_G', q: (p) => (Math.floor((p.length - 200) / 575) + 1) * 2}, // Винт М4х30: по 1 шт на каждое отверстие 3мм × 2
    ],
    // Дополнительный комплект ригелей
    INACTIVE_BOTTOM_ACTIVE: [
        {id: 'rigelDefault', q: 1},
        {id: 'rigelDefault', q: 1},
        {id: 'screwM20', q: 2}, //по два штуки на каждый ригель
        {id: 'screwM20', q: 2}, //по два штуки на каждый ригель
    ],
    HORIZONTAL_PROFILE_INACTIVE: [{id: 'corner-100-100-8', q: 1}],
    FORCED_ACTIVE: [
        {id: 'plate-27-200-4', q: 1},
        {id: 'plate-27-200-4', q: 1}
    ]
}


//правила для материалов null - примыкание к стене
const MATERIALS_ON_SIDE_RULES = {
    // Глухое полотно
    inactive: {
        left: {
            null: [...MT_SETS.INACTIVE_OR_PROFILE_NULL],
            inactive: [...MT_SETS.INACTIVE_LEFT_TOP_INACTIVE],
            active: [...MT_SETS.INACTIVE_LEFT_BOTTOM_TOP_ACTIVE],
            verticalProfile: [...MT_SETS.INACTIVE_PROFILE]
        },
        right: {
            null: [...MT_SETS.INACTIVE_OR_PROFILE_NULL],
            inactive: [...MT_SETS.INACTIVE_RIGHT_BOTTOM_INACTIVE],
            active: [...MT_SETS.INACTIVE_LEFT_BOTTOM_TOP_ACTIVE],
            verticalProfile: [...MT_SETS.INACTIVE_PROFILE]
        },
        top: {
            null: [...MT_SETS.INACTIVE_OR_PROFILE_NULL],
            inactive: [...MT_SETS.INACTIVE_LEFT_TOP_INACTIVE],
            active: null,
            horizontalProfile: [...MT_SETS.INACTIVE_PROFILE]
        },
        bottom: {
            null: [...MT_SETS.INACTIVE_OR_PROFILE_NULL],
            inactive: [...MT_SETS.INACTIVE_RIGHT_BOTTOM_INACTIVE],
            active: [...MT_SETS.INACTIVE_LEFT_BOTTOM_TOP_ACTIVE, ...MT_SETS.INACTIVE_BOTTOM_ACTIVE],
            horizontalProfile: null,
            forcedActive: [...MT_SETS.INACTIVE_BOTTOM_ACTIVE, ...MT_SETS.FORCED_ACTIVE]
        }
    },

    // Активное полотно
    active: {
        left: {
            inactive: [...MT_SETS.ACTIVE_ANY],
            verticalProfile: [...MT_SETS.ACTIVE_ANY],
            null: [...MT_SETS.ACTIVE_ANY],
        },
        right: {
            inactive: [...MT_SETS.ACTIVE_ANY],
            verticalProfile: [...MT_SETS.ACTIVE_ANY],
            null: [...MT_SETS.ACTIVE_ANY],
        },
        top: {
            inactive: [...MT_SETS.ACTIVE_ANY],
            horizontalProfile: [...MT_SETS.ACTIVE_ANY],
            null: [...MT_SETS.ACTIVE_ANY],
        },
        bottom: {
            null: null,
        }
    },

    // Короб (профиль)
    verticalProfile: {
        left: {
            null: [...MT_SETS.INACTIVE_OR_PROFILE_NULL, ...MT_SETS.PROFILE_RIGHT_LEFT_NULL],
            inactive: [...MT_SETS.PROFILE_LEAF],
            active: [...MT_SETS.PROFILE_LEAF]
        },
        right: {
            null: [...MT_SETS.INACTIVE_OR_PROFILE_NULL, ...MT_SETS.PROFILE_RIGHT_LEFT_NULL],
            inactive: [...MT_SETS.PROFILE_LEAF],
            active: [...MT_SETS.PROFILE_LEAF]
        },
    },
    horizontalProfile: {
        left: {
            inactive: [...MT_SETS.HORIZONTAL_PROFILE_INACTIVE], //уголок
        },
        right: {
            inactive: [...MT_SETS.HORIZONTAL_PROFILE_INACTIVE], //уголок
        },
        top: {
            null: [...MT_SETS.INACTIVE_OR_PROFILE_NULL]
        },
        bottom: {
            inactive: [...MT_SETS.PROFILE_LEAF],
            active: [...MT_SETS.PROFILE_LEAF]
        }
    }
}


export {PROFILES_TYPES, TRANSOM_TEMPLATES, LEAF_LIMITS, MATERIALS_ON_SIDE_RULES, PROFILES_PADDINGS, PROFILES_AVAILABLE_DECOR_PRESETS}