interface ProfileType {
  id: string;
  name: string;
  imgSrc: string;
  width: number;
  height: number;
  gradeName: string;
}

interface ProfilesTypes {
  [key: string]: ProfileType;
}
interface TransomTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  profileId: string;
  unit: string;
  schema: string;
  colWidths: number[];
  rowHeights: number[];
  imgSrc: string;
  cells: {
    row: number;
    col: number;
    type: string;
    rowSpan?: number;
    colSpan?: number;
    offsets?: { top: number; bottom: number; left: number; right: number };
    innerWidth?: number;
    innerHeight?: number;
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

  // Геттеры
  profileTypesArray: SelectOption[];
  transomTemplatesArray: SelectOption[];
  openingSidesArray: SelectOption[];
  swingDirectionsArray: SelectOption[];
  getProfileById: (id: string) => Profile | undefined;
  getTransomTemplateById: (id: string) => TransomTemplate | undefined;
  defaultProfile: string;
  defaultTemplate: string;

  // Экшены
  addProfileType: (profile: Profile) => void;
  addTemplate: (template: TransomTemplate) => void;
}