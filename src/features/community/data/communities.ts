import type { Community } from '../types';

/**
 * Curated EV community directory.
 *
 * To add a new community:
 *   1. Append a `Community` entry to the array below.
 *   2. `id` must be unique (use a slug like `byd-seal-id`).
 *   3. `brands` references brand IDs from
 *      `src/features/calculator/data/carData.ts`. Use [] for brand-agnostic.
 *   4. `region` and `interests` come from `../categories.ts`.
 *   5. Set `lastVerifiedAt` to today's date when you confirm the link works.
 *
 * To remove a stale community: delete the entry. The page will hide any
 * brand/region/interest section that ends up with zero entries.
 *
 * The current entries are placeholders prefixed `Contoh:` — replace them
 * with real data and remove the "Contoh:" prefix when ready.
 */
export const COMMUNITIES: Community[] = [
  {
    id: 'example-byd-id',
    name: 'Contoh: BYD Owners Indonesia',
    description:
      'Komunitas pemilik BYD di Indonesia — diskusi pengalaman harian, charging, dan info komunitas.',
    platform: 'facebook',
    url: 'https://facebook.com/groups/example',
    brands: ['byd'],
    region: 'national',
    interests: ['general', 'chinese'],
    memberCount: 2400,
    lastVerifiedAt: '2026-05-01',
  },
  {
    id: 'example-hyundai-ioniq',
    name: 'Contoh: Hyundai Ioniq 5 Indonesia',
    description:
      'Forum khusus pemilik Hyundai Ioniq 5 — tips charging, modifikasi, meet-up.',
    platform: 'facebook',
    url: 'https://facebook.com/groups/example',
    brands: ['hyundai'],
    region: 'national',
    interests: ['general', 'korean'],
    memberCount: 1800,
    lastVerifiedAt: '2026-05-01',
  },
  {
    id: 'example-ev-ladies',
    name: 'Contoh: EV Ladies Indonesia',
    description:
      'Komunitas wanita pengguna EV. Dibatasi anggota, daftar via formulir agar admin bisa verifikasi.',
    platform: 'google_form',
    url: 'https://forms.gle/example',
    brands: [],
    region: 'national',
    interests: ['women', 'general'],
    memberCount: 320,
    lastVerifiedAt: '2026-05-01',
  },
  {
    id: 'example-ev-bali',
    name: 'Contoh: EV Owners Bali',
    description:
      'Komunitas pemilik EV di Bali — meet-up bulanan, info SPKLU, sesi roadtrip.',
    platform: 'facebook',
    url: 'https://facebook.com/groups/example',
    brands: [],
    region: 'bali',
    interests: ['general', 'roadtrip'],
    memberCount: 480,
    lastVerifiedAt: '2026-05-01',
  },
  {
    id: 'example-wuling-air',
    name: 'Contoh: Wuling Air EV Indonesia',
    description:
      'Komunitas Wuling Air EV — tips harian, isu umum, marketplace second-hand.',
    platform: 'facebook',
    url: 'https://facebook.com/groups/example',
    brands: ['wuling'],
    region: 'national',
    interests: ['general', 'chinese', 'marketplace'],
    memberCount: 5600,
    lastVerifiedAt: '2026-05-01',
  },
  {
    id: 'example-roadtrip',
    name: 'Contoh: EV Roadtrip Nusantara',
    description:
      'Lintas merek, fokus perjalanan jauh & route planning antar kota di Indonesia.',
    platform: 'facebook',
    url: 'https://facebook.com/groups/example',
    brands: [],
    region: 'national',
    interests: ['roadtrip', 'general'],
    lastVerifiedAt: '2026-05-01',
  },
];
