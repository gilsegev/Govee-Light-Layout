import { create } from 'zustand';
import { LayoutConfig, LayoutResult, PeakConfig } from '../types';
// Point explicitly to the index file to avoid conflict with legacy algorithms.ts file
import { calculateLayout } from '../lib/algorithms/index';

interface LayoutState {
  config: LayoutConfig;
  results: LayoutResult;

  // Actions
  updateConfig: (updates: Partial<LayoutConfig>) => void;
  updatePeakConfig: (updates: Partial<PeakConfig>) => void;
}

const INITIAL_CONFIG: LayoutConfig = {
  mode: 'straight',
  peakConfig: {
    leftLengthFt: 10,
    leftLengthIn: 0,
    rightLengthFt: 10,
    rightLengthIn: 0,
    apexMode: 'center',
    apexGap: 4,
  },
  runLengthFeet: 10,
  runLengthInches: 0,
  targetSpacing: 19.5, // User specified 19.5" 
  startBuffer: 4,
  endBuffer: 4,
  alignmentStrategy: 'centric',
};

export const useLayoutStore = create<LayoutState>((set, get) => ({
  config: INITIAL_CONFIG,

  // Initial calculation
  results: calculateLayout(INITIAL_CONFIG),

  updateConfig: (updates) => {
    set((state) => {
      const newConfig = { ...state.config, ...updates };
      const newResults = calculateLayout(newConfig);
      return { config: newConfig, results: newResults };
    });
  },

  updatePeakConfig: (updates) => {
    set((state) => {
      const newConfig = {
        ...state.config,
        peakConfig: { ...state.config.peakConfig, ...updates },
      };
      const newResults = calculateLayout(newConfig);
      return { config: newConfig, results: newResults };
    });
  },
}));