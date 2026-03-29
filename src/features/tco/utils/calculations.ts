// TCO Calculation Utilities
// Pure functions for calculating Total Cost of Ownership

import type { EVVehicle, ICEVehicle, YearlyCost, TCOResult } from '../types';
import { getFuelPrice } from '../data/fuelPrices';
import { getElectricityRate } from '../data/electricityRates';
import { getInsuranceRate, calculateInsuranceWithNCB } from '../data/insuranceRates';
import { calculateEVMaintenance, calculateICEMaintenance } from '../data/maintenanceCosts';
import { calculateResidualValue, calculateYearDepreciation } from '../data/depreciationRates';
import { calculateAnnualTax } from '../data/regionalTaxRates';

interface CalculateTCOParams {
  ev: EVVehicle;
  ice: ICEVehicle;
  annualKm: number;
  ownershipYears: number;
  electricityRateCategory: 'pln_r1' | 'pln_r2' | 'pln_r3' | 'public_ac' | 'public_dc';
  homeChargingPercentage: number;
  insuranceType: 'comprehensive' | 'tlo';
  includeTax: boolean;
  region: 'jakarta' | 'tangsel' | 'bandung' | 'surabaya';
}

// Calculate EV energy cost
function calculateEVEnergyCost(
  annualKm: number,
  consumptionKwhPer100km: number,
  electricityRateCategory: CalculateTCOParams['electricityRateCategory'],
  homeChargingPercentage: number
): number {
  const electricityRate = getElectricityRate(electricityRateCategory);
  const annualKwh = (annualKm / 100) * consumptionKwhPer100km;
  
  // If using mixed charging, adjust rate
  // Home charging is cheaper, public is more expensive
  if (homeChargingPercentage < 100) {
    const publicRate = getElectricityRate('public_dc');
    const homeRate = electricityRate;
    const publicPercentage = 100 - homeChargingPercentage;
    
    const blendedRate = (homeRate * (homeChargingPercentage / 100)) + 
                       (publicRate * (publicPercentage / 100));
    
    return Math.round(annualKwh * blendedRate);
  }
  
  return Math.round(annualKwh * electricityRate);
}

// Calculate ICE fuel cost
function calculateICEFuelCost(
  annualKm: number,
  fuelConsumptionKmPerLiter: number,
  fuelType: ICEVehicle['fuelType']
): number {
  const fuelPrice = getFuelPrice(fuelType);
  const annualLiters = annualKm / fuelConsumptionKmPerLiter;
  return Math.round(annualLiters * fuelPrice);
}

// Calculate EV yearly costs
function calculateEVYearlyCosts(
  vehicle: EVVehicle,
  params: Omit<CalculateTCOParams, 'ev' | 'ice'>
): YearlyCost[] {
  const yearlyCosts: YearlyCost[] = [];
  const insuranceRate = getInsuranceRate(vehicle.insuranceGroup, params.insuranceType);
  
  let currentValue = vehicle.price;
  let cumulative = 0;
  
  for (let year = 1; year <= params.ownershipYears; year++) {
    // Energy cost
    const energy = calculateEVEnergyCost(
      params.annualKm,
      vehicle.consumptionKwhPer100km,
      params.electricityRateCategory,
      params.homeChargingPercentage
    );
    
    // Maintenance
    const maintenance = calculateEVMaintenance(params.annualKm);
    
    // Insurance (with NCB discount)
    const insurance = calculateInsuranceWithNCB(
      vehicle.price,
      insuranceRate,
      year
    );
    
    // Tax
    const tax = params.includeTax ? calculateAnnualTax(vehicle.price, params.region) : 0;
    
    // Depreciation
    const depreciation = calculateYearDepreciation(currentValue, 'ev', year);
    
    const total = energy + maintenance + insurance + tax + depreciation;
    cumulative += total;
    
    yearlyCosts.push({
      year,
      energy,
      maintenance,
      insurance,
      tax,
      depreciation,
      total,
      cumulative,
    });
    
    currentValue -= depreciation;
  }
  
  return yearlyCosts;
}

// Calculate ICE yearly costs
function calculateICEYearlyCosts(
  vehicle: ICEVehicle,
  params: Omit<CalculateTCOParams, 'ev' | 'ice'>
): YearlyCost[] {
  const yearlyCosts: YearlyCost[] = [];
  const insuranceRate = getInsuranceRate(vehicle.insuranceGroup, params.insuranceType);
  
  let currentValue = vehicle.price;
  let cumulative = 0;
  
  for (let year = 1; year <= params.ownershipYears; year++) {
    // Energy cost
    const energy = calculateICEFuelCost(
      params.annualKm,
      vehicle.fuelConsumptionKmPerLiter,
      vehicle.fuelType
    );
    
    // Maintenance
    const maintenance = calculateICEMaintenance(params.annualKm);
    
    // Insurance (with NCB discount)
    const insurance = calculateInsuranceWithNCB(
      vehicle.price,
      insuranceRate,
      year
    );
    
    // Tax
    const tax = params.includeTax ? calculateAnnualTax(vehicle.price, params.region) : 0;
    
    // Depreciation
    const depreciation = calculateYearDepreciation(currentValue, 'ice', year);
    
    const total = energy + maintenance + insurance + tax + depreciation;
    cumulative += total;
    
    yearlyCosts.push({
      year,
      energy,
      maintenance,
      insurance,
      tax,
      depreciation,
      total,
      cumulative,
    });
    
    currentValue -= depreciation;
  }
  
  return yearlyCosts;
}

// Main TCO calculation function
export function calculateTCO(params: CalculateTCOParams): TCOResult {
  const { ev, ice } = params;
  
  // Calculate yearly costs for both vehicles
  const evYearlyCosts = calculateEVYearlyCosts(ev, params);
  const iceYearlyCosts = calculateICEYearlyCosts(ice, params);
  
  // Calculate totals
  const evTotalCost = evYearlyCosts[evYearlyCosts.length - 1].cumulative;
  const iceTotalCost = iceYearlyCosts[iceYearlyCosts.length - 1].cumulative;
  
  // Calculate residual values
  const evResidualValue = calculateResidualValue(ev.price, 'ev', params.ownershipYears);
  const iceResidualValue = calculateResidualValue(ice.price, 'ice', params.ownershipYears);
  
  // Calculate savings
  const savings = iceTotalCost - evTotalCost;
  const savingsPercentage = (savings / iceTotalCost) * 100;
  
  // Find break-even year (if EV becomes cheaper)
  let breakEvenYear: number | null = null;
  for (let i = 0; i < evYearlyCosts.length; i++) {
    if (evYearlyCosts[i].cumulative < iceYearlyCosts[i].cumulative) {
      breakEvenYear = evYearlyCosts[i].year;
      break;
    }
  }
  
  // Calculate cost per km
  const totalKm = params.annualKm * params.ownershipYears;
  
  return {
    ev: {
      vehicle: ev,
      initialPrice: ev.price,
      residualValue: evResidualValue,
      totalDepreciation: ev.price - evResidualValue,
      yearlyCosts: evYearlyCosts,
      totalCost: evTotalCost,
      costPerKm: Math.round(evTotalCost / totalKm),
    },
    ice: {
      vehicle: ice,
      initialPrice: ice.price,
      residualValue: iceResidualValue,
      totalDepreciation: ice.price - iceResidualValue,
      yearlyCosts: iceYearlyCosts,
      totalCost: iceTotalCost,
      costPerKm: Math.round(iceTotalCost / totalKm),
    },
    savings: {
      absolute: Math.round(savings),
      percentage: Math.round(savingsPercentage * 100) / 100,
      breakEvenYear,
    },
    inputs: {
      annualKm: params.annualKm,
      ownershipYears: params.ownershipYears,
    },
  };
}

// Format currency
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with suffix (jt, M, etc.)
export function formatCompactNumber(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} M`;
  }
  if (amount >= 1_000_000) {
    return `${Math.round(amount / 1_000_000)} jt`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}K`;
  }
  return amount.toString();
}

// Get category totals for chart data
export function getCategoryTotals(yearlyCosts: YearlyCost[]) {
  return yearlyCosts.reduce(
    (acc, year) => ({
      energy: acc.energy + year.energy,
      maintenance: acc.maintenance + year.maintenance,
      insurance: acc.insurance + year.insurance,
      tax: acc.tax + year.tax,
      depreciation: acc.depreciation + year.depreciation,
    }),
    { energy: 0, maintenance: 0, insurance: 0, tax: 0, depreciation: 0 }
  );
}
