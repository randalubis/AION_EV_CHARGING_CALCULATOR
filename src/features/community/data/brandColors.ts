/**
 * Brand accent colors used on community cards and section headers.
 * Approximate primary corporate colors — softened/desaturated where the
 * literal brand color would clash with the forest-dark page theme.
 *
 * Keys match BRAND IDs in src/features/calculator/data/carData.ts.
 */
export const BRAND_COLORS: Record<string, string> = {
  bmw: '#1c69d4',
  byd: '#d50032',
  chery: '#0050a4',
  denza: '#5c6068',
  gac: '#00afca',
  geely: '#005baa',
  hyundai: '#002c5f',
  kia: '#bb162b',
  lexus: '#5c6068',
  mercedes: '#00adef',
  mg: '#cc092f',
  mini: '#3a3a3a',
  neta: '#3a3a3a',
  nissan: '#c3002f',
  toyota: '#eb0a1e',
  vinfast: '#3aa856',
  volvo: '#1a4a87',
  wuling: '#dc2128',
};

/** Fallback palette for cross-brand or interest-only cards — chosen to feel evhub-on-brand. */
const FALLBACK_PALETTE = [
  '#FFC300', // signature yellow
  '#27AE60', // green
  '#3498DB', // blue
  '#E67E22', // orange
  '#9B59B6', // purple
  '#16A085', // teal
];

/** Tailwind text color for interest-themed accents — used in section swatches. */
export function fallbackColorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
}

/** Pick the accent color for a community card based on its brands/interests. */
export function accentColorFor(brands: string[], fallbackSeed: string): string {
  if (brands.length === 1) {
    const c = BRAND_COLORS[brands[0]];
    if (c) return c;
  }
  return fallbackColorFor(fallbackSeed);
}
