// TCO Calculator Types

// Vehicle Types
export interface EVVehicle {
  id: string;
  brand: string;
  series: string;
  variant: string;
  badge: string;
  battery: number;              // kWh
  maxRange: number;             // km
  consumptionKwhPer100km: number;
  price: number;                // IDR OTR
  otrLocation: 'jakarta' | 'tangsel' | 'bandung' | 'surabaya';
  warrantyYears: number;
  batteryWarrantyYears: number;
  batteryWarrantyKm: number;
  insuranceGroup: 'low' | 'medium' | 'high' | 'luxury';
}

export interface ICEVehicle {
  id: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;                // IDR OTR
  engineCc: number;
  fuelType: 'pertalite' | 'pertamax' | 'pertamax_turbo' | 'solar' | 'dexlite';
  fuelConsumptionKmPerLiter: number;
  insuranceGroup: 'low' | 'medium' | 'high' | 'luxury';
}

// Cost Configuration
export interface FuelPrice {
  type: 'pertalite' | 'pertamax' | 'pertamax_turbo' | 'solar' | 'dexlite';
  pricePerLiter: number;        // IDR
  updatedAt: string;
}

export interface ElectricityRate {
  category: 'pln_r1' | 'pln_r2' | 'pln_r3' | 'public_ac' | 'public_dc';
  name: string;
  ratePerKwh: number;           // IDR
  description: string;
}

export interface InsuranceRate {
  group: 'low' | 'medium' | 'high' | 'luxury';
  comprehensive: number;        // percentage (0.025 = 2.5%)
  tlo: number;                  // percentage
}

export interface MaintenanceSchedule {
  ev: {
    annualService: number;      // IDR
    perKmRate: number;          // IDR per km
    tireReplacement: number;    // IDR (every 4 years)
    brakePads: number;          // IDR (every 2 years)
  };
  ice: {
    annualService: number;      // IDR
    oilChangePerYear: number;   // IDR
    filterChanges: number;      // IDR per year
    tireReplacement: number;    // IDR (every 4 years)
    brakePads: number;          // IDR (every 2 years)
    timingBelt: number;         // IDR (every 60k km)
    batteryReplacement: number; // IDR (every 3 years)
  };
}

export interface DepreciationRate {
  year: number;
  ev: number;                   // percentage
  ice: number;                  // percentage
}

// User Inputs
export interface TCOInputs {
  // Vehicle Selection
  evVehicleId: string | null;
  iceVehicleId: string | null;
  
  // Usage Parameters
  annualKm: number;             // km per year
  ownershipYears: number;       // 3, 4, or 5 years
  
  // Energy Parameters
  electricityRateCategory: 'pln_r1' | 'pln_r2' | 'pln_r3' | 'public_ac' | 'public_dc';
  homeChargingPercentage: number; // 0-100
  publicChargingPercentage: number; // 0-100 (derived)
  
  // Financial Parameters
  insuranceType: 'comprehensive' | 'tlo';
  includeTax: boolean;
  region: 'jakarta' | 'tangsel' | 'bandung' | 'surabaya';
}

// Calculation Results
export interface YearlyCost {
  year: number;
  energy: number;
  maintenance: number;
  insurance: number;
  tax: number;
  depreciation: number;
  total: number;
  cumulative: number;
}

export interface TCOResult {
  ev: {
    vehicle: EVVehicle;
    initialPrice: number;
    residualValue: number;
    totalDepreciation: number;
    yearlyCosts: YearlyCost[];
    totalCost: number;
    costPerKm: number;
  };
  ice: {
    vehicle: ICEVehicle;
    initialPrice: number;
    residualValue: number;
    totalDepreciation: number;
    yearlyCosts: YearlyCost[];
    totalCost: number;
    costPerKm: number;
  };
  savings: {
    absolute: number;
    percentage: number;
    breakEvenYear: number | null;
  };
}

// Regional Tax Rates (PKB)
export interface RegionalTaxRate {
  region: string;
  rate: number;                 // percentage of vehicle value
  name: string;
}
