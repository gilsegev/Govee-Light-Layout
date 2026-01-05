export type AlignmentMode = 'centric' | 'start-biased' | 'end-biased' | 'max-density';
export type LayoutMode = 'straight' | 'peak';

export interface PeakConfig {
  leftLengthFt: number;
  leftLengthIn: number;
  rightLengthFt: number;
  rightLengthIn: number;
  apexMode: 'center' | 'split';
  apexGap: number;
}

export interface LayoutConfig {
  mode: LayoutMode;
  peakConfig: PeakConfig;
  runLengthFeet: number;
  runLengthInches: number;
  targetSpacing: number;
  startBuffer: number;
  endBuffer: number;
  alignmentStrategy: AlignmentMode;
}

export interface LightPuck {
  id: string;
  index: number;
  xPosition: number;
  type: 'standard' | 'ghost';
  isVirtual: boolean;
  hasSlackWarning: boolean;
  hasConnector: boolean;
}

export interface LayoutResult {
  pucks: LightPuck[];
  totalLights: number;
  coverageLength: number;
  startGap: number;
  endGap: number;
  wireSlackAmount: number;
  warnings: string[];
  errors: string[];
  peakData?: {
    leftPucks: LightPuck[];
    rightPucks: LightPuck[];
  };
  connectors?: number[];
}