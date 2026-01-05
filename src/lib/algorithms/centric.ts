import { LayoutResult, LightPuck } from '../../types';
import { toInches, createErrorResult } from './utils';
import { SPECS } from '../constants';

const MAX_STRING_LENGTH_MM = 5000;

export function calculateCentricLayout(effectiveRunMm: number, spacingMm: number, maxPitchMm: number, startBufferMm: number, totalRunMm: number): LayoutResult {
  const count = Math.floor(effectiveRunMm / spacingMm) + 1;
    
  if (count <= 0) {
    return createErrorResult("No lights fit in the available space.");
  }

  const arrayWidthMm = (count - 1) * spacingMm;
  const remainderMm = effectiveRunMm - arrayWidthMm;
  const internalGapMm = remainderMm / 2;
  const actualStartGapMm = startBufferMm + internalGapMm;
  const wireSlackMm = Math.max(0, maxPitchMm - spacingMm);

  const pucks: LightPuck[] = [];
  let currentStringLength = 0;

  for (let i = 0; i < count; i++) {
    let hasConnector = false;

    if (i > 0) {
      currentStringLength += spacingMm;
      if (currentStringLength > MAX_STRING_LENGTH_MM) {
        hasConnector = true;
        currentStringLength = 0;
      }
    }

    pucks.push({
      id: `puck-${i}`,
      index: i,
      xPosition: toInches(actualStartGapMm + (i * spacingMm)),
      type: 'standard',
      isVirtual: false,
      hasSlackWarning: wireSlackMm > 10,
      hasConnector
    });
  }

  const lastPuckPosMm = actualStartGapMm + arrayWidthMm;
  const actualEndGapMm = totalRunMm - lastPuckPosMm;

  return {
    pucks,
    totalLights: count,
    coverageLength: toInches(arrayWidthMm),
    startGap: toInches(actualStartGapMm),
    endGap: toInches(actualEndGapMm),
    wireSlackAmount: toInches(wireSlackMm),
    warnings: [],
    errors: []
  };
}