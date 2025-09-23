
type DecorPresetType = 'glueRail' | 'profileRail'; //Тип пресета декора: накладной ('glueRail') или секционный ('profileRail').

interface PresetRects {
  items: DecorRect[]; // Массив прямоугольников декора в ячейке
}

interface DecorRect {
  x: number;          // Координата X прямоугольника декора (в миллиметрах)
  y: number;          // Координата Y прямоугольника декора (в миллиметрах)
  width: number;      // Ширина прямоугольника декора (в миллиметрах)
  height: number;     // Высота прямоугольника декора (в миллиметрах)
  material?: string;  // ID материала для прямоугольника или undefined, если не задан
}

interface DecorCell {
  x: number;                    // Координата X ячейки (в миллиметрах)
  y: number;                    // Координата Y ячейки (в миллиметрах)
  width: number;                // Ширина ячейки (в миллиметрах)
  height: number;               // Высота ячейки (в миллиметрах)
  presetId: string;             // ID пресета декора для ячейки
  presetRects: PresetRects;     // Объект с массивом прямоугольников декора
  presetType: DecorPresetType | null; // Тип пресета декора ('glueRail' или 'profileRail') или null
  isFlip: boolean;              // Флаг, указывающий, перевернута ли ячейка
}



interface DecorTransom {
  updateKey: number;                    // Ключ для синхронизации обновлений с modelingStore
  profile: ProfileType;                 // Объект профиля, связанного с фрамугой
  cells: { [key: number]: DecorCell };  // Объект ячеек с декором, где ключ - индекс ячейки из modelingStore
  selectedCellIndex?: number | null;     // Индекс выбранной ячейки или null
  selectedRectIndex?: number | null;     // Индекс выбранной области (rect) или null
}

interface AvailableDecor {
  glueRail: string[];     // Массив ID пресетов для накладного декора
  profileRail: string[];  // Массив ID пресетов для секционного декора
}

/**
 * Структура доступных пресетов декора для профиля.
 */
interface ProfilesAvailableDecor {
  [profileId: string]: AvailableDecor;
}

/**
 * Структура отступов для профиля.
 */
interface ProfilePadding {
  w: number;     // Сумма отсутпов по ширине (в миллиметрах)
  h: number;     // Сумма отсутпов по высоте (в миллиметрах)
}

/**
 * Структура отступов для профиля в зависимости от толщины и типа стекла.
 */
interface ProfilesPaddings {
  [profileId: string]: {
    [thickness: string]: {
      nonTempered: ProfilePadding; // Отступы для незакаленного стекла (или другого материала)
      tempered: ProfilePadding | null; // Отступы для закаленного стекла или null
    };
  };
}

interface DecorStore {
  // Свойства состояния
  transoms: { [key: string]: DecorTransom }; // Объект фрамуг с декором, где ключ - ID фрамуги из modelingStore
  activeTransomId: string | null;            // ID активной фрамуги или null

  // Геттеры
  configsStore: ConfigsStore;                // Хранилище конфигураций
  modelingStore: ModelingStore;              // Хранилище моделирования
  activeTransom: DecorTransom | null;        // Активная фрамуга с декором или null
  selectedCellIndex: number | null;           // Индекс выбранной ячейки или null у активной фрамуги
  selectedRectIndex: number | null;           // Индекс выбранной области (rect) или null  у активной фрамуги
  selectedCell: DecorCell | null;            // Выбранная ячейка с декором или null
  selectedRect: DecorRect | null;            // Выбранная область (rect) или null
  decorPresets: { [key: string]: unknown };  // Объект пресетов декора (конфигурация пресетов)
  profilesPaddings: { [key: string]: unknown }; // Объект отступов для профилей ('modulasg', 'spaziosg',  'spazioltsl',)
  profilesAvailableDecor: { [key: string]: AvailableDecor }; // Доступные пресеты декора для профилей ('modulasg', 'spaziosg',  'spazioltsl',)
  calculatedCells: (modelingTransom: Transom) => { [key: number]: DecorCell } | undefined; // Функция для вычисления ячеек с декором

  // Экшены
  createTransomObject: (modelingTransom: Transom) => DecorTransom; // Создает объект фрамуги с декором
  updateTransomCells: (transom: DecorTransom, modelingTransom: Transom) => void; // Обновляет ячейки фрамуги с декором
  calculateCell: (cell: TransomCell, presetId?: string, presetType?: DecorPresetType | null) => DecorCell; // Вычисляет параметры ячейки с декором
  getAvailableDecor: (modelingTransom: Transom) => AvailableDecor; // Возвращает доступные пресеты декора
  setSelectedCellIndex: (index: number | null) => void; // Устанавливает индекс выбранной ячейки
  setSelectedRectIndex: (index: number | null) => void; // Устанавливает индекс выбранной области
  setPresetForSelectedCell: (presetId: string, presetType: DecorPresetType) => void; // Устанавливает пресет для выбранной ячейки
  setRectMaterial: (cellIndex: number, rectIndex: number, material: string | null) => void; // Устанавливает материал для области в ячейке
}