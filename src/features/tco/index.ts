// TCO Calculator Feature Exports

export { useTCOCalculator } from './hooks/useTCOCalculator';

export { VehicleSelector } from './components/VehicleSelector';
export { UsageInput } from './components/UsageInput';
export { CostParameters } from './components/CostParameters';
export { ComparisonChart } from './components/ComparisonChart';
export { CostBreakdown } from './components/CostBreakdown';
export { SavingsSummary } from './components/SavingsSummary';
export { EmptyState } from './components/EmptyState';
export { LoadingState } from './components/LoadingState';

export { calculateTCO, formatRupiah, formatCompactNumber, getCategoryTotals } from './utils/calculations';

export { EV_VEHICLES, getEVVehicleById, getEVVehiclesByBrand, getAllEVBrands, getEVVehiclesByPriceRange } from './data/evVehicles';
export { ICE_VEHICLES, getICEVehicleById, getICEVehiclesByBrand, getAllICEBrands, getICEVehiclesByPriceRange } from './data/iceVehicles';
export { FUEL_PRICES, getFuelPrice, getFuelPriceDisplayName } from './data/fuelPrices';
export { ELECTRICITY_RATES, getElectricityRate } from './data/electricityRates';
export { INSURANCE_RATES, getInsuranceRate, calculateInsuranceWithNCB } from './data/insuranceRates';
export { MAINTENANCE_COSTS, calculateEVMaintenance, calculateICEMaintenance } from './data/maintenanceCosts';
export { DEPRECIATION_RATES, calculateResidualValue, calculateYearDepreciation } from './data/depreciationRates';
export { REGIONAL_TAX_RATES, getRegionalTaxRate, calculateAnnualTax, calculateAnnualTaxWithProgressive } from './data/regionalTaxRates';

export type {
  EVVehicle,
  ICEVehicle,
  FuelPrice,
  ElectricityRate,
  InsuranceRate,
  MaintenanceSchedule,
  DepreciationRate,
  RegionalTaxRate,
  TCOInputs,
  YearlyCost,
  TCOResult,
} from './types';
