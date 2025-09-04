
interface CellOffsets {
  top: number;
  bottom: number;
  right: number;
  left: number;
}

interface Transom {
  id: string;
  name: string;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  profileId: string;
  profile: Profile;
  templateId: string;
  colWidths: number[];
  rowHeights: number[];
  cells: TransomCell[];
  validation: {
    widthDiff: number;
    heightDiff: number;
    validationKey: number;
  };
  isValid: boolean;
}

interface sizeCellMessages {
  innerWidth?: string;
  innerHeight?: string;
  width?: string;
  height?: string;
}

interface ValidationCellData {
  isValid: boolean;
  errors: sizeCellMessages;
  titles: sizeCellMessages
}

interface TransomCell {
  row: number;
  col: number;
  type: string;
  rowSpan?: number;
  colSpan?: number;
  offsets?: CellOffsets;
  innerWidth: number;
  innerHeight: number;
  idx?: number;
  isActive?: boolean;
  hingeSide?: string;
  swingDirection?: string;
  isHorizontal?: boolean;
  isVertical?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  validationData?: ValidationCellData | {}
}
interface Profile {
  id: string;
  name: string;
  imgSrc: string;
  width: number;
  height: number;
  gradeName: string;
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

interface SizeLimits {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}


interface ModelingStore {
  // Свойства состояния
  transoms: Transom[];
  activeTransomId: string | null;
  selectedProfileId: string | null;
  selectedTemplateId: string | null;
  showDimensions: boolean;
  showDividers: boolean;

  // Геттеры
  configsStore: ConfigsStore;
  activeTransom: Transom | undefined;
  profileTypesArray: SelectOption[];
  transomTemplatesArray: SelectOption[];
  openingSidesArray: SelectOption[];
  swingDirectionsArray: SelectOption[];
  colBoundaries: number[];
  rowBoundaries: number[];
  verticalDividers: number[];
  horizontalDividers: number[];
  calculatedCells: TransomCell[] | undefined;
  hasActiveLeaf: boolean;

  // Экшены

  createTransomObject: () => Transom | null;
  addTransom: () => void;
  setActiveTransom: (transomId: string) => void;
  setProfileType: (profileId: string) => void;
  setTransomTemplate: (templateId: string) => void;
  updateActiveTransomProfile: (profileId: string) => void;
  updateActiveTransomTemplate: (templateId: string) => void;
  getNeighbors: (currentCell: TransomCell) => Neighbors;
  calculateOffsets: (cell: TransomCell, rowCount: number, colCount: number) => CellOffsets;
  getValidationCellData: (cell: TransomCell) => ValidationCellData
  updateCellSizes: () => boolean;
  changeCellType: (cellIndex: number, newType: string) => void;
  setTransomWidth: (newWidth: number) => boolean;
  setTransomHeight: (newHeight: number) => boolean;
  calculateProfileColumnWidths: () => { [key: number]: number };
  calculateProfileRowHeights: () => { [key: number]: number };
  updateWidths: () => void;
  updateHeights: () => void;
  setCellWidth: (cellIndex: number, newWidth: number) => void;
  setCellHeight: (cellIndex: number, newHeight: number) => void;
  getTransomSizeLimits: () => SizeLimits;
  validateActiveTransom: () => void;
}