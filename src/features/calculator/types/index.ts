// Calculator Feature Types

export interface Brand {
  id: string;
  name: string;
  short: string;
}

export interface Car {
  id: string;
  brand: string;
  series: string;
  variant: string;
  badge: string;
  battery: number;
  maxRange: number;
  maxDcKw: number;
  maxAcKw: number;
}

export interface Charger {
  label: string;
  kw: number;
  type: 'ac' | 'dc';
}

export interface Tariff {
  label: string;
  val: number;
  desc: string;
}

export interface CalculationResult {
  gridKwh: number;
  needBat: number;
  timeH: number;
  cost: number;
  rangeAdded: number;
  tgtRange: number;
  effPct: number;
  lossPct: number;
  effPwr: number;
  isAC: boolean;
}

export type InputMode = 'pct' | 'range';
