interface ProfileObject {
  id: string;                 // Уникальный идентификатор профиля
  cellIdx: number;            // Индекс ячейки, к которой относится профиль
  cellType: SimpleCellType;   // Тип ячейки ('active-leaf', 'inactive-leaf', 'profile', etc.)
  side: CellSide;             // Сторона ячейки ('left', 'right', 'top', 'bottom')
  profileType: string;        // Тип профиля ('mainProfile',  'mountProfile', 'connectorProfile', 'adapterProfile')
  originLength: number;       // Исходная длина профиля в миллиметрах
  length: number;             // Длина профиля с запасом в миллиметрах
 // isVertical: boolean;      // Указывает, является ли профиль вертикальным
  neighborIdx: number | null; // Индекс соседней ячейки, если есть
 // timestamp: number;        // Временная метка создания профиля
}

interface CellProfiles {
  [side: string]: ProfileObject[]; // Профили для каждой стороны ячейки ('left', 'right', 'top', 'bottom')
}

interface AllProfiles {
  [cellIdx: number]: CellProfiles; // Профили для всех ячеек, индексированные по cellIdx
}


type SimpleCellType = 'profile' | 'active' | 'inactive';

type CellSide = 'left' | 'right' | 'top' | 'bottom';

type NeighborCellType = SimpleCellType | 'null';

/**
 * Правила для выбора типов attach-профилей для ячеек фрамуги.
 * Определяет, какой тип профиля ('mountProfile', 'connectorProfile', 'adapterProfile' или null)
 * используется для каждой стороны ячейки в зависимости от типа ячейки и типа соседней ячейки.
 */
interface AttachProfileRules {
  [cellType: SimpleCellType]: {
    [side: CellSide]: {
      [neighborCellType: NeighborCellType]: string | null;
    };
  };
}

interface CalcProfilesStore {
  // Свойства состояния

  // Геттеры
  configsStore: ConfigsStore; // Экземпляр хранилища конфигураций
  modelingStore: ModelingStore; // Экземпляр хранилища моделирования
  rules: AttachProfileRules; // Правила для attach-профилей

  // Экшены
  getCellType: (cell: TransomCell) => SimpleCellType; // Возвращает упрощенный тип ячейки ('profile', 'active', 'inactive')
  getNeighborsOnSide: (neighbors: Neighbors, side: string) => TransomCell[]; // Возвращает соседей по указанной стороне
  getAttachProfileRule: (cellType: string, side: CellSide, neighborType: string | null) => string | null; // Возвращает правило для attach-профиля
  createProfileObject: (profileType: string, cell: TransomCell, side: CellSide, neighbor?: TransomCell | null) => ProfileObject; // Создает объект профиля
  calculateAttachProfilesByCell: (cell: TransomCell) => CellProfiles; // Вычисляет attach-профили для одной ячейки
  calculateAllAttachProfilesByCells: (cells: TransomCell[]) => AllProfiles; // Вычисляет attach-профили для всех ячеек
  calculateMainProfilesForCell: (cell: TransomCell) => CellProfiles; // Вычисляет основные профили для одной ячейки
  calculateAllMainProfiles: (cells: TransomCell[]) => AllProfiles; // Вычисляет основные профили для всех ячеек
}

declare const useCalcProfilesStore: () => CalcProfilesStore;