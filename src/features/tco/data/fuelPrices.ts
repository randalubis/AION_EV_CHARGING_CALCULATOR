// Fuel Prices in Indonesia (IDR per liter)
// Last updated: March 2025
// Source: Pertamina & market rates

import type { FuelPrice } from '../types';

export const FUEL_PRICES: FuelPrice[] = [
  {
    type: 'pertalite',
    pricePerLiter: 10000,
    updatedAt: '2025-03-01',
  },
  {
    type: 'pertamax',
    pricePerLiter: 12500,
    updatedAt: '2025-03-01',
  },
  {
    type: 'pertamax_turbo',
    pricePerLiter: 13500,
    updatedAt: '2025-03-01',
  },
  {
    type: 'solar',
    pricePerLiter: 6800,
    updatedAt: '2025-03-01',
  },
  {
    type: 'dexlite',
    pricePerLiter: 13350,
    updatedAt: '2025-03-01',
  },
];

export function getFuelPrice(type: FuelPrice['type']): number {
  const fuel = FUEL_PRICES.find(f => f.type === type);
  return fuel?.pricePerLiter ?? 10000; // Default to Pertalite
}

export function getFuelPriceDisplayName(type: FuelPrice['type']): string {
  const names: Record<FuelPrice['type'], string> = {
    'pertalite': 'Pertalite (90)',
    'pertamax': 'Pertamax (92)',
    'pertamax_turbo': 'Pertamax Turbo (98)',
    'solar': 'Solar',
    'dexlite': 'Dexlite',
  };
  return names[type] || type;
}
