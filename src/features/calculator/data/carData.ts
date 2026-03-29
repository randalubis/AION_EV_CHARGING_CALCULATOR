// Shared EV Car Data
// Used by both Charging Calculator and TCO Calculator
// This ensures data consistency across the application

export interface CarData {
  id: string;
  brand: string;
  series: string;
  variant: string;
  badge: string;
  battery: number;      // kWh
  maxRange: number;     // km
  maxDcKw: number;      // Max DC charging kW
  maxAcKw: number;      // Max AC charging kW
  
  // TCO-specific fields (optional for charging calculator)
  price?: number;                   // IDR OTR price
  consumptionKwhPer100km?: number;  // Calculated from battery and range
  insuranceGroup?: 'low' | 'medium' | 'high' | 'luxury';
}

export const BRANDS = [
  { id: "bmw", name: "BMW", short: "BMW" },
  { id: "byd", name: "BYD", short: "BYD" },
  { id: "chery", name: "Chery", short: "Chery" },
  { id: "denza", name: "Denza", short: "Denza" },
  { id: "gac", name: "GAC Aion", short: "Aion" },
  { id: "geely", name: "Geely", short: "Geely" },
  { id: "hyundai", name: "Hyundai", short: "Hyundai" },
  { id: "kia", name: "KIA", short: "KIA" },
  { id: "lexus", name: "Lexus", short: "Lexus" },
  { id: "mercedes", name: "Mercedes-Benz", short: "Mercedes" },
  { id: "mg", name: "MG", short: "MG" },
  { id: "mini", name: "MINI", short: "MINI" },
  { id: "neta", name: "Neta", short: "Neta" },
  { id: "nissan", name: "Nissan", short: "Nissan" },
  { id: "toyota", name: "Toyota", short: "Toyota" },
  { id: "vinfast", name: "VinFast", short: "VinFast" },
  { id: "volvo", name: "Volvo", short: "Volvo" },
  { id: "wuling", name: "Wuling", short: "Wuling" },
] as const;

export const CARS: CarData[] = [
  // GAC Aion
  { 
    id: "aion_v_lux", brand: "gac", series: "Aion V", variant: "Luxury", badge: "V", 
    battery: 75.3, maxRange: 602, maxDcKw: 180, maxAcKw: 7,
    price: 488000000, insuranceGroup: 'high'
  },
  { 
    id: "aion_v_exc", brand: "gac", series: "Aion V", variant: "Exclusive", badge: "V", 
    battery: 64.5, maxRange: 505, maxDcKw: 150, maxAcKw: 7,
    price: 438000000, insuranceGroup: 'high'
  },
  { 
    id: "aion_yp_exc", brand: "gac", series: "Aion Y Plus", variant: "Exclusive", badge: "Y+", 
    battery: 50.66, maxRange: 410, maxDcKw: 80, maxAcKw: 7,
    price: 368000000, insuranceGroup: 'medium'
  },
  { 
    id: "aion_yp_pre", brand: "gac", series: "Aion Y Plus", variant: "Premium", badge: "Y+", 
    battery: 63.2, maxRange: 490, maxDcKw: 80, maxAcKw: 7,
    price: 418000000, insuranceGroup: 'medium'
  },
  { 
    id: "aion_ht_pre", brand: "gac", series: "Hyptec HT", variant: "Premium", badge: "HT", 
    battery: 83, maxRange: 620, maxDcKw: 280, maxAcKw: 11,
    price: 548000000, insuranceGroup: 'high'
  },
  { 
    id: "aion_ut_pre", brand: "gac", series: "Aion UT", variant: "Premium", badge: "UT", 
    battery: 60, maxRange: 500, maxDcKw: 87, maxAcKw: 7,
    price: 398000000, insuranceGroup: 'medium'
  },
  { 
    id: "aion_ut_std", brand: "gac", series: "Aion UT", variant: "Standard", badge: "UT", 
    battery: 44.12, maxRange: 400, maxDcKw: 64, maxAcKw: 7,
    price: 298000000, insuranceGroup: 'medium'
  },
  
  // BYD
  { 
    id: "byd_atto1_dyn", brand: "byd", series: "Atto 1", variant: "Dynamic", badge: "A1", 
    battery: 30.08, maxRange: 300, maxDcKw: 30, maxAcKw: 6.6,
    price: 238000000, insuranceGroup: 'low'
  },
  { 
    id: "byd_atto1_pre", brand: "byd", series: "Atto 1", variant: "Premium", badge: "A1", 
    battery: 38.88, maxRange: 380, maxDcKw: 40, maxAcKw: 6.6,
    price: 278000000, insuranceGroup: 'low'
  },
  { 
    id: "byd_atto3_std", brand: "byd", series: "Atto 3", variant: "Advanced", badge: "A3", 
    battery: 49.92, maxRange: 410, maxDcKw: 80, maxAcKw: 7,
    price: 438000000, insuranceGroup: 'medium'
  },
  { 
    id: "byd_atto3_ext", brand: "byd", series: "Atto 3", variant: "Superior", badge: "A3", 
    battery: 60.48, maxRange: 480, maxDcKw: 88, maxAcKw: 7,
    price: 498000000, insuranceGroup: 'medium'
  },
  { 
    id: "byd_dolphin_std", brand: "byd", series: "Dolphin", variant: "Dynamic", badge: "DP", 
    battery: 44.9, maxRange: 410, maxDcKw: 60, maxAcKw: 7,
    price: 388000000, insuranceGroup: 'medium'
  },
  { 
    id: "byd_dolphin_ext", brand: "byd", series: "Dolphin", variant: "Premium", badge: "DP", 
    battery: 60.48, maxRange: 427, maxDcKw: 80, maxAcKw: 7,
    price: 448000000, insuranceGroup: 'medium'
  },
  { 
    id: "byd_seal_pre", brand: "byd", series: "Seal", variant: "Premium", badge: "SL", 
    battery: 61.44, maxRange: 510, maxDcKw: 110, maxAcKw: 7,
    price: 628000000, insuranceGroup: 'high'
  },
  { 
    id: "byd_seal_perf", brand: "byd", series: "Seal", variant: "Performance", badge: "SL", 
    battery: 82.56, maxRange: 570, maxDcKw: 150, maxAcKw: 7,
    price: 748000000, insuranceGroup: 'high'
  },
  { 
    id: "byd_m6_std", brand: "byd", series: "M6", variant: "Standard", badge: "M6", 
    battery: 55.4, maxRange: 420, maxDcKw: 89, maxAcKw: 7,
    price: 448000000, insuranceGroup: 'medium'
  },
  { 
    id: "byd_m6_sup", brand: "byd", series: "M6", variant: "Superior", badge: "M6", 
    battery: 71.8, maxRange: 530, maxDcKw: 115, maxAcKw: 7,
    price: 518000000, insuranceGroup: 'high'
  },
  { 
    id: "byd_sl7_pre", brand: "byd", series: "Sealion 7", variant: "Premium RWD", badge: "SL7", 
    battery: 82.56, maxRange: 482, maxDcKw: 150, maxAcKw: 11,
    price: 698000000, insuranceGroup: 'high'
  },
  { 
    id: "byd_sl7_perf", brand: "byd", series: "Sealion 7", variant: "Performance AWD", badge: "SL7", 
    battery: 82.56, maxRange: 456, maxDcKw: 150, maxAcKw: 11,
    price: 798000000, insuranceGroup: 'luxury'
  },
  
  // Hyundai
  { 
    id: "hyu_ioniq5_std", brand: "hyundai", series: "Ioniq 5", variant: "Standard Range", badge: "I5", 
    battery: 58, maxRange: 384, maxDcKw: 100, maxAcKw: 11,
    price: 718000000, insuranceGroup: 'high'
  },
  { 
    id: "hyu_ioniq5_lr", brand: "hyundai", series: "Ioniq 5", variant: "Long Range", badge: "I5", 
    battery: 72.6, maxRange: 481, maxDcKw: 220, maxAcKw: 11,
    price: 848000000, insuranceGroup: 'luxury'
  },
  { 
    id: "hyu_ioniq6_lr", brand: "hyundai", series: "Ioniq 6", variant: "Signature AWD", badge: "I6", 
    battery: 77.4, maxRange: 519, maxDcKw: 220, maxAcKw: 11,
    price: 948000000, insuranceGroup: 'luxury'
  },
  { 
    id: "hyu_kona_sr", brand: "hyundai", series: "Kona Electric", variant: "Standard Range", badge: "KN", 
    battery: 48.9, maxRange: 448, maxDcKw: 100, maxAcKw: 7.4,
    price: 498000000, insuranceGroup: 'high'
  },
  { 
    id: "hyu_kona_lr_p", brand: "hyundai", series: "Kona Electric", variant: "Long Range Prime", badge: "KN", 
    battery: 66, maxRange: 602, maxDcKw: 100, maxAcKw: 7.4,
    price: 598000000, insuranceGroup: 'high'
  },
  { 
    id: "hyu_kona_lr_s", brand: "hyundai", series: "Kona Electric", variant: "Long Range Signature", badge: "KN", 
    battery: 66, maxRange: 549, maxDcKw: 100, maxAcKw: 7.4,
    price: 648000000, insuranceGroup: 'high'
  },
  
  // Wuling
  { 
    id: "wul_airev_std", brand: "wuling", series: "Air EV", variant: "Standard", badge: "AEV", 
    battery: 17.3, maxRange: 200, maxDcKw: 0, maxAcKw: 3.3,
    price: 238000000, insuranceGroup: 'low'
  },
  { 
    id: "wul_airev_lr", brand: "wuling", series: "Air EV", variant: "Long Range", badge: "AEV", 
    battery: 26.7, maxRange: 300, maxDcKw: 0, maxAcKw: 6.6,
    price: 278000000, insuranceGroup: 'low'
  },
  { 
    id: "wul_bingo_lr_ac", brand: "wuling", series: "BinguoEV", variant: "Long Range AC", badge: "BNG", 
    battery: 31.9, maxRange: 333, maxDcKw: 0, maxAcKw: 7,
    price: 298000000, insuranceGroup: 'low'
  },
  { 
    id: "wul_bingo_lr_dc", brand: "wuling", series: "BinguoEV", variant: "Long Range AC/DC", badge: "BNG", 
    battery: 31.9, maxRange: 333, maxDcKw: 50, maxAcKw: 7,
    price: 338000000, insuranceGroup: 'low'
  },
  { 
    id: "wul_bingo_pre", brand: "wuling", series: "BinguoEV", variant: "Premium Range", badge: "BNG", 
    battery: 37.9, maxRange: 410, maxDcKw: 50, maxAcKw: 7,
    price: 398000000, insuranceGroup: 'medium'
  },
  { 
    id: "wul_cloud", brand: "wuling", series: "Cloud EV", variant: "Standard", badge: "CLD", 
    battery: 50.6, maxRange: 460, maxDcKw: 50, maxAcKw: 7,
    price: 498000000, insuranceGroup: 'medium'
  },
  
  // Toyota
  { 
    id: "toy_bz4x_fwd", brand: "toyota", series: "bZ4X", variant: "FWD", badge: "4X", 
    battery: 71.4, maxRange: 516, maxDcKw: 150, maxAcKw: 6.6,
    price: 1150000000, insuranceGroup: 'luxury'
  },
  { 
    id: "toy_bz4x_awd", brand: "toyota", series: "bZ4X", variant: "AWD", badge: "4X", 
    battery: 71.4, maxRange: 470, maxDcKw: 150, maxAcKw: 6.6,
    price: 1250000000, insuranceGroup: 'luxury'
  },
  
  // Chery
  { 
    id: "chr_omoda_e5", brand: "chery", series: "Omoda E5", variant: "Standard", badge: "E5", 
    battery: 61.06, maxRange: 430, maxDcKw: 150, maxAcKw: 6.6,
    price: 448000000, insuranceGroup: 'medium'
  },
  
  // Denza
  { 
    id: "dnz_d9", brand: "denza", series: "D9", variant: "Premium", badge: "D9", 
    battery: 103, maxRange: 600, maxDcKw: 166, maxAcKw: 11,
    price: 950000000, insuranceGroup: 'luxury'
  },
  
  // Nissan
  { 
    id: "nis_leaf", brand: "nissan", series: "Leaf", variant: "Standard", badge: "LF", 
    battery: 40, maxRange: 311, maxDcKw: 50, maxAcKw: 7.4,
    price: 698000000, insuranceGroup: 'high'
  },
  
  // Geely
  { 
    id: "gly_ex5", brand: "geely", series: "EX5", variant: "Pro / Max", badge: "X5", 
    battery: 60.22, maxRange: 495, maxDcKw: 100, maxAcKw: 11,
    price: 388000000, insuranceGroup: 'medium'
  },
  { 
    id: "gly_ex2", brand: "geely", series: "EX2", variant: "Pro / Max", badge: "X2", 
    battery: 40.8, maxRange: 395, maxDcKw: 70, maxAcKw: 7,
    price: 288000000, insuranceGroup: 'low'
  },
  
  // MG
  { 
    id: "mg_zs_ev", brand: "mg", series: "ZS EV", variant: "Standard", badge: "ZS", 
    battery: 50.3, maxRange: 403, maxDcKw: 50, maxAcKw: 7,
    price: 398000000, insuranceGroup: 'medium'
  },
  { 
    id: "mg4_exc", brand: "mg", series: "MG4 EV", variant: "Excite", badge: "M4", 
    battery: 51, maxRange: 425, maxDcKw: 117, maxAcKw: 6.6,
    price: 398000000, insuranceGroup: 'medium'
  },
  { 
    id: "mg4_max", brand: "mg", series: "MG4 EV", variant: "MAX", badge: "M4", 
    battery: 64, maxRange: 540, maxDcKw: 144, maxAcKw: 11,
    price: 498000000, insuranceGroup: 'high'
  },
  
  // VinFast
  { 
    id: "vf_vf3", brand: "vinfast", series: "VF 3", variant: "Standard", badge: "VF3", 
    battery: 18.6, maxRange: 215, maxDcKw: 30, maxAcKw: 3.3,
    price: 198000000, insuranceGroup: 'low'
  },
  { 
    id: "vf_vf5", brand: "vinfast", series: "VF 5", variant: "Standard", badge: "VF5", 
    battery: 29.6, maxRange: 268, maxDcKw: 30, maxAcKw: 6.6,
    price: 238000000, insuranceGroup: 'low'
  },
  { 
    id: "vf_vfe34", brand: "vinfast", series: "VF e34", variant: "Standard", badge: "E34", 
    battery: 41.9, maxRange: 318, maxDcKw: 50, maxAcKw: 6.6,
    price: 298000000, insuranceGroup: 'medium'
  },
  { 
    id: "vf_vf6_eco", brand: "vinfast", series: "VF 6", variant: "Eco", badge: "VF6", 
    battery: 59.6, maxRange: 399, maxDcKw: 80, maxAcKw: 7.2,
    price: 388000000, insuranceGroup: 'medium'
  },
  { 
    id: "vf_vf6_plus", brand: "vinfast", series: "VF 6", variant: "Plus", badge: "VF6", 
    battery: 59.6, maxRange: 381, maxDcKw: 80, maxAcKw: 7.2,
    price: 438000000, insuranceGroup: 'medium'
  },
  { 
    id: "vf_vf7_eco", brand: "vinfast", series: "VF 7", variant: "Eco", badge: "VF7", 
    battery: 59.6, maxRange: 430, maxDcKw: 80, maxAcKw: 11,
    price: 498000000, insuranceGroup: 'high'
  },
  { 
    id: "vf_vf7_plus", brand: "vinfast", series: "VF 7", variant: "Plus AWD", badge: "VF7", 
    battery: 70.8, maxRange: 471, maxDcKw: 90, maxAcKw: 11,
    price: 568000000, insuranceGroup: 'high'
  },
  
  // Neta
  { 
    id: "neta_v", brand: "neta", series: "Neta V", variant: "Standard", badge: "V", 
    battery: 40.7, maxRange: 401, maxDcKw: 100, maxAcKw: 6.6,
    price: 298000000, insuranceGroup: 'low'
  },
  { 
    id: "neta_vii", brand: "neta", series: "Neta V", variant: "V-II", badge: "VII", 
    battery: 40.7, maxRange: 401, maxDcKw: 50, maxAcKw: 6.6,
    price: 328000000, insuranceGroup: 'low'
  },
  { 
    id: "neta_x", brand: "neta", series: "Neta X", variant: "Standard", badge: "X", 
    battery: 63.56, maxRange: 480, maxDcKw: 105, maxAcKw: 7,
    price: 398000000, insuranceGroup: 'medium'
  },
  
  // Volvo
  { 
    id: "vol_xc40", brand: "volvo", series: "XC40 Recharge", variant: "Twin Motor AWD", badge: "40", 
    battery: 78, maxRange: 500, maxDcKw: 150, maxAcKw: 11,
    price: 1350000000, insuranceGroup: 'luxury'
  },
  { 
    id: "vol_c40", brand: "volvo", series: "C40 Recharge", variant: "Twin Motor AWD", badge: "C40", 
    battery: 78, maxRange: 500, maxDcKw: 150, maxAcKw: 11,
    price: 1450000000, insuranceGroup: 'luxury'
  },
  
  // KIA
  { 
    id: "kia_ev6_gtl", brand: "kia", series: "EV6", variant: "GT-Line AWD", badge: "EV6", 
    battery: 77.4, maxRange: 506, maxDcKw: 350, maxAcKw: 11,
    price: 948000000, insuranceGroup: 'luxury'
  },
  { 
    id: "kia_ev9_earth", brand: "kia", series: "EV9", variant: "Earth Long Range", badge: "EV9", 
    battery: 99.8, maxRange: 540, maxDcKw: 350, maxAcKw: 11,
    price: 1248000000, insuranceGroup: 'luxury'
  },
  { 
    id: "kia_ev9_gtl", brand: "kia", series: "EV9", variant: "GT-Line AWD", badge: "EV9", 
    battery: 99.8, maxRange: 497, maxDcKw: 350, maxAcKw: 11,
    price: 1348000000, insuranceGroup: 'luxury'
  },
  
  // Lexus
  { 
    id: "lex_ux300e", brand: "lexus", series: "UX 300e", variant: "Standard", badge: "UX", 
    battery: 72.8, maxRange: 450, maxDcKw: 50, maxAcKw: 7,
    price: 898000000, insuranceGroup: 'luxury'
  },
  { 
    id: "lex_rz450e", brand: "lexus", series: "RZ 450e", variant: "Luxury AWD", badge: "RZ", 
    battery: 71.4, maxRange: 400, maxDcKw: 150, maxAcKw: 6.6,
    price: 1198000000, insuranceGroup: 'luxury'
  },
  
  // BMW
  { 
    id: "bmw_ix1", brand: "bmw", series: "iX1", variant: "eDrive20 M Sport", badge: "iX1", 
    battery: 64.78, maxRange: 474, maxDcKw: 130, maxAcKw: 11,
    price: 1280000000, insuranceGroup: 'luxury'
  },
  { 
    id: "bmw_i4_35", brand: "bmw", series: "i4", variant: "eDrive35", badge: "i4", 
    battery: 66, maxRange: 490, maxDcKw: 180, maxAcKw: 11,
    price: 1180000000, insuranceGroup: 'luxury'
  },
  { 
    id: "bmw_i5_40", brand: "bmw", series: "i5", variant: "eDrive40 M Sport", badge: "i5", 
    battery: 81.2, maxRange: 582, maxDcKw: 205, maxAcKw: 22,
    price: 1480000000, insuranceGroup: 'luxury'
  },
  { 
    id: "bmw_i5_m60", brand: "bmw", series: "i5", variant: "M60 xDrive", badge: "i5M", 
    battery: 81.2, maxRange: 516, maxDcKw: 205, maxAcKw: 22,
    price: 1880000000, insuranceGroup: 'luxury'
  },
  { 
    id: "bmw_i5_tour", brand: "bmw", series: "i5 Touring", variant: "eDrive40", badge: "i5T", 
    battery: 81.2, maxRange: 560, maxDcKw: 205, maxAcKw: 22,
    price: 1580000000, insuranceGroup: 'luxury'
  },
  { 
    id: "bmw_i7", brand: "bmw", series: "i7", variant: "xDrive60 Gran Lusso", badge: "i7", 
    battery: 101.7, maxRange: 625, maxDcKw: 195, maxAcKw: 22,
    price: 2480000000, insuranceGroup: 'luxury'
  },
  { 
    id: "bmw_ix40", brand: "bmw", series: "iX", variant: "xDrive40 Sport", badge: "iX", 
    battery: 76.6, maxRange: 425, maxDcKw: 150, maxAcKw: 11,
    price: 1780000000, insuranceGroup: 'luxury'
  },
  { 
    id: "bmw_ix50", brand: "bmw", series: "iX", variant: "xDrive50 Sport", badge: "iX", 
    battery: 108.8, maxRange: 630, maxDcKw: 200, maxAcKw: 11,
    price: 2180000000, insuranceGroup: 'luxury'
  },
  
  // Mercedes
  { 
    id: "mbz_eqa", brand: "mercedes", series: "EQA", variant: "250 Electric Line", badge: "EQA", 
    battery: 66.5, maxRange: 476, maxDcKw: 100, maxAcKw: 11,
    price: 1380000000, insuranceGroup: 'luxury'
  },
  { 
    id: "mbz_eqb", brand: "mercedes", series: "EQB", variant: "250 Progressive", badge: "EQB", 
    battery: 66.5, maxRange: 400, maxDcKw: 100, maxAcKw: 11,
    price: 1480000000, insuranceGroup: 'luxury'
  },
  { 
    id: "mbz_eqe", brand: "mercedes", series: "EQE", variant: "350+ Sedan", badge: "EQE", 
    battery: 90, maxRange: 673, maxDcKw: 170, maxAcKw: 11,
    price: 1780000000, insuranceGroup: 'luxury'
  },
  { 
    id: "mbz_eqe_suv", brand: "mercedes", series: "EQE SUV", variant: "350 4MATIC", badge: "SUV", 
    battery: 90.56, maxRange: 566, maxDcKw: 170, maxAcKw: 11,
    price: 1880000000, insuranceGroup: 'luxury'
  },
  { 
    id: "mbz_eqs", brand: "mercedes", series: "EQS", variant: "450+ AMG Line", badge: "EQS", 
    battery: 107.8, maxRange: 770, maxDcKw: 200, maxAcKw: 22,
    price: 2480000000, insuranceGroup: 'luxury'
  },
  
  // MINI
  { 
    id: "mini_elec", brand: "mini", series: "Electric", variant: "32.6 kWh", badge: "ME", 
    battery: 32.6, maxRange: 234, maxDcKw: 50, maxAcKw: 7.4,
    price: 698000000, insuranceGroup: 'high'
  },
  { 
    id: "mini_cse", brand: "mini", series: "Electric Cooper", variant: "SE", badge: "CSE", 
    battery: 54.2, maxRange: 402, maxDcKw: 95, maxAcKw: 11,
    price: 898000000, insuranceGroup: 'luxury'
  },
];

// Helper function to calculate consumption
export function calculateConsumption(battery: number, range: number): number {
  return (battery / range) * 100;
}

// Calculate consumption for all cars that don't have it
CARS.forEach(car => {
  if (!car.consumptionKwhPer100km) {
    car.consumptionKwhPer100km = calculateConsumption(car.battery, car.maxRange);
  }
});

// Export helper functions
export function getCarById(id: string): CarData | undefined {
  return CARS.find(c => c.id === id);
}

export function getCarsByBrand(brand: string): CarData[] {
  return CARS.filter(c => c.brand === brand);
}

export function getAllBrands(): string[] {
  return [...new Set(CARS.map(c => c.brand))].sort();
}

export function getCarsByPriceRange(min: number, max: number): CarData[] {
  return CARS.filter(c => c.price && c.price >= min && c.price <= max);
}
