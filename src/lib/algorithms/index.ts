import { LayoutConfig, LayoutResult } from '../../types';
import { calculateCentricLayout } from './centric';
import { calculateBiasedLayout } from './biased';
import { calculateMaxDensity } from './maxDensity';
import { calculatePeakLayout } from './peak';
import { createErrorResult } from './utils';

export function calculateLayout(config: LayoutConfig): LayoutResult {
  // 1. Peak Mode
  if (config.mode === 'peak') {
    return calculatePeakLayout(config);
  }

  // 2. Straight Mode
  const runLengthMm = ((config.runLengthFeet * 12) + config.runLengthInches) * 25.4;
  const targetSpacingMm = Math.max(1, config.targetSpacing * 25.4);
  const startBufferMm = config.startBuffer * 25.4; 
  const endBufferMm = config.endBuffer * 25.4;
  const MAX_PITCH_MM = 500;

  // Calculate effective run length (Total - Buffers)
  const effectiveRunMm = runLengthMm - startBufferMm - endBufferMm;

  if (effectiveRunMm <= 0) {
    return createErrorResult("Run length is too short for the specified buffers.");
  }

  switch (config.alignmentStrategy) {
    case 'start-biased':
      // Biased uses the effective run to determine count, but positions relative to startBuffer
      return calculateBiasedLayout(runLengthMm - endBufferMm, targetSpacingMm, MAX_PITCH_MM, startBufferMm);
    case 'max-density':
      // Max density fills the effective space
      return calculateMaxDensity(effectiveRunMm, MAX_PITCH_MM);
    case 'centric':
    default:
      // Centric centers within the effective space
      return calculateCentricLayout(effectiveRunMm, targetSpacingMm, MAX_PITCH_MM, startBufferMm, runLengthMm);
  }
}