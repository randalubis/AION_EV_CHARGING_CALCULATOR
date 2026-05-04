/**
 * billingMode determines what the user actually pays for:
 *   'home'   → grid-side kWh (PLN home meter sees grid input; user pays for
 *              AC onboard-charger conversion loss too — about 10% extra)
 *   'public' → connector-side kWh (SPKLU operators bill on what's delivered
 *              to the car; station eats its own grid-side losses)
 */
export interface Tariff {
  label: string;
  val: number;
  desc: string;
  billingMode: 'home' | 'public';
}

export const TARIFFS: Tariff[] = [
  { label: 'PLN R1', val: 1444, desc: 'Rumah daya ≤ 3.500 VA', billingMode: 'home' },
  { label: 'PLN R2', val: 2076, desc: 'Rumah daya 3.500–6.600 VA', billingMode: 'home' },
  { label: 'PLN R3', val: 2654, desc: 'Rumah daya > 6.600 VA', billingMode: 'home' },
  { label: 'Umum', val: 3000, desc: 'Tarif SPKLU publik (per kWh ke baterai)', billingMode: 'public' },
];
