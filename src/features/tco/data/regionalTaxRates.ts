// Regional Tax Rates (PKB - Pajak Kendaraan Bermotor)
// Based on Indonesian regional regulations

import type { RegionalTaxRate } from '../types';

export const REGIONAL_TAX_RATES: RegionalTaxRate[] = [
  {
    region: 'jakarta',
    name: 'DKI Jakarta',
    rate: 0.02,  // 2% of vehicle value
  },
  {
    region: 'tangsel',
    name: 'Tangerang Selatan',
    rate: 0.02,  // 2% of vehicle value
  },
  {
    region: 'bandung',
    name: 'Bandung',
    rate: 0.015, // 1.5% of vehicle value
  },
  {
    region: 'surabaya',
    name: 'Surabaya',
    rate: 0.015, // 1.5% of vehicle value
  },
];

export function getRegionalTaxRate(region: RegionalTaxRate['region']): number {
  const tax = REGIONAL_TAX_RATES.find(t => t.region === region);
  return tax?.rate ?? 0.02; // Default to 2%
}

// Calculate annual tax (PKB + SWDKLLJ)
// SWDKLLJ = Sumbangan Wajib Dana Kecelakaan Lalu Lintas Jalan (~Rp 143K/year)
export function calculateAnnualTax(
  vehiclePrice: number,
  region: RegionalTaxRate['region']
): number {
  const taxRate = getRegionalTaxRate(region);
  const pkb = vehiclePrice * taxRate;
  const swdkllj = 143000; // Fixed amount
  
  return Math.round(pkb + swdkllj);
}

// Progressive tax for multiple vehicles (2nd vehicle +5%, 3rd +10%, etc.)
// For simplicity, we assume 1st vehicle (no progressive increase)
export function calculateAnnualTaxWithProgressive(
  vehiclePrice: number,
  region: RegionalTaxRate['region'],
  vehicleNumber: number = 1
): number {
  const baseTax = calculateAnnualTax(vehiclePrice, region);
  const progressiveMultiplier = 1 + ((vehicleNumber - 1) * 0.005); // +0.5% per additional vehicle
  
  return Math.round(baseTax * progressiveMultiplier);
}
