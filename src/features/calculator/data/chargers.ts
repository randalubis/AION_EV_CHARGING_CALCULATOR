import { Charger } from '../types';

export const CHARGERS: Charger[] = [
  { label: "Home Charger (7.4 kW AC)", kw: 7.4, type: "ac" },
  { label: "Public AC (22 kW)", kw: 22, type: "ac" },
  { label: "Fast DC (60 kW)", kw: 60, type: "dc" },
  { label: "Rapid DC (100 kW)", kw: 100, type: "dc" },
  { label: "Rapid DC (120 kW)", kw: 120, type: "dc" },
  { label: "Ultra DC (180 kW)", kw: 180, type: "dc" },
  { label: "Ultra Fast DC (480 kW)", kw: 480, type: "dc" },
];

export const EFFICIENCY = { ac: 0.90, dc: 0.93 } as const;
