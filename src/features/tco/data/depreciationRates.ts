// Vehicle Depreciation Rates
// Based on Indonesian used car market data (OLX, OTO, etc.)

import type { DepreciationRate } from '../types';

// EV depreciates faster initially due to battery concerns and tech advancement
// ICE holds value better initially but depreciates steadily
export const DEPRECIATION_RATES: DepreciationRate[] = [
  { year: 1, ev: 0.20, ice: 0.15 },  // Year 1: EV -20%, ICE -15%
  { year: 2, ev: 0.15, ice: 0.12 },  // Year 2: EV -15%, ICE -12%
  { year: 3, ev: 0.12, ice: 0.10 },  // Year 3: EV -12%, ICE -10%
  { year: 4, ev: 0.10, ice: 0.08 },  // Year 4: EV -10%, ICE -8%
  { year: 5, ev: 0.08, ice: 0.07 },  // Year 5: EV -8%, ICE -7%
];

// Calculate residual value after N years
export function calculateResidualValue(
  initialPrice: number,
  vehicleType: 'ev' | 'ice',
  years: number
): number {
  let value = initialPrice;
  
  for (let year = 1; year <= years; year++) {
    const rate = DEPRECIATION_RATES.find(r => r.year === year);
    if (rate) {
      const depreciationRate = vehicleType === 'ev' ? rate.ev : rate.ice;
      value = value * (1 - depreciationRate);
    }
  }
  
  return Math.round(value);
}

// Calculate depreciation for a specific year
export function calculateYearDepreciation(
  currentValue: number,
  vehicleType: 'ev' | 'ice',
  year: number
): number {
  const rate = DEPRECIATION_RATES.find(r => r.year === year);
  if (!rate) return 0;
  
  const depreciationRate = vehicleType === 'ev' ? rate.ev : rate.ice;
  return Math.round(currentValue * depreciationRate);
}
