import { LayoutResult, LightPuck } from '../../types';
import { toInches } from './utils';
import { SPECS } from '../constants';

const MAX_STRING_LENGTH_MM = 5000;

export function calculateMaxDensity(runLengthMm: number, maxPitchMm: number): LayoutResult {
  const spacingMm = SPECS.MIN_SPACING_MM;
  const count = Math.floor(runLengthMm / spacingMm) + 1;
  const wireSlackMm = Math.max(0, maxPitchMm - spacingMm);

  const pucks: LightPuck[] = [];
  // Max density usually starts at 0 or minimal buffer? 
  // Previous logic used startBuffer. Let's assume 0 for pure density if not passed.
  const startOffset = 0; 
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
      xPosition: toInches(startOffset + (i * spacingMm)),
      type: 'standard',
      isVirtual: false,
      hasSlackWarning: true, // Always slack in max density
      hasConnector
    });
  }

  const lastPuckPos = pucks.length > 0 ? pucks[pucks.length - 1].xPosition : 0;

  return {
    pucks,
    totalLights: count,
    coverageLength: toInches((count - 1) * spacingMm),
    startGap: 0,
    endGap: toInches(runLengthMm) - lastPuckPos,
    wireSlackAmount: toInches(wireSlackMm),
    warnings: [],
    errors: []
  };
}