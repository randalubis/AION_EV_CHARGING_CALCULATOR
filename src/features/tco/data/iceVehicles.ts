// ICE (Internal Combustion Engine) Vehicle Database
// Popular vehicles in Indonesia for comparison

import type { ICEVehicle } from '../types';

export const ICE_VEHICLES: ICEVehicle[] = [
  // Compact Cars (< 400 juta)
  {
    id: 'toyota_agya_g',
    brand: 'Toyota',
    model: 'Agya',
    variant: '1.2 G',
    year: 2025,
    price: 176000000,
    engineCc: 1197,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 20,
    insuranceGroup: 'low',
  },
  {
    id: 'daihatsu_ayla_r',
    brand: 'Daihatsu',
    model: 'Ayla',
    variant: '1.2 R',
    year: 2025,
    price: 169000000,
    engineCc: 1198,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 21,
    insuranceGroup: 'low',
  },
  {
    id: 'honda_brio_rs',
    brand: 'Honda',
    model: 'Brio',
    variant: 'RS',
    year: 2025,
    price: 251000000,
    engineCc: 1199,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 19,
    insuranceGroup: 'low',
  },
  {
    id: 'toyota_yaris_gr_sport',
    brand: 'Toyota',
    model: 'Yaris',
    variant: 'GR Sport',
    year: 2025,
    price: 325000000,
    engineCc: 1496,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 18,
    insuranceGroup: 'medium',
  },
  {
    id: 'honda_jazz_rs',
    brand: 'Honda',
    model: 'Jazz',
    variant: 'RS',
    year: 2025,
    price: 306000000,
    engineCc: 1497,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 18,
    insuranceGroup: 'medium',
  },
  
  // Sedan (400-600 juta)
  {
    id: 'toyota_vios_g',
    brand: 'Toyota',
    model: 'Vios',
    variant: 'G',
    year: 2025,
    price: 362000000,
    engineCc: 1496,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 17,
    insuranceGroup: 'medium',
  },
  {
    id: 'honda_city_rs',
    brand: 'Honda',
    model: 'City',
    variant: 'RS',
    year: 2025,
    price: 380000000,
    engineCc: 1498,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 17,
    insuranceGroup: 'medium',
  },
  {
    id: 'toyota_corolla_altis',
    brand: 'Toyota',
    model: 'Corolla Altis',
    variant: 'V',
    year: 2025,
    price: 570000000,
    engineCc: 1798,
    fuelType: 'pertamax',
    fuelConsumptionKmPerLiter: 15,
    insuranceGroup: 'medium',
  },
  
  // Compact SUV (300-600 juta)
  {
    id: 'toyota_raize_gr_sport',
    brand: 'Toyota',
    model: 'Raize',
    variant: 'GR Sport',
    year: 2025,
    price: 304000000,
    engineCc: 998,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 17,
    insuranceGroup: 'medium',
  },
  {
    id: 'daihatsu_rocky_r',
    brand: 'Daihatsu',
    model: 'Rocky',
    variant: 'R',
    year: 2025,
    price: 291000000,
    engineCc: 998,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 17,
    insuranceGroup: 'medium',
  },
  {
    id: 'honda_hrv_rs',
    brand: 'Honda',
    model: 'HR-V',
    variant: 'RS Turbo',
    year: 2025,
    price: 525000000,
    engineCc: 1498,
    fuelType: 'pertamax',
    fuelConsumptionKmPerLiter: 15,
    insuranceGroup: 'high',
  },
  {
    id: 'toyota_fortuner_vrz',
    brand: 'Toyota',
    model: 'Fortuner',
    variant: 'VRZ',
    year: 2025,
    price: 720000000,
    engineCc: 2393,
    fuelType: 'dexlite',
    fuelConsumptionKmPerLiter: 12,
    insuranceGroup: 'high',
  },
  {
    id: 'pajero_sport_dakar',
    brand: 'Mitsubishi',
    model: 'Pajero Sport',
    variant: 'Dakar',
    year: 2025,
    price: 850000000,
    engineCc: 2442,
    fuelType: 'dexlite',
    fuelConsumptionKmPerLiter: 11,
    insuranceGroup: 'luxury',
  },
  
  // MPV Family Cars (250-500 juta)
  {
    id: 'toyota_avanza_g',
    brand: 'Toyota',
    model: 'Avanza',
    variant: 'G',
    year: 2025,
    price: 268000000,
    engineCc: 1496,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 16,
    insuranceGroup: 'medium',
  },
  {
    id: 'daihatsu_xenia_r',
    brand: 'Daihatsu',
    model: 'Xenia',
    variant: 'R',
    year: 2025,
    price: 259000000,
    engineCc: 1496,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 16,
    insuranceGroup: 'medium',
  },
  {
    id: 'honda_mobilio_rs',
    brand: 'Honda',
    model: 'Mobilio',
    variant: 'RS',
    year: 2025,
    price: 276000000,
    engineCc: 1497,
    fuelType: 'pertalite',
    fuelConsumptionKmPerLiter: 16,
    insuranceGroup: 'medium',
  },
  {
    id: 'toyota_innova_zenix',
    brand: 'Toyota',
    model: 'Kijang Innova Zenix',
    variant: 'G',
    year: 2025,
    price: 450000000,
    engineCc: 1987,
    fuelType: 'pertamax',
    fuelConsumptionKmPerLiter: 14,
    insuranceGroup: 'high',
  },
  
  // Luxury Cars (> 800 juta)
  {
    id: 'bmw_320i_sport',
    brand: 'BMW',
    model: '320i',
    variant: 'Sport',
    year: 2025,
    price: 1050000000,
    engineCc: 1998,
    fuelType: 'pertamax_turbo',
    fuelConsumptionKmPerLiter: 13,
    insuranceGroup: 'luxury',
  },
  {
    id: 'mercedes_c200',
    brand: 'Mercedes-Benz',
    model: 'C200',
    variant: 'Avantgarde',
    year: 2025,
    price: 1150000000,
    engineCc: 1496,
    fuelType: 'pertamax_turbo',
    fuelConsumptionKmPerLiter: 14,
    insuranceGroup: 'luxury',
  },
  {
    id: 'audi_a4',
    brand: 'Audi',
    model: 'A4',
    variant: 'TFSI',
    year: 2025,
    price: 980000000,
    engineCc: 1984,
    fuelType: 'pertamax_turbo',
    fuelConsumptionKmPerLiter: 13,
    insuranceGroup: 'luxury',
  },
];

export function getICEVehicleById(id: string): ICEVehicle | undefined {
  return ICE_VEHICLES.find(v => v.id === id);
}

export function getICEVehiclesByBrand(brand: string): ICEVehicle[] {
  return ICE_VEHICLES.filter(v => v.brand.toLowerCase() === brand.toLowerCase());
}

export function getAllICEBrands(): string[] {
  const brands = new Set(ICE_VEHICLES.map(v => v.brand));
  return Array.from(brands).sort();
}

// Group vehicles by price range
export function getICEVehiclesByPriceRange(
  min: number,
  max: number
): ICEVehicle[] {
  return ICE_VEHICLES.filter(v => v.price >= min && v.price <= max);
}

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: '< 300 Juta', min: 0, max: 300000000 },
  { label: '300 - 500 Juta', min: 300000000, max: 500000000 },
  { label: '500 - 800 Juta', min: 500000000, max: 800000000 },
  { label: '> 800 Juta', min: 800000000, max: Infinity },
];
