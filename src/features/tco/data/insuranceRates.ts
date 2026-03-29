// Insurance Rates (percentage of vehicle price per year)
// Based on Indonesian all-risk and TLO insurance market rates

import type { InsuranceRate } from '../types';

export const INSURANCE_RATES: InsuranceRate[] = [
  {
    group: 'low',
    comprehensive: 0.025,  // 2.5%
    tlo: 0.005,            // 0.5%
  },
  {
    group: 'medium',
    comprehensive: 0.022,  // 2.2%
    tlo: 0.004,            // 0.4%
  },
  {
    group: 'high',
    comprehensive: 0.020,  // 2.0%
    tlo: 0.0035,           // 0.35%
  },
  {
    group: 'luxury',
    comprehensive: 0.018,  // 1.8%
    tlo: 0.003,            // 0.3%
  },
];

export function getInsuranceRate(
  group: InsuranceRate['group'],
  type: 'comprehensive' | 'tlo'
): number {
  const rate = INSURANCE_RATES.find(r => r.group === group);
  return rate?.[type] ?? 0.025; // Default to 2.5%
}

// Calculate insurance with NCB (No Claim Bonus) discount
// Year 1: 100%, Year 2: 90%, Year 3: 80%, Year 4+: 75%
export function calculateInsuranceWithNCB(
  vehiclePrice: number,
  baseRate: number,
  year: number
): number {
  const ncbMultiplier = year === 1 ? 1 : year === 2 ? 0.9 : year === 3 ? 0.8 : 0.75;
  return vehiclePrice * baseRate * ncbMultiplier;
}
