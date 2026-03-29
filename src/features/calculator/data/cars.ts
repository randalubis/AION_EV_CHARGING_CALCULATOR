import type { Car } from '../types';

export const CARS: Car[] = [
  // GAC Aion
  { id: "aion_v_lux", brand: "gac", series: "Aion V", variant: "Luxury", badge: "V", battery: 75.3, maxRange: 602, maxDcKw: 180, maxAcKw: 7 },
  { id: "aion_v_exc", brand: "gac", series: "Aion V", variant: "Exclusive", badge: "V", battery: 64.5, maxRange: 505, maxDcKw: 150, maxAcKw: 7 },
  { id: "aion_yp_exc", brand: "gac", series: "Aion Y Plus", variant: "Exclusive", badge: "Y+", battery: 50.66, maxRange: 410, maxDcKw: 80, maxAcKw: 7 },
  { id: "aion_yp_pre", brand: "gac", series: "Aion Y Plus", variant: "Premium", badge: "Y+", battery: 63.2, maxRange: 490, maxDcKw: 80, maxAcKw: 7 },
  { id: "aion_ht_pre", brand: "gac", series: "Hyptec HT", variant: "Premium", badge: "HT", battery: 83, maxRange: 620, maxDcKw: 280, maxAcKw: 11 },
  { id: "aion_ut_pre", brand: "gac", series: "Aion UT", variant: "Premium", badge: "UT", battery: 60, maxRange: 500, maxDcKw: 87, maxAcKw: 7 },
  { id: "aion_ut_std", brand: "gac", series: "Aion UT", variant: "Standard", badge: "UT", battery: 44.12, maxRange: 400, maxDcKw: 64, maxAcKw: 7 },
  // BYD
  { id: "byd_atto1_dyn", brand: "byd", series: "Atto 1", variant: "Dynamic", badge: "A1", battery: 30.08, maxRange: 300, maxDcKw: 30, maxAcKw: 6.6 },
  { id: "byd_atto1_pre", brand: "byd", series: "Atto 1", variant: "Premium", badge: "A1", battery: 38.88, maxRange: 380, maxDcKw: 40, maxAcKw: 6.6 },
  { id: "byd_atto3_std", brand: "byd", series: "Atto 3", variant: "Advanced", badge: "A3", battery: 49.92, maxRange: 410, maxDcKw: 80, maxAcKw: 7 },
  { id: "byd_atto3_ext", brand: "byd", series: "Atto 3", variant: "Superior", badge: "A3", battery: 60.48, maxRange: 480, maxDcKw: 88, maxAcKw: 7 },
  { id: "byd_dolphin_std", brand: "byd", series: "Dolphin", variant: "Dynamic", badge: "DP", battery: 44.9, maxRange: 410, maxDcKw: 60, maxAcKw: 7 },
  { id: "byd_dolphin_ext", brand: "byd", series: "Dolphin", variant: "Premium", badge: "DP", battery: 60.48, maxRange: 427, maxDcKw: 80, maxAcKw: 7 },
  { id: "byd_seal_pre", brand: "byd", series: "Seal", variant: "Premium", badge: "SL", battery: 61.44, maxRange: 510, maxDcKw: 110, maxAcKw: 7 },
  { id: "byd_seal_perf", brand: "byd", series: "Seal", variant: "Performance", badge: "SL", battery: 82.56, maxRange: 570, maxDcKw: 150, maxAcKw: 7 },
  { id: "byd_m6_std", brand: "byd", series: "M6", variant: "Standard", badge: "M6", battery: 55.4, maxRange: 420, maxDcKw: 89, maxAcKw: 7 },
  { id: "byd_m6_sup", brand: "byd", series: "M6", variant: "Superior", badge: "M6", battery: 71.8, maxRange: 530, maxDcKw: 115, maxAcKw: 7 },
  { id: "byd_sl7_pre", brand: "byd", series: "Sealion 7", variant: "Premium RWD", badge: "SL7", battery: 82.56, maxRange: 482, maxDcKw: 150, maxAcKw: 11 },
  { id: "byd_sl7_perf", brand: "byd", series: "Sealion 7", variant: "Performance AWD", badge: "SL7", battery: 82.56, maxRange: 456, maxDcKw: 150, maxAcKw: 11 },
  // Hyundai
  { id: "hyu_ioniq5_std", brand: "hyundai", series: "Ioniq 5", variant: "Standard Range", badge: "I5", battery: 58, maxRange: 384, maxDcKw: 100, maxAcKw: 11 },
  { id: "hyu_ioniq5_lr", brand: "hyundai", series: "Ioniq 5", variant: "Long Range", badge: "I5", battery: 72.6, maxRange: 481, maxDcKw: 220, maxAcKw: 11 },
  { id: "hyu_ioniq6_lr", brand: "hyundai", series: "Ioniq 6", variant: "Signature AWD", badge: "I6", battery: 77.4, maxRange: 519, maxDcKw: 220, maxAcKw: 11 },
  { id: "hyu_kona_sr", brand: "hyundai", series: "Kona Electric", variant: "Standard Range", badge: "KN", battery: 48.9, maxRange: 448, maxDcKw: 100, maxAcKw: 7.4 },
  { id: "hyu_kona_lr_p", brand: "hyundai", series: "Kona Electric", variant: "Long Range Prime", badge: "KN", battery: 66, maxRange: 602, maxDcKw: 100, maxAcKw: 7.4 },
  { id: "hyu_kona_lr_s", brand: "hyundai", series: "Kona Electric", variant: "Long Range Signature", badge: "KN", battery: 66, maxRange: 549, maxDcKw: 100, maxAcKw: 7.4 },
  // Wuling
  { id: "wul_airev_std", brand: "wuling", series: "Air EV", variant: "Standard", badge: "AEV", battery: 17.3, maxRange: 200, maxDcKw: 0, maxAcKw: 3.3 },
  { id: "wul_airev_lr", brand: "wuling", series: "Air EV", variant: "Long Range", badge: "AEV", battery: 26.7, maxRange: 300, maxDcKw: 0, maxAcKw: 6.6 },
  { id: "wul_bingo_lr_ac", brand: "wuling", series: "BinguoEV", variant: "Long Range AC", badge: "BNG", battery: 31.9, maxRange: 333, maxDcKw: 0, maxAcKw: 7 },
  { id: "wul_bingo_lr_dc", brand: "wuling", series: "BinguoEV", variant: "Long Range AC/DC", badge: "BNG", battery: 31.9, maxRange: 333, maxDcKw: 50, maxAcKw: 7 },
  { id: "wul_bingo_pre", brand: "wuling", series: "BinguoEV", variant: "Premium Range", badge: "BNG", battery: 37.9, maxRange: 410, maxDcKw: 50, maxAcKw: 7 },
  { id: "wul_cloud", brand: "wuling", series: "Cloud EV", variant: "Standard", badge: "CLD", battery: 50.6, maxRange: 460, maxDcKw: 50, maxAcKw: 7 },
  // Toyota
  { id: "toy_bz4x_fwd", brand: "toyota", series: "bZ4X", variant: "FWD", badge: "4X", battery: 71.4, maxRange: 516, maxDcKw: 150, maxAcKw: 6.6 },
  { id: "toy_bz4x_awd", brand: "toyota", series: "bZ4X", variant: "AWD", badge: "4X", battery: 71.4, maxRange: 470, maxDcKw: 150, maxAcKw: 6.6 },
  // Chery
  { id: "chr_omoda_e5", brand: "chery", series: "Omoda E5", variant: "Standard", badge: "E5", battery: 61.06, maxRange: 430, maxDcKw: 150, maxAcKw: 6.6 },
  // Denza
  { id: "dnz_d9", brand: "denza", series: "D9", variant: "Premium", badge: "D9", battery: 103, maxRange: 600, maxDcKw: 166, maxAcKw: 11 },
  // Nissan
  { id: "nis_leaf", brand: "nissan", series: "Leaf", variant: "Standard", badge: "LF", battery: 40, maxRange: 311, maxDcKw: 50, maxAcKw: 7.4 },
  // Geely
  { id: "gly_ex5", brand: "geely", series: "EX5", variant: "Pro / Max", badge: "X5", battery: 60.22, maxRange: 495, maxDcKw: 100, maxAcKw: 11 },
  { id: "gly_ex2", brand: "geely", series: "EX2", variant: "Pro / Max", badge: "X2", battery: 40.8, maxRange: 395, maxDcKw: 70, maxAcKw: 7 },
  // MG
  { id: "mg_zs_ev", brand: "mg", series: "ZS EV", variant: "Standard", badge: "ZS", battery: 50.3, maxRange: 403, maxDcKw: 50, maxAcKw: 7 },
  { id: "mg4_exc", brand: "mg", series: "MG4 EV", variant: "Excite", badge: "M4", battery: 51, maxRange: 425, maxDcKw: 117, maxAcKw: 6.6 },
  { id: "mg4_max", brand: "mg", series: "MG4 EV", variant: "MAX", badge: "M4", battery: 64, maxRange: 540, maxDcKw: 144, maxAcKw: 11 },
  // VinFast
  { id: "vf_vf3", brand: "vinfast", series: "VF 3", variant: "Standard", badge: "VF3", battery: 18.6, maxRange: 215, maxDcKw: 30, maxAcKw: 3.3 },
  { id: "vf_vf5", brand: "vinfast", series: "VF 5", variant: "Standard", badge: "VF5", battery: 29.6, maxRange: 268, maxDcKw: 30, maxAcKw: 6.6 },
  { id: "vf_vfe34", brand: "vinfast", series: "VF e34", variant: "Standard", badge: "E34", battery: 41.9, maxRange: 318, maxDcKw: 50, maxAcKw: 6.6 },
  { id: "vf_vf6_eco", brand: "vinfast", series: "VF 6", variant: "Eco", badge: "VF6", battery: 59.6, maxRange: 399, maxDcKw: 80, maxAcKw: 7.2 },
  { id: "vf_vf6_plus", brand: "vinfast", series: "VF 6", variant: "Plus", badge: "VF6", battery: 59.6, maxRange: 381, maxDcKw: 80, maxAcKw: 7.2 },
  { id: "vf_vf7_eco", brand: "vinfast", series: "VF 7", variant: "Eco", badge: "VF7", battery: 59.6, maxRange: 430, maxDcKw: 80, maxAcKw: 11 },
  { id: "vf_vf7_plus", brand: "vinfast", series: "VF 7", variant: "Plus AWD", badge: "VF7", battery: 70.8, maxRange: 471, maxDcKw: 90, maxAcKw: 11 },
  // Neta
  { id: "neta_v", brand: "neta", series: "Neta V", variant: "Standard", badge: "V", battery: 40.7, maxRange: 401, maxDcKw: 100, maxAcKw: 6.6 },
  { id: "neta_vii", brand: "neta", series: "Neta V", variant: "V-II", badge: "VII", battery: 40.7, maxRange: 401, maxDcKw: 50, maxAcKw: 6.6 },
  { id: "neta_x", brand: "neta", series: "Neta X", variant: "Standard", badge: "X", battery: 63.56, maxRange: 480, maxDcKw: 105, maxAcKw: 7 },
  // Volvo
  { id: "vol_xc40", brand: "volvo", series: "XC40 Recharge", variant: "Twin Motor AWD", badge: "40", battery: 78, maxRange: 500, maxDcKw: 150, maxAcKw: 11 },
  { id: "vol_c40", brand: "volvo", series: "C40 Recharge", variant: "Twin Motor AWD", badge: "C40", battery: 78, maxRange: 500, maxDcKw: 150, maxAcKw: 11 },
  // KIA
  { id: "kia_ev6_gtl", brand: "kia", series: "EV6", variant: "GT-Line AWD", badge: "EV6", battery: 77.4, maxRange: 506, maxDcKw: 350, maxAcKw: 11 },
  { id: "kia_ev9_earth", brand: "kia", series: "EV9", variant: "Earth Long Range", badge: "EV9", battery: 99.8, maxRange: 540, maxDcKw: 350, maxAcKw: 11 },
  { id: "kia_ev9_gtl", brand: "kia", series: "EV9", variant: "GT-Line AWD", badge: "EV9", battery: 99.8, maxRange: 497, maxDcKw: 350, maxAcKw: 11 },
  // Lexus
  { id: "lex_ux300e", brand: "lexus", series: "UX 300e", variant: "Standard", badge: "UX", battery: 72.8, maxRange: 450, maxDcKw: 50, maxAcKw: 7 },
  { id: "lex_rz450e", brand: "lexus", series: "RZ 450e", variant: "Luxury AWD", badge: "RZ", battery: 71.4, maxRange: 400, maxDcKw: 150, maxAcKw: 6.6 },
  // BMW
  { id: "bmw_ix1", brand: "bmw", series: "iX1", variant: "eDrive20 M Sport", badge: "iX1", battery: 64.78, maxRange: 474, maxDcKw: 130, maxAcKw: 11 },
  { id: "bmw_i4_35", brand: "bmw", series: "i4", variant: "eDrive35", badge: "i4", battery: 66, maxRange: 490, maxDcKw: 180, maxAcKw: 11 },
  { id: "bmw_i5_40", brand: "bmw", series: "i5", variant: "eDrive40 M Sport", badge: "i5", battery: 81.2, maxRange: 582, maxDcKw: 205, maxAcKw: 22 },
  { id: "bmw_i5_m60", brand: "bmw", series: "i5", variant: "M60 xDrive", badge: "i5M", battery: 81.2, maxRange: 516, maxDcKw: 205, maxAcKw: 22 },
  { id: "bmw_i5_tour", brand: "bmw", series: "i5 Touring", variant: "eDrive40", badge: "i5T", battery: 81.2, maxRange: 560, maxDcKw: 205, maxAcKw: 22 },
  { id: "bmw_i7", brand: "bmw", series: "i7", variant: "xDrive60 Gran Lusso", badge: "i7", battery: 101.7, maxRange: 625, maxDcKw: 195, maxAcKw: 22 },
  { id: "bmw_ix40", brand: "bmw", series: "iX", variant: "xDrive40 Sport", badge: "iX", battery: 76.6, maxRange: 425, maxDcKw: 150, maxAcKw: 11 },
  { id: "bmw_ix50", brand: "bmw", series: "iX", variant: "xDrive50 Sport", badge: "iX", battery: 108.8, maxRange: 630, maxDcKw: 200, maxAcKw: 11 },
  // Mercedes
  { id: "mbz_eqa", brand: "mercedes", series: "EQA", variant: "250 Electric Line", badge: "EQA", battery: 66.5, maxRange: 476, maxDcKw: 100, maxAcKw: 11 },
  { id: "mbz_eqb", brand: "mercedes", series: "EQB", variant: "250 Progressive", badge: "EQB", battery: 66.5, maxRange: 400, maxDcKw: 100, maxAcKw: 11 },
  { id: "mbz_eqe", brand: "mercedes", series: "EQE", variant: "350+ Sedan", badge: "EQE", battery: 90, maxRange: 673, maxDcKw: 170, maxAcKw: 11 },
  { id: "mbz_eqe_suv", brand: "mercedes", series: "EQE SUV", variant: "350 4MATIC", badge: "SUV", battery: 90.56, maxRange: 566, maxDcKw: 170, maxAcKw: 11 },
  { id: "mbz_eqs", brand: "mercedes", series: "EQS", variant: "450+ AMG Line", badge: "EQS", battery: 107.8, maxRange: 770, maxDcKw: 200, maxAcKw: 22 },
  // MINI
  { id: "mini_elec", brand: "mini", series: "Electric", variant: "32.6 kWh", badge: "ME", battery: 32.6, maxRange: 234, maxDcKw: 50, maxAcKw: 7.4 },
  { id: "mini_cse", brand: "mini", series: "Electric Cooper", variant: "SE", badge: "CSE", battery: 54.2, maxRange: 402, maxDcKw: 95, maxAcKw: 11 },
];
