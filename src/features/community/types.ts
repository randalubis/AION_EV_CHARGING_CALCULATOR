/** Community link platform — matches the tools EV groups actually use in Indonesia. */
export type CommunityPlatform = 'facebook' | 'google_form' | 'website';

/** Region buckets — `national` covers cross-region groups. */
export type CommunityRegion =
  | 'national'
  | 'jakarta'
  | 'jawa_barat'
  | 'jawa_tengah'
  | 'jawa_timur'
  | 'banten'
  | 'bali'
  | 'sumatera'
  | 'kalimantan'
  | 'sulawesi'
  | 'lainnya';

/**
 * Free-form interest tags. Members can be in many categories at once
 * (e.g. an EV Ladies regional chapter is `women` + a region).
 *
 * Add new interests by appending here and to INTEREST_LABELS in
 * `data/categories.ts`.
 */
export type CommunityInterest =
  | 'women'        // EV Ladies, women-only chapters
  | 'european'     // BMW, Mercedes, Volvo, MINI fans
  | 'japanese'     // Toyota, Nissan, Lexus fans
  | 'american'     // Tesla and other US-brand fans
  | 'chinese'     // BYD, Wuling, GAC, Geely, Chery, Neta, Denza fans
  | 'korean'       // Hyundai, KIA fans
  | 'roadtrip'     // long-distance / route planning
  | 'marketplace'  // buy/sell second-hand EVs and accessories
  | 'workshop'     // service / DIY / modification
  | 'general';     // brand-agnostic general discussion

export interface Community {
  /** Stable slug — used as React key. */
  id: string;
  /** Display name. */
  name: string;
  /** One-sentence pitch. Keep under ~140 chars. */
  description: string;
  /** Where the link points to. */
  platform: CommunityPlatform;
  /** Public link — Facebook group URL or Google Form registration URL. */
  url: string;
  /**
   * Brand IDs this community is for. Use IDs from `BRANDS` in
   * `src/features/calculator/data/carData.ts`. Empty array = brand-agnostic.
   */
  brands: string[];
  /** Region. Use `national` for cross-region groups. */
  region: CommunityRegion;
  /** Interest tags. Empty array is fine; defaults the card to brand-only context. */
  interests: CommunityInterest[];
  /** Member count, if known. Display-only. */
  memberCount?: number;
  /** ISO date when an admin last verified the link works. */
  lastVerifiedAt?: string;
}
