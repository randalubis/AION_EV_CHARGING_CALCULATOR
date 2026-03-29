// Electricity Rates in Indonesia (IDR per kWh)
// Source: PLN Tarif Dasar Listrik 2025

import type { ElectricityRate } from '../types';

export const ELECTRICITY_RATES: ElectricityRate[] = [
  {
    category: 'pln_r1',
    name: 'PLN R1 (≤2.200 VA)',
    ratePerKwh: 1444,
    description: 'Rumah tangga daya ≤ 2.200 VA (termasuk 1.300 VA)',
  },
  {
    category: 'pln_r2',
    name: 'PLN R2 (3.500-5.500 VA)',
    ratePerKwh: 1695,
    description: 'Rumah tangga daya 3.500 VA sampai 5.500 VA',
  },
  {
    category: 'pln_r3',
    name: 'PLN R3 (>6.600 VA)',
    ratePerKwh: 1444,
    description: 'Rumah tangga daya > 6.600 VA',
  },
  {
    category: 'public_ac',
    name: 'SPKLU AC (Public)',
    ratePerKwh: 3000,
    description: 'Stasiun pengisian umum AC - rata-rata',
  },
  {
    category: 'public_dc',
    name: 'SPKLU DC (Public)',
    ratePerKwh: 4500,
    description: 'Stasiun pengisian umum DC Fast Charging - rata-rata',
  },
];

export function getElectricityRate(category: ElectricityRate['category']): number {
  const rate = ELECTRICITY_RATES.find(r => r.category === category);
  return rate?.ratePerKwh ?? 1444; // Default to PLN R1
}
