// Maintenance Cost Estimates (IDR)
// Based on market research and service center surveys

import type { MaintenanceSchedule } from '../types';

export const MAINTENANCE_COSTS: MaintenanceSchedule = {
  ev: {
    // EV maintenance is simpler - no oil changes, fewer moving parts
    annualService: 750000,        // Rp 750K per year (general inspection)
    perKmRate: 50,                // Rp 50 per km (tires, brake wear)
    tireReplacement: 8000000,     // Rp 8M every 4 years (average)
    brakePads: 750000,            // Rp 750K every 2 years (regenerative braking reduces wear)
  },
  ice: {
    // ICE maintenance is more complex
    annualService: 2250000,       // Rp 2.25M per year
    oilChangePerYear: 1500000,    // Rp 1.5M per year (3-4 changes)
    filterChanges: 500000,        // Rp 500K per year (air, oil, fuel filters)
    tireReplacement: 8000000,     // Rp 8M every 4 years
    brakePads: 1500000,           // Rp 1.5M every 2 years
    timingBelt: 3000000,          // Rp 3M every 60K km
    batteryReplacement: 1200000,  // Rp 1.2M every 3 years
  },
};

// Calculate annual maintenance based on km driven
export function calculateEVMaintenance(annualKm: number): number {
  const { annualService, perKmRate, tireReplacement, brakePads } = MAINTENANCE_COSTS.ev;
  
  const serviceCost = annualService;
  const wearCost = annualKm * perKmRate;
  const tireCost = tireReplacement / 4; // Spread over 4 years
  const brakeCost = brakePads / 2;       // Spread over 2 years
  
  return serviceCost + wearCost + tireCost + brakeCost;
}

export function calculateICEMaintenance(annualKm: number): number {
  const { 
    annualService, 
    oilChangePerYear, 
    filterChanges, 
    tireReplacement, 
    brakePads,
    timingBelt,
    batteryReplacement 
  } = MAINTENANCE_COSTS.ice;
  
  const serviceCost = annualService;
  const oilCost = oilChangePerYear;
  const filterCost = filterChanges;
  const tireCost = tireReplacement / 4;
  const brakeCost = brakePads / 2;
  const timingBeltCost = (annualKm / 60000) * timingBelt; // Proportional to km
  const batteryCost = batteryReplacement / 3;              // Spread over 3 years
  
  return serviceCost + oilCost + filterCost + tireCost + brakeCost + timingBeltCost + batteryCost;
}
