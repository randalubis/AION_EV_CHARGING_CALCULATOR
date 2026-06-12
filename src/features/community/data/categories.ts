import type { CommunityInterest, CommunityRegion } from '../types';

/** Display labels for region buckets, in the order they should appear. */
export const REGION_LABELS: Record<CommunityRegion, string> = {
  national: 'Nasional',
  jakarta: 'Jakarta',
  jawa_barat: 'Jawa Barat',
  jawa_tengah: 'Jawa Tengah',
  jawa_timur: 'Jawa Timur',
  banten: 'Banten',
  bali: 'Bali',
  sumatera: 'Sumatera',
  kalimantan: 'Kalimantan',
  sulawesi: 'Sulawesi',
  lainnya: 'Lainnya',
};

export const REGION_ORDER: CommunityRegion[] = [
  'national',
  'jakarta',
  'jawa_barat',
  'jawa_tengah',
  'jawa_timur',
  'banten',
  'bali',
  'sumatera',
  'kalimantan',
  'sulawesi',
  'lainnya',
];

/** Display labels for interest tags. */
export const INTEREST_LABELS: Record<CommunityInterest, string> = {
  women: 'EV Ladies',
  european: 'EV Eropa',
  japanese: 'EV Jepang',
  american: 'EV Amerika',
  chinese: 'EV Cina',
  korean: 'EV Korea',
  roadtrip: 'Roadtrip & Trip Planner',
  marketplace: 'Jual Beli',
  workshop: 'Bengkel & Modifikasi',
  general: 'Diskusi Umum',
};

export const INTEREST_ORDER: CommunityInterest[] = [
  'general',
  'women',
  'european',
  'japanese',
  'american',
  'chinese',
  'korean',
  'roadtrip',
  'marketplace',
  'workshop',
];
