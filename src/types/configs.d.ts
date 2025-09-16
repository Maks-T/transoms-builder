interface ProfileType {
  id: string;
  name: string;
  imgSrc: string;
  width: number;
  height: number;
  gradeName: string; //ToDo deprecated
  priceId: string;
}

interface ProfilesTypes {
  [key: string]: ProfileType;
}
interface TransomTemplate {
  id: string;                         // Уникальный идентификатор шаблона фрамуги
  name: string;                       // Название шаблона фрамуги
  width: number;                      // Полная ширина шаблона фрамуги в миллиметрах
  height: number;                     // Полная высота шаблона фрамуги в миллиметрах
  minWidth: number;                   // Минимальная допустимая ширина шаблона в миллиметрах
  minHeight: number;                  // Минимальная допустимая высота шаблона в миллиметрах
  maxWidth: number;                   // Максимальная допустимая ширина шаблона в миллиметрах
  maxHeight: number;                  // Максимальная допустимая высота шаблона в миллиметрах
  profileId: string;                  // Идентификатор профиля, связанного с шаблоном
  unit: string;                       // Единица измерения (например, 'mm' для миллиметров)
  schema: string;                     // Описание схемы шаблона (например, строковое представление структуры)
  colWidths: number[];                // Массив ширин колонок шаблона в миллиметрах
  rowHeights: number[];               // Массив высот строк шаблона в миллиметрах
  imgSrc: string;                     // Путь к изображению шаблона для отображения в интерфейсе
  cells: {                            // Массив ячеек, составляющих шаблон фрамуги
    row: number;                      // Номер строки ячейки (начиная с 1)
    col: number;                      // Номер столбца ячейки (начиная с 1)
    type: string;                     // Тип ячейки (например, активное полотно или профиль)
    rowSpan?: number;                 // Количество строк, которые занимает ячейка (по умолчанию 1)
    colSpan?: number;                 // Количество столбцов, которые занимает ячейка (по умолчанию 1)
    offsets?: CellOffsets;            // Отступы ячейки (слева, справа, сверху, снизу)
    innerWidth?: number;              // Внутренняя ширина ячейки (за вычетом отступов)
    innerHeight?: number;             // Внутренняя высота ячейки (за вычетом отступов)
  }[];
}

interface TransomTemplates {
  [key: string]: TransomTemplate;
}

interface SelectOption {
  label: string;
  value: string;
  imgSrc?: string;
}


interface ConfigsStore {
  // Свойства состояния
  profileTypes: { [key: string]: Profile };
  transomTemplates: { [key: string]: TransomTemplate };
  materialsRules: MaterialsRules;
  prices: {
    [id: string]: ProductPrice;
  }

  // Геттеры
  profileTypesArray: SelectOption[];
  transomTemplatesArray: SelectOption[];
  openingSidesArray: SelectOption[];
  swingDirectionsArray: SelectOption[];
  getProfileById: (id: string) => Profile | undefined;
  getTransomTemplateById: (id: string) => TransomTemplate | undefined;
  defaultProfile: string;
  defaultTemplate: string;
  getMaterialsRules:MaterialsRules
  // Экшены
  addProfileType: (profile: Profile) => void;
  addTemplate: (template: TransomTemplate) => void;
}

