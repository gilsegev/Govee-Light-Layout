import { LayoutResult, LightPuck } from '../types';

export const MM_PER_INCH = 25.4;

export const toMm = (inches: number) => inches * MM_PER_INCH;
export const toInches = (mm: number) => mm / MM_PER_INCH;

export function createErrorResult(error: string): LayoutResult {
  return {
    pucks: [],
    totalLights: 0,
    coverageLength: 0,
    startGap: 0,
    endGap: 0,
    wireSlackAmount: 0,
    warnings: [],
    errors: [error]
  };
}