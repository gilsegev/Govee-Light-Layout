import { LayoutConfig, LayoutResult, LightPuck, PeakConfig } from '../../types';
import { SPECS } from '../constants';

const MM_PER_INCH = 25.4;
const MAX_STRING_LENGTH_MM = 5000; // ~16.4 ft per string segment

const toMm = (inches: number) => inches * MM_PER_INCH;
const toInches = (mm: number) => mm / MM_PER_INCH;

export function calculatePeakLayout(config: LayoutConfig): LayoutResult {
  const { peakConfig, targetSpacing } = config;
  const spacingMm = toMm(targetSpacing);
  
  // Clamp spacing
  let actualSpacingMm = spacingMm;
  const warnings: string[] = [];
  
  if (actualSpacingMm > SPECS.MAX_WIRE_LENGTH_MM) {
    actualSpacingMm = SPECS.MAX_WIRE_LENGTH_MM;
    warnings.push(`Spacing capped at max wire length (${toInches(SPECS.MAX_WIRE_LENGTH_MM).toFixed(2)}")`);
  }
  if (actualSpacingMm < SPECS.MIN_SPACING_MM) {
    actualSpacingMm = SPECS.MIN_SPACING_MM;
    warnings.push(`Spacing increased to minimum safe distance (${toInches(SPECS.MIN_SPACING_MM).toFixed(2)}")`);
  }

  const wireSlackMm = Math.max(0, SPECS.MAX_WIRE_LENGTH_MM - actualSpacingMm);

  // Calculate Arms
  const leftResult = calculateArm(
    peakConfig.leftLengthFt, 
    peakConfig.leftLengthIn, 
    peakConfig, 
    actualSpacingMm, 
    'left'
  );

  const rightResult = calculateArm(
    peakConfig.rightLengthFt, 
    peakConfig.rightLengthIn, 
    peakConfig, 
    actualSpacingMm, 
    'right'
  );

  // Combine Results for Flat View
  const allPucks = [...leftResult.pucks, ...rightResult.pucks].sort((a, b) => a.xPosition - b.xPosition);

  const totalCoverageMm = (toMm(peakConfig.leftLengthFt * 12 + peakConfig.leftLengthIn)) + 
                           (toMm(peakConfig.rightLengthFt * 12 + peakConfig.rightLengthIn));

  return {
    pucks: allPucks,
    totalLights: allPucks.length,
    coverageLength: toInches(totalCoverageMm),
    startGap: toInches(leftResult.endGapMm), 
    endGap: toInches(rightResult.endGapMm),
    wireSlackAmount: wireSlackMm, 
    warnings,
    errors: [],
    peakData: {
      leftPucks: leftResult.pucks,
      rightPucks: rightResult.pucks,
    },
    connectors: [] 
  };
}

interface ArmResult {
  pucks: LightPuck[];
  endGapMm: number;
}

function calculateArm(
  feet: number, 
  inches: number, 
  config: PeakConfig, 
  spacingMm: number, 
  side: 'left' | 'right'
): ArmResult {
  const totalLengthMm = toMm(feet * 12 + inches);
  const pucks: LightPuck[] = [];
  
  let currentPosMm = 0;
  
  // Determine start position based on Apex Mode
  if (config.apexMode === 'center') {
    if (side === 'right') {
      currentPosMm = 0;
    } else {
      currentPosMm = spacingMm; 
    }
  } else {
    // Split mode
    const gapMm = toMm(config.apexGap);
    currentPosMm = gapMm / 2;
  }

  let index = 0;
  let currentStringLength = 0; 
  let nextPuckHasConnector = false;

  // Relaxed constraint: Allow puck center to reach the very edge of the run.
  // Added small epsilon (1mm) to handle floating point inaccuracies.
  while (currentPosMm <= totalLengthMm + 1) {
    if (index > 0) {
      currentStringLength += spacingMm;
      if (currentStringLength > MAX_STRING_LENGTH_MM) {
        nextPuckHasConnector = true;
        currentStringLength = 0; 
      }
    }

    const xPosInches = toInches(currentPosMm) * (side === 'left' ? -1 : 1);
    
    pucks.push({
      id: `${side}-${index}`,
      index: index, 
      xPosition: xPosInches,
      type: 'standard',
      isVirtual: false,
      hasSlackWarning: false, 
      hasConnector: nextPuckHasConnector
    });
    
    nextPuckHasConnector = false;
    currentPosMm += spacingMm;
    index++;
  }

  const lastPuckPosMm = pucks.length > 0 ? (currentPosMm - spacingMm) : 0;
  const endGapMm = pucks.length > 0 ? (totalLengthMm - lastPuckPosMm) : totalLengthMm;

  return { pucks, endGapMm };
}