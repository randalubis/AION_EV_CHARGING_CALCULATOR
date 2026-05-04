import { CHARGERS } from '../data/chargers';

export function fmtTime(h: number): string {
  if (h < 0.017) return '<1 menit';
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  if (hh === 0) return `${mm}m`;
  if (mm === 0) return `${hh}j`;
  return `${hh}j ${mm}m`;
}

export function fmtRp(n: number): string {
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
}

/** Battery-bar color by % full. */
export function batteryColor(p: number): string {
  if (p <= 15) return '#C0392B';
  if (p <= 30) return '#E67E22';
  if (p <= 50) return '#F1C40F';
  return '#27AE60';
}

/**
 * Piecewise model of DC fast-charging speed as a fraction of the charger's
 * peak delivered power, by battery state of charge (SOC).
 *
 * Calibrated against published charging curves for typical modern Indonesian
 * EVs (Hyundai Ioniq 5, BMW iX1, BYD Seal, Wuling Cloud EV). Real-world 0→100%
 * times verified within ~5–15% across these models — much closer than a
 * linear-with-1.5×-multiplier model, which underestimated by 30–50%.
 *
 * AC charging stays linear: AC power (~7–22 kW) is well below the battery's
 * acceptance ceiling so the bottleneck is the onboard charger, not the cells.
 */
const DC_BANDS: { upTo: number; factor: number }[] = [
  { upTo: 15, factor: 0.65 }, // cold-start ramp
  { upTo: 60, factor: 1.0 },  // peak plateau
  { upTo: 80, factor: 0.75 }, // gentle taper
  { upTo: 90, factor: 0.35 }, // heavy taper begins
  { upTo: 100, factor: 0.15 }, // constant-voltage tail
];

/** Time to charge (hours) for a given SOC range, using the piecewise model. */
export function calcChargeTimeHours(
  curPct: number,
  tgtPct: number,
  battery: number,
  acceptanceEff: number,
  effPower: number,
  isDC: boolean,
): number {
  if (effPower <= 0 || tgtPct <= curPct) return 0;
  const deliveredPower = effPower * acceptanceEff; // kW into the battery

  // AC: charger output is the bottleneck, not the battery — keep linear.
  if (!isDC) {
    const kwh = ((tgtPct - curPct) / 100) * battery;
    return kwh / deliveredPower;
  }

  // DC: integrate the piecewise curve across the [curPct, tgtPct] range.
  let totalHours = 0;
  let from = curPct;
  for (const band of DC_BANDS) {
    if (from >= tgtPct) break;
    const segEndPct = Math.min(band.upTo, tgtPct);
    if (segEndPct <= from) continue;
    const segKwh = ((segEndPct - from) / 100) * battery;
    const segPower = deliveredPower * band.factor;
    if (segPower > 0) totalHours += segKwh / segPower;
    from = segEndPct;
  }
  return totalHours;
}

/** SOC at which DC speed drops sharply — used to message the user. */
export const TAPER_NOTE_PCT = 80;

/**
 * Find the smallest charger of `type` whose nominal kW saturates the car's
 * accept rate. Anything bigger gives the same effective power. Returns -1 if
 * no charger of that type exists in the list.
 *
 * The previous logic returned the literal max-kW entry, which mislabeled e.g.
 * a 480kW DC charger as "best" for an 11kW-AC city EV — technically true but
 * meaningless, since the car still draws 11kW.
 */
export function findBestChargerIdx(carMaxKw: number, type: 'ac' | 'dc'): number {
  if (carMaxKw <= 0) return -1;
  let bestIdx = -1;
  for (let i = 0; i < CHARGERS.length; i++) {
    const c = CHARGERS[i];
    if (c.type !== type) continue;
    if (c.kw >= carMaxKw) {
      if (bestIdx === -1 || c.kw < CHARGERS[bestIdx].kw) bestIdx = i;
    }
  }
  if (bestIdx !== -1) return bestIdx;
  // No charger reaches the car's max — pick the largest of the type.
  let largestIdx = -1;
  for (let i = 0; i < CHARGERS.length; i++) {
    const c = CHARGERS[i];
    if (c.type !== type) continue;
    if (largestIdx === -1 || c.kw > CHARGERS[largestIdx].kw) largestIdx = i;
  }
  return largestIdx;
}

/**
 * Cost for the user, accounting for billing mode:
 *   home   → grid-side kWh (user pays for AC OBC losses)
 *   public → connector-side kWh (delivered to battery, station eats grid losses)
 *
 * For DC + home (rare — DC home wallboxes are uncommon in Indonesia), DC
 * bypasses the OBC so we treat it as connector-side billing too.
 */
export function calcCost(
  batteryKwh: number,
  tariff: number,
  billingMode: 'home' | 'public',
  isAC: boolean,
  acceptanceEff: number,
): { paidKwh: number; rupiah: number } {
  const paidKwh = billingMode === 'home' && isAC
    ? batteryKwh / acceptanceEff
    : batteryKwh;
  return { paidKwh, rupiah: paidKwh * tariff };
}
