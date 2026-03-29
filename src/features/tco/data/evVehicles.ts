// EV Vehicle Database with TCO-specific data
// Synced with charging calculator data (src/features/calculator/data/carData.ts)
// This ensures consistency across both calculators

import type { EVVehicle } from '../types';
import { CARS, calculateConsumption, type CarData } from '../../../features/calculator/data/carData';

// Warranty data by brand (researched from official sources)
const BRAND_WARRANTY: Record<string, {
  vehicleYears: number;
  batteryYears: number;
  batteryKm: number;
}> = {
  // Wuling: 3 years vehicle, 8 years battery
  wuling: { vehicleYears: 3, batteryYears: 8, batteryKm: 150000 },
  // BYD: 6 years vehicle, 8 years battery
  byd: { vehicleYears: 6, batteryYears: 8, batteryKm: 160000 },
  // GAC Aion: 5 years vehicle, 8 years battery
  gac: { vehicleYears: 5, batteryYears: 8, batteryKm: 200000 },
  // Hyundai: 5 years vehicle, 10 years battery
  hyundai: { vehicleYears: 5, batteryYears: 10, batteryKm: 200000 },
  // KIA: 5 years vehicle, 10 years battery
  kia: { vehicleYears: 5, batteryYears: 10, batteryKm: 200000 },
  // Toyota: 5 years vehicle, 10 years battery
  toyota: { vehicleYears: 5, batteryYears: 10, batteryKm: 200000 },
  // BMW: 5 years vehicle, 8 years battery
  bmw: { vehicleYears: 5, batteryYears: 8, batteryKm: 160000 },
  // Mercedes: 4 years vehicle, 8 years battery
  mercedes: { vehicleYears: 4, batteryYears: 8, batteryKm: 160000 },
  // Lexus: 4 years vehicle, 8 years battery
  lexus: { vehicleYears: 4, batteryYears: 8, batteryKm: 160000 },
  // Volvo: 5 years vehicle, 8 years battery
  volvo: { vehicleYears: 5, batteryYears: 8, batteryKm: 160000 },
  // VinFast: 5 years vehicle, 10 years battery
  vinfast: { vehicleYears: 5, batteryYears: 10, batteryKm: 200000 },
  // MG: 5 years vehicle, 7 years battery
  mg: { vehicleYears: 5, batteryYears: 7, batteryKm: 140000 },
  // Nissan: 3 years vehicle, 8 years battery
  nissan: { vehicleYears: 3, batteryYears: 8, batteryKm: 160000 },
  // Chery: 5 years vehicle, 8 years battery
  chery: { vehicleYears: 5, batteryYears: 8, batteryKm: 160000 },
  // Denza: 5 years vehicle, 8 years battery
  denza: { vehicleYears: 5, batteryYears: 8, batteryKm: 160000 },
  // Geely: 5 years vehicle, 8 years battery
  geely: { vehicleYears: 5, batteryYears: 8, batteryKm: 160000 },
  // Neta: 5 years vehicle, 8 years battery
  neta: { vehicleYears: 5, batteryYears: 8, batteryKm: 150000 },
  // MINI: 4 years vehicle, 8 years battery
  mini: { vehicleYears: 4, batteryYears: 8, batteryKm: 160000 },
};

// Default warranty for unknown brands
const DEFAULT_WARRANTY = { vehicleYears: 3, batteryYears: 8, batteryKm: 150000 };

// Map CarData to EVVehicle with TCO-specific fields
function mapCarToEVVehicle(car: CarData): EVVehicle {
  const warranty = BRAND_WARRANTY[car.brand] ?? DEFAULT_WARRANTY;
  
  return {
    id: car.id,
    brand: car.brand === 'gac' ? 'GAC Aion' :
           car.brand === 'byd' ? 'BYD' :
           car.brand === 'bmw' ? 'BMW' :
           car.brand === 'chery' ? 'Chery' :
           car.brand === 'denza' ? 'Denza' :
           car.brand === 'geely' ? 'Geely' :
           car.brand === 'hyundai' ? 'Hyundai' :
           car.brand === 'kia' ? 'KIA' :
           car.brand === 'lexus' ? 'Lexus' :
           car.brand === 'mercedes' ? 'Mercedes-Benz' :
           car.brand === 'mg' ? 'MG' :
           car.brand === 'mini' ? 'MINI' :
           car.brand === 'neta' ? 'Neta' :
           car.brand === 'nissan' ? 'Nissan' :
           car.brand === 'toyota' ? 'Toyota' :
           car.brand === 'vinfast' ? 'VinFast' :
           car.brand === 'volvo' ? 'Volvo' :
           car.brand === 'wuling' ? 'Wuling' : car.brand,
    series: car.series,
    variant: car.variant,
    badge: car.badge,
    battery: car.battery,
    maxRange: car.maxRange,
    consumptionKwhPer100km: car.consumptionKwhPer100km ?? calculateConsumption(car.battery, car.maxRange),
    price: car.price ?? 0,
    otrLocation: 'jakarta',
    warrantyYears: warranty.vehicleYears,
    batteryWarrantyYears: warranty.batteryYears,
    batteryWarrantyKm: warranty.batteryKm,
    insuranceGroup: car.insuranceGroup ?? 'medium',
  };
}

// Generate EV_VEHICLES from shared carData
export const EV_VEHICLES: EVVehicle[] = CARS.map(mapCarToEVVehicle);

// Helper functions
export function getEVVehicleById(id: string): EVVehicle | undefined {
  return EV_VEHICLES.find(v => v.id === id);
}

export function getEVVehiclesByBrand(brand: string): EVVehicle[] {
  return EV_VEHICLES.filter(v => 
    v.brand.toLowerCase() === brand.toLowerCase()
  );
}

export function getAllEVBrands(): string[] {
  const brands = new Set(EV_VEHICLES.map(v => v.brand));
  return Array.from(brands).sort();
}

// Group vehicles by price range
export function getEVVehiclesByPriceRange(
  min: number,
  max: number
): EVVehicle[] {
  return EV_VEHICLES.filter(v => v.price >= min && v.price <= max);
}

// Import ICE vehicles for comparison
import { ICE_VEHICLES } from './iceVehicles';
import type { ICEVehicle } from '../types';

// Find comparable ICE vehicle by price range
export function findComparableICE(
  evPrice: number,
  tolerance: number = 0.15  // 15% price difference
): ICEVehicle | undefined {
  const minPrice = evPrice * (1 - tolerance);
  const maxPrice = evPrice * (1 + tolerance);
  
  return ICE_VEHICLES.find(
    (ice) => ice.price >= minPrice && ice.price <= maxPrice
  );
}
