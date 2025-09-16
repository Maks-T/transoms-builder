
interface CellOffsets {
  top: number;
  bottom: number;
  right: number;
  left: number;
}

interface TransomValidationData {
  errors: {                // Объект с сообщениями об ошибках валидации
    widthDiff: string,     // Сообщение об ошибке для разницы в ширине фрамуги
    heightDiff: string,    // Сообщение об ошибке для разницы в высоте фрамуги
  },
  params: {                // Объект с параметрами валидации
    widthDiff: number,     // Разница между суммой ширин колонок и шириной фрамуги в миллиметрах
    heightDiff: number,    // Разница между суммой высот строк и высотой фрамуги в миллиметрах
  },
  isValid: boolean,        // Указывает, прошла ли фрамуга валидацию (true, если нет ошибок)
}

interface Transom {
  id: string;                         // Уникальный идентификатор фрамуги, добавляется динамически (например: transom-1757051406156)
  name: string;                       // Название фрамуги (например, "Фрамуга #1")
  width: number;                      // Полная ширина фрамуги в миллиметрах
  height: number;                     // Полная высота фрамуги в миллиметрах
  minWidth: number;                   // Минимальная допустимая ширина фрамуги в миллиметрах
  minHeight: number;                  // Минимальная допустимая высота фрамуги в миллиметрах
  maxWidth: number;                   // Максимальная допустимая ширина фрамуги в миллиметрах
  maxHeight: number;                  // Максимальная допустимая высота фрамуги в миллиметрах
  profileId: string;                  // Идентификатор профиля, используемого в фрамуге
  profile: ProfileType;                   // Объект профиля, содержащий его характеристики
  templateId: string;                 // Идентификатор шаблона фрамуги
  colWidths: number[];                // Массив ширин колонок фрамуги в миллиметрах
  rowHeights: number[];               // Массив высот строк фрамуги в миллиметрах
  cells: TransomCell[];               // Массив ячеек, составляющих фрамугу
  validationData: TransomValidationData; // Данные валидации фрамуги (ошибки и параметры)
}

interface sizeCellMessages {
  innerWidth?: string;    // Сообщение о внутренней ширине ячейки (например, ограничения или ошибка)
  innerHeight?: string;   // Сообщение о внутренней высоте ячейки (например, ограничения или ошибка)
  width?: string;         // Сообщение о полной ширине ячейки (включая отступы)
  height?: string;        // Сообщение о полной высоте ячейки (включая отступы)
}

interface ValidationCellData {
  isValid: boolean;         // Указывает, прошла ли ячейка валидацию (true, если нет ошибок)
  errors: sizeCellMessages; // Объект с сообщениями об ошибках валидации размеров ячейки
  titles: sizeCellMessages; // Объект с подсказками о допустимых размерах ячейки
}

interface TransomCell {
  row: number;                // Номер строки, в которой находится ячейка (начиная с 1)
  col: number;                // Номер столбца, в котором находится ячейка (начиная с 1)
  type: string;               // Тип ячейки ('active-leaf',  'inactive-leaf','inactive-leaf-small', 'active-leaf-small', 'profile')
  rowSpan?: number;           // Количество строк, которые занимает ячейка (по умолчанию 1)
  colSpan?: number;           // Количество столбцов, которые занимает ячейка (по умолчанию 1)
  offsets?: CellOffsets;      // Отступы ячейки (слева, справа, сверху, снизу)
  innerWidth: number;         // Внутренняя ширина ячейки (за вычетом отступов) - ширина полотна
  innerHeight: number;        // Внутренняя высота ячейки (за вычетом отступов) - высота полотна
  idx?: number;               // Индекс ячейки в массиве ячеек фрамуги
  isActive?: boolean;         // Указывает, является ли ячейка активным полотном
  hingeSide?: string;         // Сторона петель (например, левая или правая) - тип открывания
  swingDirection?: string;    // Направление открывания (например, наружу или внутрь)
  isHorizontal?: boolean;     // Указывает, является ли ячейка горизонтальной только для профилей (ширина > высоты)
  isVertical?: boolean;       // Указывает, является ли ячейка вертикальной только для профилей (высота > ширины)
  x?: number;                 // Координата X верхнего левого угла ячейки
  y?: number;                 // Координата Y верхнего левого угла ячейки
  width?: number;             // Полная ширина ячейки (включая отступы)
  height?: number;            // Полная высота ячейки (включая отступы)
  validationData?: ValidationCellData | {}; // Данные валидации ячейки (ошибки и подсказки)
  isInitialized: boolean;     // Указывает, завершены ли все вычисления для ячейки
}


interface SelectOption {
  label: string;
  value: string;
  imgSrc?: string;
}

interface Neighbors {
  top: TransomCell[];
  bottom: TransomCell[];
  left: TransomCell[];
  right: TransomCell[];
}


interface ModelingStore {
  // Свойства состояния
  transoms: Transom[];                    // Массив всех фрамуг в хранилище
  activeTransomId: string | null;         // Идентификатор активной фрамуги или null, если не выбрана
  selectedProfileId: string | null;       // Идентификатор выбранного профиля или null, если не выбран
  selectedTemplateId: string | null;      // Идентификатор выбранного шаблона фрамуги или null, если не выбран
  showDimensions: boolean;                // Флаг отображения размеров в интерфейсе
  showLeafsNames: boolean;                // Флаг отображения имен полотен в интерфейсе
  showDividers: boolean;                  // Флаг отображения разделителей (вертикальных и горизонтальных)

  // Геттеры
  configsStore: ConfigsStore;                                  // Экземпляр хранилища конфигураций
  activeTransom: Transom | undefined;                          // Активная фрамуга или undefined, если не выбрана
  profileTypesArray: SelectOption[];                           // Массив типов профилей для использования в селектах
  transomTemplatesArray: SelectOption[];                       // Массив шаблонов фрамуг для использования в селектах
  openingSidesArray: SelectOption[];                           // Массив сторон открывания (левое/правое) для селектов
  swingDirectionsArray: SelectOption[];                        // Массив направлений открывания (наружу/внутрь) для селектов
  colBoundaries: number[];                                     // Массив координат границ колонок активной фрамуги
  rowBoundaries: number[];                                     // Массив координат границ строк активной фрамуги
  verticalDividers: number[];                                  // Массив координат вертикальных разделителей
  horizontalDividers: number[];                                // Массив координат горизонтальных разделителей
  calculatedCells: TransomCell[] | undefined;                  // Массив вычисленных ячеек активной фрамуги или undefined
  hasActiveLeaf: boolean;                                      // Указывает, есть ли активные полотна в фрамуге
  getActiveTransomValidationData: () => TransomValidationData; // Возвращает данные валидации активной фрамуги

  // Экшены
  createTransomObject: () => Transom | null;                    // Создает объект новой фрамуги или null, если шаблон/профиль не выбраны
  addTransom: () => void;                                       // Создает и добавляет новую фрамугу в массив
  setActiveTransom: (transomId: string) => void;                // Устанавливает активную фрамугу по ID
  setProfileType: (profileId: string) => void;                  // Устанавливает тип профиля и обновляет активную фрамугу
  setTransomTemplate: (templateId: string) => void;             // Устанавливает шаблон фрамуги и обновляет/создает фрамугу
  updateActiveTransomProfile: (profileId: string) => void;      // Обновляет профиль активной фрамуги
  updateActiveTransomTemplate: (templateId: string) => void;    // Обновляет шаблон активной фрамуги
  getNeighbors: (currentCell: TransomCell, transom: Transom) => Neighbors;        // Возвращает соседние ячейки для указанной ячейки
  calculateOffsets: (cell: TransomCell, rowCount: number, colCount: number) => CellOffsets;    // Рассчитывает отступы ячейки
  getCellValidationData: (cell: TransomCell) => ValidationCellData;     // Возвращает данные валидации для ячейки
  updateCellSizes: () => boolean;                                       // Обновляет размеры ячеек активной фрамуги
  changeCellType: (cellIndex: number, newType: string) => void;         // Изменяет тип ячейки
  setTransomWidth: (newWidth: number) => void;                       // Устанавливает ширину активной фрамуги
  setTransomHeight: (newHeight: number) => void;                 // Устанавливает высоту активной фрамуги
  calculateProfileColumnWidths: () => { [key: number]: number };        // Вычисляет ширины колонок с профилями
  calculateProfileRowHeights: () => { [key: number]: number };          // Вычисляет высоты строк с профилями
  updateAutoColWidths: () => void;                                             // Обновляет ширины колонок фрамуги (автоматическое подстраивание под шаблон)
  updateAutoRowHeights: () => void;                                            // Обновляет высоты строк фрамуги (автоматическое подстраивание под шаблон)
  setCellWidth: (cellIndex: number, newWidth: number) => void;          // Устанавливает ширину ячейки
  setCellHeight: (cellIndex: number, newHeight: number) => void;        // Устанавливает высоту ячейки
}