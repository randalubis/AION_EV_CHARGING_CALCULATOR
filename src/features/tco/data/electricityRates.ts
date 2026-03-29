// Electricity Rates in Indonesia (IDR per kWh)
// Source: PLN Tarif Dasar Listrik 2025
// Synced with charging calculator data

import type { ElectricityRate } from '../types';

export const ELECTRICITY_RATES: ElectricityRate[] = [
  {
    category: 'pln_r1',
    name: 'PLN R1',
    ratePerKwh: 1444,
    description: 'Rumah tangga daya ≤ 3.500 VA',
  },
  {
    category: 'pln_r2',
    name: 'PLN R2',
    ratePerKwh: 2076,
    description: 'Rumah tangga daya 3.500–6.600 VA',
  },
  {
    category: 'pln_r3',
    name: 'PLN R3',
    ratePerKwh: 2654,
    description: 'Rumah tangga daya > 6.600 VA',
  },
  {
    category: 'public',
    name: 'SPKLU (Public)',
    ratePerKwh: 3000,
    description: 'Perkiraan tarif SPKLU publik (AC & DC)',
  },
];

export function getElectricityRate(category: ElectricityRate['category']): number {
  const rate = ELECTRICITY_RATES.find(r => r.category === category);
  return rate?.ratePerKwh ?? 1444; // Default to PLN R1
}
