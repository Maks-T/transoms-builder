export const LEAF_TYPES = {
    ACTIVE_LEAF: 'active-leaf',
    INACTIVE_LEAF: 'inactive-leaf',
    INACTIVE_LEAF_SMALL: 'inactive-leaf-small',
    ACTIVE_LEAF_SMALL: 'active-leaf-small',
}

export const LEAF_NAMES = {
    [LEAF_TYPES.ACTIVE_LEAF]: 'Активное\nполотно',
    [LEAF_TYPES.INACTIVE_LEAF]: 'Глухое\nполотно',
    [LEAF_TYPES.ACTIVE_LEAF_SMALL]: 'Активная\nфорточка',
    [LEAF_TYPES.INACTIVE_LEAF_SMALL]: 'Глухая\nфорточка',
}

export const LEAF_HINGE_SIDE = {
    LEFT: 'left',   // Петли слева
    RIGHT: 'right'  // Петли справа
}

export const LEAF_HINGE_SIDE_NAMES = {
    [LEAF_HINGE_SIDE.LEFT]: 'Левое',   // Петли слева
    [LEAF_HINGE_SIDE.RIGHT]: 'Правое'  // Петли справа
}

export const LEAF_SWING_DIRECTION = {
    INWARD: 'inward',   // Внутрь помещения
    OUTWARD: 'outward'  // Наружу из помещения
}

export const LEAF_SWING_DIRECTION_NAMES = {
    [LEAF_SWING_DIRECTION.INWARD]: 'Внутрь',   // Внутрь помещения
    [LEAF_SWING_DIRECTION.OUTWARD]: 'Наружу'  // Наружу из помещения
}


export const RULE_CELL_TYPES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    VERTICAL_PROFILE: 'verticalProfile',
    HORIZONTAL_PROFILE: 'horizontalProfile',
}

export const PROFILE_TYPE = 'profile'

export const DECOR_TYPES_NAMES = {
    profileRail: 'Секционный декор',
    glueRail: 'Накладной декор',
};

