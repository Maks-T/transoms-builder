interface MaterialConfig {
    id: string;                               // Уникальный идентификатор материала из прайс-листа
    q: ((params: { length: number }) => number) | number;  // Формула или фиксированное количество материала
}

interface MaterialObject {
    id: string;                               // Уникальный идентификатор объекта материала
    cellIdx: number;                          // Индекс ячейки, к которой относится материал
    price: ProductPrice;                             // Объект прайса материала с деталями (имя, единица, цена и т.д.)
    side: string;                             // Сторона ячейки ('left', 'right', 'top', 'bottom')
    quantity: number;                         // Рассчитанное количество материала
}

interface ProductPrice {
    id: string;                               // Уникальный идентификатор прайса
    name: string;                             // Название материала
    param1?: string;                          // Дополнительный параметр 1 (опциональный)
    param2?: string;                          // Дополнительный параметр 2 (опциональный)
    param3?: string;                          // Дополнительный параметр 3 (опциональный)
    param4?: string;                          // Дополнительный параметр 4 (опциональный)
    weight?: number;                          // Вес материала (опциональный)
    unit: string;                             // Единица измерения (например, 'шт', 'мм')
    priceIn: number;                          // Входная цена
    priceEUR: number;                         // Цена в EUR
    priceUSD: number;                         // Цена в USD
    priceRUB: number;                         // Цена в RUB
    priceBYN: number;                         // Цена в BYN
    pricePLN: number;                         // Цена в PLN
    price: number;                            // Основная цена
}

interface MaterialsRules {
    [cellType: string]: {
        [side: string]: {
            [neighborType: string | 'null']: MaterialConfig[] | null;
        };
    };
}

interface MaterialsObject {
    [cellIdx: number]: MaterialObject[];      // Объект с материалами, сгруппированными по индексу ячейки
}

interface MaterialsStore {
    // Свойства состояния
    state: () => Record<string, never>;       // Пустое состояние хранилища

    // Геттеры
    configsStore: ConfigsStore;               // Экземпляр хранилища конфигураций
    modelingStore: ModelingStore;             // Экземпляр хранилища моделирования
    rules: MaterialsRules;                    // Правила для материалов по типам ячеек, сторонам и соседям

    // Экшены
    getCellType(cell: TransomCell): string;   // Определяет упрощенный тип ячейки ('profile', 'active', 'inactive')
    getNeighborsOnSide(neighbors: Neighbors, side: string): TransomCell[];  // Возвращает соседние ячейки для указанной стороны
    getMaterialsSet(cellType: string, side: string, neighborType: string | null): MaterialConfig[] | null;  // Возвращает набор конфигов для материалов
    createMaterialObject(materialCfg: MaterialConfig, cell: TransomCell, side: string, neighbor?: TransomCell | null): MaterialObject | undefined;  // Создает объект материала
    calculateMaterialsByCell(cell: TransomCell): MaterialObject[];  // Вычисляет материалы для одной ячейки
    calculateTransomMaterials(transom: Transom): MaterialsObject;  // Вычисляет все материалы для фрамуги
}