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

// DC fast-charging tapers above ~80% to protect cells. Approximate the slow-down
// as a multiplier on time-per-kWh in the >80% region. AC charging stays linear
// since the bottleneck is the AC charger power, not battery acceptance.
export const TAPER_START_PCT = 80;
export const TAPER_MULTIPLIER = 1.5;

export function calcChargeTimeHours(
  curPct: number,
  tgtPct: number,
  battery: number,
  eff: number,
  effPower: number,
  isDC: boolean,
): number {
  if (effPower <= 0 || tgtPct <= curPct) return 0;
  const linearTime = (kwh: number) => kwh / eff / effPower;

  if (!isDC || tgtPct <= TAPER_START_PCT) {
    const kwh = ((tgtPct - curPct) / 100) * battery;
    return linearTime(kwh);
  }
  if (curPct >= TAPER_START_PCT) {
    const kwh = ((tgtPct - curPct) / 100) * battery;
    return linearTime(kwh) * TAPER_MULTIPLIER;
  }
  const fastKwh = ((TAPER_START_PCT - curPct) / 100) * battery;
  const taperedKwh = ((tgtPct - TAPER_START_PCT) / 100) * battery;
  return linearTime(fastKwh) + linearTime(taperedKwh) * TAPER_MULTIPLIER;
}

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
