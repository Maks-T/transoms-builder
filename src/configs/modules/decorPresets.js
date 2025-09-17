export const DECOR_PRESETS = {
    default: [
        {x: '0', y: '0', width: '{width}', height: '{height}'},
    ],

    r01: [
        //первый удобно создавать для переменных и как опорный, хорошо для оптимизации т.к. вычислить нужно 1 раз в большинстве случаев
        {_height: '25', x: '0', y: '0', width: '{w}', height: '(({h} + {p}) / door_round(({h} + {p}) / ({this._height} + {p}))) - {p}', area: '[no]'},
        {
            repeat: [{x: '{prev.x}', y: '{prev.y} + {prev.height} + {p}', width: '{prev.width}', height: '{prev.height}', area: '[no]', profileKeyH: '{index}', profileNameH: '[railGlueV]', profileCountH: '2'}],
            count: 'door_round(({h} + {p}) / ({items[0]_height} + {p})) - 1'
        }
    ],
    r02: [
        {_width: '25', x: '0', y: '0', width: '(({w} + {p}) / door_round(({w} + {p}) / ({this._width} + {p}))) - {p}', height: '{h}', area: '[no]'},
        {repeat: [
                {x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]', profileKeyV: '{index}', profileNameV: '[railGlueV]', profileCountV: '2'},
            ],
            count: 'door_round(({w} + {p}) / ({items[0]_width} + {p})) - 1'
        }
    ],
    r03: [
        {_height: '200', _columns: '2', x: '0', y: '0', width: '({w} - ({p} * ({this._columns} - 1))) / {this._columns}', height: '(({h} + {p}) / door_round(({h} + {p}) / ({this._height} + {p}))) - {p}', area: '[no]'},
        {
            repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '0', width: '{prev.width}', height: '{prev.height}', area: '[no]', profileV: '{h}', profileKeyV: 'mod({index}, {items[0]._columns})', profileNameV: '[railGlueV]', profileCountV: '2'}],
            count: '{items[0]._columns} - 1'
        },
        {
            repeat: [
                {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{items[0].width}', height: '{items[0].height}', area: '[no]', profileH: '{w}', profileKeyH: 'door_round({index} / {items[0]._columns})', profileNameH: '[railGlueH]', profileCountH: '2'},
                {
                    repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]'}],
                    count: '{items[0]._columns} - 1'
                },
            ],
            count: 'door_round(({h} + {p}) / ({items[0]_height} + {p})) - 1'
        }
    ],
    r04: [
        {_height: '200', _columns: '3', x: '0', y: '0', width: '({w} - ({p} * ({this._columns} - 1))) / {this._columns}', height: '(({h} + {p}) / door_round(({h} + {p}) / ({this._height} + {p}))) - {p}', area: '[no]'},
        {
            repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '0', width: '{prev.width}', height: '{prev.height}', area: '[no]', profileV: '{h}', profileKeyV: 'mod({index}, {items[0]._columns})', profileNameV: '[railGlueV]', profileCountV: '2'}],
            count: '{items[0]._columns} - 1'
        },
        {
            repeat: [
                {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{items[0].width}', height: '{items[0].height}', area: '[no]', profileH: '{w}', profileKeyH: 'door_round({index} / {items[0]._columns})', profileNameH: '[railGlueH]', profileCountH: '2'},
                {
                    repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]'}],
                    count: '{items[0]._columns} - 1'
                },
            ],
            count: 'door_round(({h} + {p}) / ({items[0]_height} + {p})) - 1'
        }
    ],
    r05: [
        {_height: '200', _columns: '4', x: '0', y: '0', width: '({w} - ({p} * ({this._columns} - 1))) / {this._columns}', height: '(({h} + {p}) / door_round(({h} + {p}) / ({this._height} + {p}))) - {p}', area: '[no]'},
        {
            repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '0', width: '{prev.width}', height: '{prev.height}', area: '[no]', profileV: '{h}', profileKeyV: 'mod({index}, {items[0]._columns})', profileNameV: '[railGlueV]', profileCountV: '2'}],
            count: '{items[0]._columns} - 1'
        },
        {
            repeat: [
                {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{items[0].width}', height: '{items[0].height}', area: '[no]', profileH: '{w}', profileKeyH: 'door_round({index} / {items[0]._columns})', profileNameH: '[railGlueH]', profileCountH: '2'},
                {
                    repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]'}],
                    count: '{items[0]._columns} - 1'
                },
            ],
            count: 'door_round(({h} + {p}) / ({items[0]_height} + {p})) - 1'
        }
    ],
    r06: [
        {_width: '25', x: '0', y: '0', width: '(({w} + {p}) / door_round(({w} + {p}) / ({this._width} + {p}))) - {p}', height: '380', area: '[no]', profileH: '{w}', profileKeyH: '1', profileNameH: '[railGlueH]', profileCountH: '2'},
        {
            repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]', profileV: '{h}', profileKeyV: 'mod({index}, door_round(({w} + {p}) / ({items[0]_width} + {p})))', profileNameV: '[railGlueV]', profileCountV: '2'}],
            count: 'door_round(({w} + {p}) / ({items[0]_width} + {p})) - 1'
        },

        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{items[0].width}', height: '{h} - {prev.height} * 2 - {p} * 2', area: '[no]', profileH: '{w}', profileKeyH: '2', profileNameH: '[railGlueH]', profileCountH: '2'},
        {
            repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]'}],
            count: 'door_round(({w} + {p}) / ({items[0]_width} + {p})) - 1'
        },

        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{items[0].width}', height: '380', area: '[no]'},
        {
            repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]'}],
            count: 'door_round(({w} + {p}) / ({items[0]_width} + {p})) - 1'
        },
    ],
    r07: [
        {_width: '63.24', _height: '350', x: '0', y: '0', width: '(({w} + {p}) / door_round(({w} + {p}) / ({this._width} + {p}))) - {p}', height: '(({h} + {p}) / door_round(({h} + {p}) / ({this._height} + {p}))) - {p}', area: '[no]'},
        {
            repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{items[0].width}', height: '{items[0].height}', area: '[no]', profileV: '{h}', profileKeyV: '{index}', profileNameV: '[railGlueV]', profileCountV: '2'}],
            count: 'door_round(({w} + {p}) / ({items[0]_width} + {p})) - 1'
        },
        {
            repeat: [
                {x: '0', y: '{prev.y} + {items[0].height} + {p}', width: '{items[0].width}', height: '{items[0].height}', area: '[no]', profileH: '{w}', profileKeyH: 'mod({index}, door_round(({h} + {p}) / ({items[0]_height} + {p})) - 1) + 1', profileNameH: '[railGlueH]', profileCountH: '2'},
                {
                    repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]'}],
                    count: 'door_round(({w} + {p}) / ({items[0]_width} + {p})) - 1'
                },
            ],
            count: 'door_round(({h} + {p}) / ({items[0]_height} + {p})) - 1'
        },
    ],
    r08: [
        {_width: '25', _height: '50', x: '0', y: '0', width: '(({w} + {p}) / door_round(({w} + {p}) / ({this._width} + {p}))) - {p}', height: '(({h} + {p}) / door_round(({h} + {p}) / ({this._height} + {p}))) - {p}', area: '[no]'},
        {
            repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{items[0].width}', height: '{items[0].height}', area: '[no]', profileV: '{h}', profileKeyV: '{index}', profileNameV: '[railGlueV]', profileCountV: '2'}],
            count: 'door_round(({w} + {p}) / ({items[0]_width} + {p})) - 1'
        },
        {
            repeat: [
                {x: '0', y: '{prev.y} + {items[0].height} + {p}', width: '{items[0].width}', height: '{items[0].height}', area: '[no]', profileH: '{w}', profileKeyH: 'mod({index}, door_round(({h} + {p}) / ({items[0]_height} + {p})) - 1) + 1', profileNameH: '[railGlueH]', profileCountH: '2'},
                {
                    repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]'}],
                    count: 'door_round(({w} + {p}) / ({items[0]_width} + {p})) - 1'
                },
            ],
            count: 'door_round(({h} + {p}) / ({items[0]_height} + {p})) - 1'
        },
    ],
    r09: [
        {x: '0', y: '0', width: '({w} - 3 * {p}) / 4', height: '(({h} - {p}) / 2)', area: '[no]', profileKeyV: '1', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{prev.width} + {p}', y: '0', width: '{prev.width}', height: '{prev.height}', area: '[no]', profileKeyV: '2', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{prev.x} + {prev.width} + {p}', y: '0', width: '{w} - {prev.x} - {prev.width} - {p}', height: '{items[0].height}', area: '[no]', profileH: '{w}', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{items[0].y} + {items[0].height} + {p}', width: '{prev.width}', height: '{items[0].height}', area: '[no]', profileKeyV: '3', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{prev.width} + {p}', y: '{prev.y}', width: '{items[0].width}', height: '{prev.height}', area: '[no]', profileKeyV: '4', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{items[0].width}', height: '{prev.height}', area: '[no]'},
    ],
    r10: [
        {x: '0', y: '0', width: '{w}', height: '{h} - {next.height} - {p}', area: '[no]', profileH: '{w}', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.height} + {p}', width: '({w} - {p}) / 2', height: '1200', area: '[no]', profileKeyV: '1', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{prev.width} + {prev.x} + {p}', y: '{prev.y}', width: '{w} - {p} - {prev.width}', height: '{prev.height}', area: '[no]'}
    ],
    r11: [
        {x: '0', y: '0', width: '({w} - {p}) / 2', height: '{h} - {items[2].height} - {p}', area: '[no]', profileKeyV: '1', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{prev.width} + {prev.x} + {p}', y: '0', width: '{w} - {p} - {prev.width}', height: '{prev.height}', area: '[no]'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '1200', area: '[no]', profileH: '{w}', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'}
    ],
    r12: [
        {x: '0', y: '0', width: '{this._width}', height: '{this._height}', area: '[no]', _height: '380', _width: '200', profileKeyV: '1', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{p} + {prev.width}', y: '0', width: '{w} - {prev.width} - {p}', height: '{prev.height}', area: '[no]', profileH: '{w}', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{items[0]._height} + {p}', width: '{w} - {items[0]._width} - {p}', height: '{h} - (2 * ({p} + {items[0]._height}))', area: '[no]'},
        {x: '{prev.width} + {p}', y: '{prev.y}', width: '{items[0]._width}', height: '{prev.height}', area: '[no]', profileKeyV: '2', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '0', y: '{items[2].y} + {items[2].height} + {p}', width: '{items[0]._width}', height: '{items[0]._height}', area: '[no]', profileKeyV: '3', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{p} + {prev.width}', y: '{items[4].y}', width: '{w} - {prev.width} - {p}', height: '{prev.height}', area: '[no]', profileH: '{w}', profileKeyH: '2', profileNameH: '[railGlueV]', profileCountH: '2'},
    ],
    r13: [
        {x: '0', y: '0', width: '{w}', height: '200', area: '[no]'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{h} - {prev.height} - {next.height} - {items[3].height} - {items[4].height} - (4 * {p})', area: '[no]', profileKeyH: '{index}', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '500', area: '[no]', profileKeyH: '{index}', profileNameH: '[railGlueV]', profileCountH: '2'},
        {
            repeat: [{x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '380', area: '[no]', profileKeyH: '{index}', profileNameH: '[railGlueV]', profileCountH: '2'}],
            count: '2'
        },
    ],
    r14: [
        {x: '0', y: '0', width: '{w}', height: '380', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{h} - {prev.height} - {next.height} - {items[3].height} - {items[4].height} - (4 * {p})', area: '[no]'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '750', area: '[no]', profileKeyH: '{index}', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '200', area: '[no]', profileKeyH: '{index}', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '250', area: '[no]', profileKeyH: '{index}', profileNameH: '[railGlueV]', profileCountH: '2'},
    ],
    r15: [
        {x: '0', y: '0', width: '280', height: '{h} / 2 - {next.height} - {p}', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2', profileKeyV: '1', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '0', y: '{prev.height} + {p}', width: '280', height: '240', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2', profileKeyV: '1', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{prev.x} + {prev.width} + {p}', y: '0', width: '{w} - {prev.width} - {p}', height: '240', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '{prev.x}', y: '{prev.y} + {prev.height} + {p}', width: '{prev.width}', height: '{h} / 2 - {prev.height} - {p}', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{h} / 2 + {p}', width: '280', height: '{h} / 2', area: '[no]', profileKeyV: '1', profileNameV: '[railGlueV]', profileCountV: '2'},
        {x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{w} - {prev.width} - {p}', height: '{h} / 2 - {next.height} - {p}', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '{prev.x}', y: '{prev.y} + {prev.height} + {p}', width: '{prev.width}', height: '280', area: '[no]'},
    ],
    r21: [
        {x: '0', y: '0', width: '{w}', height: '({h} - {p}) / 2', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]'},
    ],
    r22: [
        {x: '0', y: '0', width: '{w}', height: '({h} - {p} * 2) / 3', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]'}
    ],
    r23: [
        {x: '0', y: '0', width: '{w}', height: '({h} - {p} * 3) / 4', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]'},
    ],
    r24: [
        {x: '0', y: '0', width: '{w}', height: '({h} - {p} * 4) / 5', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height}', area: '[no]'},
    ],
    r25: [
        {x: '0', y: '0', width: '{w}', height: '({h} - {p} * 2) / 4', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height} * 2', area: '[no]', profileKeyH: '1', profileNameH: '[railGlueV]', profileCountH: '2'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w}', height: '{prev.height} / 2', area: '[no]'},
    ],
    r26: [
        {_height: '400', _columns: '2', x: '0', y: '0', width: '({w} - ({p} * ({this._columns} - 1))) / {this._columns}', height: '(({h} + {p}) / door_round(({h} + {p}) / ({this._height} + {p}))) - {p}', area: '[no]'},
        {
            repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '0', width: '{prev.width}', height: '{prev.height}', area: '[no]', profileV: '{h}', profileKeyV: 'mod({index}, {items[0]._columns})', profileNameV: '[railGlueV]', profileCountV: '2'}],
            count: '{items[0]._columns} - 1'
        },
        {
            repeat: [
                {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{items[0].width}', height: '{items[0].height}', area: '[no]', profileH: '{w}', profileKeyH: 'door_round({index} / {items[0]._columns})', profileNameH: '[railGlueH]', profileCountH: '2'},
                {
                    repeat: [{x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{prev.width}', height: '{prev.height}', area: '[no]'}],
                    count: '{items[0]._columns} - 1'
                },
            ],
            count: 'door_round(({h} + {p}) / ({items[0]_height} + {p})) - 1'
        }
    ],


    v01: [
        {x: '0', y: '0', width: '{w}', height: '{h} - {next.height} - {p}', profileKeyH: '1', profileNameH: '[railProfile]'},
        {x: '0', y: '{prev.height} + {p} + {prev.x}', width: '{w}', height: '1200'},
    ],
    v02: [
        {x: '0', y: '0', width: '{w}', height: '{h} - {next.height} - {items[2].height} - ({p} * 2)', profileKeyH: '1', profileNameH: '[railProfile]'},
        {x: '0', y: '{prev.height} + {p}', width: '{w}', height: '250', profileKeyH: '2', profileNameH: '[railProfile]'},
        {x: '0', y: '{items[0].height} + {prev.height} + ({p} * 2)', width: '{w}', height: '830'}
    ],
    v03: [
        {x: '0', y: '0', width: '{w}', height: '380', profileKeyH: '1', profileNameH: '[railProfile]'},
        {x: '0', y: '{prev.height} + {p}', width: '{w}', height: '{h} - {next.height} - {prev.height} - ({p} * 2)', profileKeyH: '2', profileNameH: '[railProfile]'},
        {x: '0', y: '{items[0].height} + {prev.height} + ({p} * 2)', width: '{w}', height: '500'}
    ],
    v04: [
        {x: '0', y: '0', width: '{w}', height: '{h} - {next.height} - {p}', profileKeyH: '1', profileNameH: '[railProfile]'},
        {x: '0', y: '{prev.height} + {p}', width: '250', height: '1200', profileKeyV: '1', profileNameV: '[railProfile]'},
        {x: '{prev.width} + {prev.x} + {p}', y: '{prev.y}', width: '{w} - {p} - {prev.width}', height: '1200'}
    ],
    v05: [
        {x: '0', y: '0', width: '{this._width}', height: '{h} - ({p} * 2) - {items[3].height} - {items[2].height}', _width: '200', profileKeyH: '1', profileNameH: '[railProfile]'},
        {x: '{p} + {prev.width}', y: '0', width: '{w} - {prev.width} - {p}', height: '{h} - {p} - {items[3].height}', profileKeyV: '1', profileNameV: '[railProfile]'},
        {x: '0', y: '{items[0].height} + {p}', width: '{items[0].width}', height: '250'},
        {x: '0', y: '{prev.y} + {prev.height} + {p}', width: '{w} - {p} - {items[0]._width}', height: '830', profileH: '{w} - {items[0]._width}', profileKeyH: '2', profileNameH: '[railProfile]', profileKeyV: '2', profileNameV: '[railProfile]'},
        {x: '{prev.x} + {prev.width} + {p}', y: '{prev.y}', width: '{items[0]._width}', height: '{prev.height}', profileKeyH: '2', profileNameH: '[railProfile]'},
    ],
    v06: [
        {x: '0', y: '0', width: '{w} - 350', height: '200', profileKeyH: '1', profileNameH: '[railProfile]'},
        {x: '0', y: '{p} + 200', width: '{prev.width}', height: '{h} - {p} - {prev.height} - 1150', profileKeyH: '2', profileNameH: '[railProfile]'},
        {x: '{w} + {p} - 350', y: '0', width: '350', height: '{h} - {p} - 1350 ', profileKeyH: '3', profileNameH: '[railProfile]', profileKeyV: '1', profileNameV: '[railProfile]'},
        {x: '{prev.x}', y: '{p} + {prev.height}', width: '{prev.width}', height: '200', profileKeyH: '4', profileNameH: '[railProfile]', profileKeyV: '1', profileNameV: '[railProfile]'},
        {x: '0', y: '{h} + {p} - 1150', width: '{w} - 350', height: '950 - {p}'},
        {x: '{w} + {p} - 350', y: '{prev.y}', width: '350', height: '1150', profileKeyV: '1', profileNameV: '[railProfile]'},
        {x: '0', y: '{h} + {p} - 200', width: '{w} - 350', height: '200', profileKeyH: '5', profileNameH: '[railProfile]'},
    ],
}