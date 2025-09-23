import Mexp from 'math-expression-evaluator'
import _has from 'lodash/has'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _cloneDeep from 'lodash/cloneDeep';

const createProfileObj = () => {
    const res = {};

    let total = 0;

    Object.defineProperty(res, 'total', {
        enumerable: true,
        get() { return total; },
        set(v) { total = v; return total; },
    });

    return res;
}


/**
 * Класс с методами для расчета
 */
export default class CalcDecorTemplate {
    _regExps = {
        variable : /{.*?}/g,     // для поиска переменных
        brace    : /({)|(})/g,   // для удаления фигурных кавычек
        string   : /(\[)|(])/g,  // не передает в вычисление
        inRBraces: /\[.*]/g,     // квадратные кавычки в переменной
        thisItem : /this/g,      // текущий прямоугольник
        prevItem : /prev/g,      // предыдущий прямоугольник
        nextItem : /next/g,      // следующий прямоугольник
        thisIndex: /thisIndex/g, // текущий индекс
        prevIndex: /prevIndex/g, // предыдущий индекс
        nextIndex: /nextIndex/g, // следующий индекс
        index    : /^index$/i,   // индекс
    }
    _configArrayKey = 'items'

    /* region SERVICE FUNCTIONS */
    _isArray(array) {
        const isError = !Array.isArray(array)

        if (isError) console.error('not array!')
        return !isError
    }
    _isNumber(value, moreEqualThan = 0, lessEqualThan = Number.MAX_SAFE_INTEGER) {
        const isError = typeof +moreEqualThan !== 'number'
            || typeof +lessEqualThan !== 'number'
            || typeof +value !== 'number'
            || isNaN(+moreEqualThan)
            || isNaN(+lessEqualThan)
            || isNaN(+value)
            || value < moreEqualThan
            || value > lessEqualThan

        if (isError) console.error('not number or out of range!')

        return !isError
    }
    _isBool(val) { return val !== undefined && typeof JSON.parse(val) === 'boolean' }
    _isFunction(val) { return typeof val === 'function' }
    _isSizes({width, height, profile}) {
        const isError = !this._isNumber(width, 1)
            || !this._isNumber(height, 1)
            || !this._isNumber(profile, 0)

        if (isError) console.error('error props!')
        return !isError
    }
    /* endregion SERVICE FUNCTIONS */


    /**
     * Вычисляет геометрические параметры и создает прямоугольники для элементов полотна
     * на основе конфигурации, размеров и математических выражений.
     *
     * @param {Object} params - Параметры для расчета
     * @param {Array} params.config - Конфигурация (Пресет) полотна в виде массива объектов с математическими выражениями
     * @param {number} params.width - Ширина вставки полотна
     * @param {number} params.height - Высота вставки полотна
     * @param {number} params.profile - Ширина разделяющего профиля
     * @param {boolean} [params.flip=false] - Флаг зеркального отражения/переворота конфигурации
     *
     * @returns {Object|undefined} Объект с расчетными параметрами или undefined при ошибке валидации
     * @property {Array} items - Массив рассчитанных прямоугольников/элементов
     * @property {number} width - Исходная ширина
     * @property {number} height - Исходная высота
     * @property {number} profile - Исходная ширина профиля
     * @property {Array} config - Исходная конфигурация
     *
     * @throws {Error} Если встречается неизвестная переменная в математических выражениях
     *
     * @example
     * const result = getDoorRects({
     *   config: [{ width: '[w]', height: '[h]' }],
     *   width: 800,
     *   height: 2100,
     *   profile: 10
     * });
     */
    getDoorRects({config, width, height, profile, flip}) {
        if (!this._isArray(config)) return
        if (!this._isSizes({width, height, profile})) return

        const mExp = new Mexp()
        mExp.addToken([{
            type: 0,
            token: "door_round",
            show: "door_round",
            value(a) {
                const trunc = Math.trunc(a)
                return a - trunc > 0.5 ? trunc + 1 : trunc
            }
        }])
        mExp.addToken([{
            type: 8,
            token: "mod",
            show: "mod",
            value: (a, b) => a % b
        }])

       /* mExp.addToken([{
            type: 8,
            token: "or",
            show: "or",
            value: (a, b) => a || b
        }])

        mExp.addToken([{
            type: 0,
            token: "positive_or_zero",
            show: "positive_or_zero",
            value(a) {
                return a < 0 ? 0 : a
            }
        }])*/

        // предварительная подготовка конифига и достаем все репиты с любой вложенностью
        const getRepeat = (params, index = 0) => {
            const newRepeat = () => index + 1 < params.length ? getRepeat(params, ++index) : []

            if (params[index].hasOwnProperty('repeat')) {
                return [/* round для надежности но нужно быть аккуратным */
                    ...new Array(Math.round(mExp.eval(getPreparedStr(params[index].count || '1', index))))
                        .fill(getRepeat(params[index].repeat))
                        .flat(),
                    ...newRepeat()
                ]
            } else {
                return [params[index], ...newRepeat()]
            }
        }

        const outLeftRange = 'outLeftRange'
        const configParams = {
            width, w: width, height, h: height, profile, p: profile,
            [outLeftRange]: new Proxy({}, { // если полученный индекс prev равен -1
                get(target, prop) {
                    if (prop in target) {
                        return target[prop]
                    } else {
                        return 0 // то возвращаем 0, можно добавлять пропсы в прокси
                    }
                }
            })
        }

        // подготовленная строка для вычислений
        const getPreparedStr = (str, i = 0) => {
            return str.replace(this._regExps.variable, e => { // найти переменную по квадратным кавычкам
                const path = e
                    .replace(this._regExps.brace, '')  // удалить фигурные кавычки
                    .replace(this._regExps.inRBraces, str => { // попадаем в кавычки переменной
                        str = str.replace(this._regExps.string, '')
                            .replace(this._regExps.thisIndex, i)
                            .replace(this._regExps.prevIndex, i - 1)
                            .replace(this._regExps.nextIndex, i + 1)

                        return `[${mExp.eval(str)}]`
                    })
                    .replace(this._regExps.thisItem, `${this._configArrayKey}[${i}]`)
                    .replace(
                        this._regExps.prevItem,
                        _has(configParams, `${this._configArrayKey}[${i - 1}]`) ? `${this._configArrayKey}[${i - 1}]` : outLeftRange
                    )
                    .replace(this._regExps.nextItem, `${this._configArrayKey}[${i + 1}]`)

                // если это индекс то его и возвращаем
                if (this._regExps.index.test(path)) return i
                // если есть такой ключ в объекте - возвратить
                const valInObj = _get(configParams, path) === undefined ? _get({items: config}, path) : _get(configParams, path)
                if (valInObj !== undefined) {
                    return this._isFunction(valInObj) ? valInObj() : valInObj // можно значение можно функцию его возвращающую
                } else {
                    console.error('key not found!')
                }
            })
        }

        const setConfig = (i, key, mathStr) => {
            mathStr = this._regExps.string.test(mathStr) ? mathStr.replace(this._regExps.string, '')
                : mExp.eval(mathStr);

            _set(configParams, `${this._configArrayKey}[${i}][${key}]`, mathStr)
        }

        configParams[this._configArrayKey] = getRepeat(config).map(item => _cloneDeep(item))

        configParams[this._configArrayKey].forEach((item, i) => {
            for (let [key, value] of Object.entries(item)) {
                // найти переменную в строке
                const mathStr = getPreparedStr(value, i)
                if (mathStr === 'false') {
                    configParams[this._configArrayKey][i] = false
                    break
                }
                setConfig(i, key, mathStr)
            }
        })

        // удаляем отсутствующие, нулевые оставляем для подсчёта профиля нужны
        configParams[this._configArrayKey] = configParams[this._configArrayKey].filter(Boolean)

        if (flip) configParams.items = this.flip(configParams.items, width)

        return configParams
    }

    /**
     * Отражает (зеркалирует) массив прямоугольников/элементов по горизонтальной или вертикальной оси
     *
     * @param {Array<Object>} configParams - Массив объектов с параметрами элементов
     * @param {number} size - Размер области отражения (ширина для горизонтального, высота для вертикального)
     * @param {string} [direction='h'] - Направление отражения
     * @returns {Array<Object>|undefined} Массив отраженных элементов или undefined при невалидных параметрах
     *
     * @example
     * // Горизонтальное отражение
     * const flipped = flip(items, 800, 'h');
     *
     * @example
     * // Вертикальное отражение
     * const flipped = flip(items, 2100, 'v');
     *
     * @example
     * // Использование алиасов
     * const flipped = flip(items, 800, 'horizontal'); // то же что и 'h'
     */
    flip(configParams, size, direction = 'h') {
        if (!this._isArray(configParams) || !this._isNumber(size)) return

        switch (direction.toLowerCase()) {
            case 'h':
            case 'horizon':
            case 'horizontally':
            case 'x':
                return configParams.map(item => ({...item, x: size - item.x - item.width}))
            case 'v':
            case 'vertical':
            case 'vertically':
            case 'y':
                return configParams.map(item => ({...item, y: size - item.y - item.height}))
            default:
                return _cloneDeep(configParams)
        }
    }

    /**
     * Вычисляет суммарные длины горизонтальных и вертикальных профилей
     * для набора прямоугольников (элементов полотна).
     *
     * Для каждого профиля создается объект с ключами вида:
     *  - `h<key>_<num>` — горизонтальные профили по ключу и номеру
     *  - `v<key>_<num>` — вертикальные профили по ключу и номеру
     *  - `total` — суммарная длина всех профилей данного типа
     *
     * @param {Object} props - Параметры для расчета
     * @param {Array<Object>} props.rects - Массив прямоугольников с данными профилей
     * @param {number} props.width - Ширина вставки полотна
     * @param {number} props.height - Высота вставки полотна
     * @param {number} props.profile - Ширина разделяющего профиля
     *
     * @returns {Object<string, Object>|undefined} Объект, где ключ — имя профиля,
     * а значение — объект с рассчитанными длинами и общим итогом,
     * либо undefined при ошибке валидации.
     *
     * @example
     * const result = calcTemplateProfiles({
     *   rects: [
     *     { profileKeyH: 1, profileNameH: 'p1', width: 500 },
     *     { profileKeyV: 2, profileNameV: 'p2', height: 700 }
     *   ],
     *   width: 800,
     *   height: 2100,
     *   profile: 10
     * });
     *
     * // result может выглядеть так:
     * {
     *   p1: { h1_1: 500, total: 500 },
     *   p2: { v2_1: 700, total: 700 }
     * }
     */
    calcTemplateProfiles(props) {
        const {rects, width, height, profile} = props

        if (!this._isArray(rects) || !this._isSizes(props)) return

        if (+width <= 0 || +height <= 0 || profile < 0) {console.error('error props'); return}

        return rects.reduce((acc, rect) => {
            let key  = rect.profileKeyH,  // Номер накладки в конфиг
                name = rect.profileNameH, // Ид профиля
                count = rect.profileCountH || 1;

            if (key && name) {
                const h = acc[name] || (acc[name] = createProfileObj()),
                    size = (h[key] || 0) + +(rect.profileH || rect.width);

                for (let num = 1; num <= count; num++) {
                    const ikey = 'h' + key + '_' + num;

                    h[ikey] = h[ikey] ? h[ikey] + size : size;
                    h.total += size;
                }
            }

            key  = rect.profileKeyV;
            name = rect.profileNameV;
            count = rect.profileCountV || 1;

            if (key && name) {
                const v = acc[name] || (acc[name] = createProfileObj()),
                    size = (v[key] || 0) + +(rect.profileV || rect.height);

                for (let num = 1; num <= count; num++) {
                    const ikey = 'v' + key + '_' + num;

                    v[ikey] = v[ikey] ? v[ikey] + size : size
                    v.total += size;
                }
            }

            return acc
        }, {})
    }

    /**
     * Вычисляет площадь и периметр прямоугольников.
     *
     * Если у элемента указано `area: 'no'`, то он исключается из расчета.
     * Для остальных элементов в объект добавляются:
     *  - `perimeter` — периметр прямоугольника
     *
     * @param {Array<Object>} rects - Массив прямоугольников
     * @param {number} rects[].width - Ширина прямоугольника
     * @param {number} rects[].height - Высота прямоугольника
     * @param {string} [rects[].area] - Флаг исключения из расчета (`'no'` для пропуска)
     *
     * @returns {{parts: number[], total: number}|undefined}
     * Объект с массивом отдельных площадей (`parts`) и суммарной площадью (`total`),
     * либо undefined при невалидных входных данных.
     *
     * @example
     * const result = getArea([
     *   { width: 100, height: 200 },
     *   { width: 50, height: 50 },
     *   { width: 30, height: 40, area: 'no' }
     * ]);
     *
     * // result:
     * // {
     * //   parts: [20000, 2500],
     * //   total: 22500
     * // }
     */
    getArea(rects) {
        if (!this._isArray(rects)) return

        return rects.reduce((acc, rect) => {
            if (!(rect.hasOwnProperty('area') && rect.area === 'no')) {
                const area = rect.width * rect.height

                rect.perimetr = (rect.width + rect.height) * 2;
                acc.parts.push(area)
                acc.total += area
            }

            return acc
        }, {
            parts: [],
            total: 0
        })
    }
}
