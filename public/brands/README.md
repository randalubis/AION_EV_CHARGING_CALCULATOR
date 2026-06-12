# Brand Logos

Square logos for the 18 calculator brands, used as identity badges on
`CommunityCard` (page: `/komunitas`).

## File contract

- One file per brand: `{brand-id}.svg` (or `.png`)
- Filename must match the `id` in
  [`src/features/calculator/data/carData.ts`](../../src/features/calculator/data/carData.ts)
  (`bmw`, `byd`, `chery`, `denza`, `gac`, `geely`, `hyundai`, `kia`,
  `lexus`, `mercedes`, `mg`, `mini`, `neta`, `nissan`, `toyota`,
  `vinfast`, `volvo`, `wuling`).
- Square aspect ratio. The card renders at 56 × 56 px on the page.
- Code expects `.svg` — to use a PNG or other format, change the
  `<img src>` extension in
  [`src/features/community/components/CommunityCard.tsx`](../../src/features/community/components/CommunityCard.tsx).

## Current state

The 18 SVG files in this folder are **monogram placeholders** (2-letter
initials on a brand-color background). They keep the page populated
until you replace them with real official logos.

## Replacing a placeholder

1. Save the new logo as `{brand-id}.svg` (or `.png`, see above).
2. Overwrite the existing file in this folder.
3. The page picks up the new logo on next reload — no code change needed.

For best result with mixed brand backgrounds (some logos are dark, some
light), use logos with a **transparent background** and lean toward
**dark/colored marks** so they read on the card's white badge tile.
