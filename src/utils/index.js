/**
 * Создает глубокую копию объекта используя JSON методы
 * @template T
 * @param {T} obj - Объект для клонирования
 * @returns {T | undefined} Глубокая копия объекта или undefined, если входной объект не является объектом
 */
export const cloneObjectDeep = (obj) => {
        if (obj === null || typeof obj !== 'object') {
            console.error('Error during deep cloning:', obj);
            return;
        }

        return JSON.parse(JSON.stringify(obj));
}