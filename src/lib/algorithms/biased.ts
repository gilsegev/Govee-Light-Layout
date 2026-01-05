import { LayoutResult, LightPuck } from '../../types';
import { toInches } from './utils';

const MAX_STRING_LENGTH_MM = 5000;

export function calculateBiasedLayout(runLengthMm: number, spacingMm: number, maxPitchMm: number, startBufferMm: number): LayoutResult {
  // Effective run for calculation:
  // We start at startBufferMm.
  // We fit as many as possible until we hit runLengthMm (minus end buffer? index.ts didn't pass end buffer).
  // Let's assume runLengthMm is the hard stop.

  const availableMm = runLengthMm - startBufferMm;
  const count = Math.floor(availableMm / spacingMm) + 1;
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
      xPosition: toInches(startBufferMm + (i * spacingMm)),
      type: 'standard',
      isVirtual: false,
      hasSlackWarning: wireSlackMm > 10,
      hasConnector
    });
  }

  const lastPuckPos = pucks.length > 0 ? pucks[pucks.length - 1].xPosition : 0;
  const coverageLength = pucks.length > 1 ? (pucks.length - 1) * toInches(spacingMm) : 0;

  return {
    pucks,
    totalLights: count,
    coverageLength: coverageLength,
    startGap: toInches(startBufferMm),
    endGap: toInches(runLengthMm) - lastPuckPos,
    wireSlackAmount: toInches(wireSlackMm),
    warnings: [],
    errors: []
  };
}