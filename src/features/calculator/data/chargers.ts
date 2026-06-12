export const CHARGERS: { label: string; kw: number; type: 'ac' | 'dc' }[] = [
  { label: 'Home Charger (7.4 kW AC)', kw: 7.4, type: 'ac' },
  { label: 'Public AC (22 kW)', kw: 22, type: 'ac' },
  { label: 'Fast DC (60 kW)', kw: 60, type: 'dc' },
  { label: 'Rapid DC (100 kW)', kw: 100, type: 'dc' },
  { label: 'Rapid DC (120 kW)', kw: 120, type: 'dc' },
  { label: 'Ultra DC (180 kW)', kw: 180, type: 'dc' },
  { label: 'Ultra Fast DC (480 kW)', kw: 480, type: 'dc' },
];

/**
 * Battery-side efficiency: fraction of input power that ends up in the battery.
 *
 * AC (0.90): typical Level 2 onboard-charger conversion efficiency
 *   (88–93% across modern OBCs; PLN home meter measures the input side, so
 *   the user pays for this loss). Source: EPA Level 2 charging studies, ADAC.
 *
 * DC (0.95): connector → battery. Small cable + battery acceptance losses.
 *   Excludes the station's own AC→DC conversion loss (~5%) — the operator
 *   eats that, not the user. Previously 0.93 conflated the two.
 */
export const EFF = { ac: 0.90, dc: 0.95 };
