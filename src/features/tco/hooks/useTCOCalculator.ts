// TCO Calculator Hook
// Manages state, URL deep linking, and localStorage persistence.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { EVVehicle, ICEVehicle, TCOInputs, TCOResult } from '../types';
import { calculateTCO } from '../utils/calculations';
import { getEVVehicleById } from '../data/evVehicles';
import { getICEVehicleById } from '../data/iceVehicles';

const STORAGE_KEY = 'evhub:tco:v1';

const DEFAULT_INPUTS: TCOInputs = {
  evVehicleId: null,
  iceVehicleId: null,
  annualKm: 15000,
  ownershipYears: 5,
  electricityRateCategory: 'pln_r1',
  homeChargingPercentage: 80,
  publicChargingPercentage: 20,
  insuranceType: 'comprehensive',
  includeTax: true,
  region: 'jakarta',
};

type ElectricityRate = TCOInputs['electricityRateCategory'];
type Region = TCOInputs['region'];
type InsuranceType = 'comprehensive' | 'tlo';

const ELECTRICITY_RATES: ElectricityRate[] = ['pln_r1', 'pln_r2', 'pln_r3', 'public'];
const REGIONS: Region[] = ['jakarta', 'tangsel', 'bandung', 'surabaya'];
const INSURANCE_TYPES: InsuranceType[] = ['comprehensive', 'tlo'];

interface PersistedState {
  evVehicleId?: string | null;
  iceVehicleId?: string | null;
  annualKm?: number;
  ownershipYears?: number;
  electricityRateCategory?: ElectricityRate;
  homeChargingPercentage?: number;
  insuranceType?: InsuranceType;
  includeTax?: boolean;
  region?: Region;
}

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : {};
  } catch {
    return {};
  }
}

function savePersisted(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private browsing, full quota — silently ignore */
  }
}

function readNumberParam(params: URLSearchParams, key: string): number | null {
  const v = params.get(key);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function readEnumParam<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[]): T | null {
  const v = params.get(key);
  return v !== null && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

function resolveInitialInputs(searchParams: URLSearchParams): TCOInputs {
  const persisted = loadPersisted();

  const evFromUrl = searchParams.get('ev');
  const iceFromUrl = searchParams.get('ice');
  const evVehicleId = (evFromUrl && getEVVehicleById(evFromUrl)) ? evFromUrl
    : (persisted.evVehicleId && getEVVehicleById(persisted.evVehicleId)) ? persisted.evVehicleId
    : null;
  const iceVehicleId = (iceFromUrl && getICEVehicleById(iceFromUrl)) ? iceFromUrl
    : (persisted.iceVehicleId && getICEVehicleById(persisted.iceVehicleId)) ? persisted.iceVehicleId
    : null;

  const annualKm = readNumberParam(searchParams, 'km') ?? persisted.annualKm ?? DEFAULT_INPUTS.annualKm;
  const ownershipYears = readNumberParam(searchParams, 'yrs') ?? persisted.ownershipYears ?? DEFAULT_INPUTS.ownershipYears;
  const homePctRaw = readNumberParam(searchParams, 'home') ?? persisted.homeChargingPercentage ?? DEFAULT_INPUTS.homeChargingPercentage;
  const homeChargingPercentage = Math.max(0, Math.min(100, homePctRaw));

  const electricityRateCategory = readEnumParam(searchParams, 'rate', ELECTRICITY_RATES)
    ?? (persisted.electricityRateCategory && ELECTRICITY_RATES.includes(persisted.electricityRateCategory) ? persisted.electricityRateCategory : null)
    ?? DEFAULT_INPUTS.electricityRateCategory;

  const insuranceType = readEnumParam(searchParams, 'ins', INSURANCE_TYPES)
    ?? (persisted.insuranceType && INSURANCE_TYPES.includes(persisted.insuranceType) ? persisted.insuranceType : null)
    ?? DEFAULT_INPUTS.insuranceType;

  const region = readEnumParam(searchParams, 'reg', REGIONS)
    ?? (persisted.region && REGIONS.includes(persisted.region) ? persisted.region : null)
    ?? DEFAULT_INPUTS.region;

  const taxFromUrl = searchParams.get('tax');
  const includeTax = taxFromUrl !== null
    ? taxFromUrl === '1'
    : persisted.includeTax ?? DEFAULT_INPUTS.includeTax;

  return {
    evVehicleId,
    iceVehicleId,
    annualKm,
    ownershipYears,
    electricityRateCategory,
    homeChargingPercentage,
    publicChargingPercentage: 100 - homeChargingPercentage,
    insuranceType,
    includeTax,
    region,
  };
}

interface UseTCOCalculatorReturn {
  inputs: TCOInputs;
  result: TCOResult | null;
  evVehicle: EVVehicle | null;
  iceVehicle: ICEVehicle | null;

  setEVVehicle: (id: string | null) => void;
  setICEVehicle: (id: string | null) => void;
  setAnnualKm: (km: number) => void;
  setOwnershipYears: (years: number) => void;
  setElectricityRateCategory: (category: ElectricityRate) => void;
  setHomeChargingPercentage: (percentage: number) => void;
  setInsuranceType: (type: InsuranceType) => void;
  setIncludeTax: (include: boolean) => void;
  setRegion: (region: Region) => void;
  resetToDefaults: () => void;

  isValid: boolean;
  canCalculate: boolean;
}

export function useTCOCalculator(): UseTCOCalculatorReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Resolve once on mount: URL → localStorage → defaults.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initial = useMemo(() => resolveInitialInputs(searchParams), []);
  const [inputs, setInputs] = useState<TCOInputs>(initial);

  const evVehicle = useMemo(
    () => (inputs.evVehicleId ? getEVVehicleById(inputs.evVehicleId) ?? null : null),
    [inputs.evVehicleId],
  );

  const iceVehicle = useMemo(
    () => (inputs.iceVehicleId ? getICEVehicleById(inputs.iceVehicleId) ?? null : null),
    [inputs.iceVehicleId],
  );

  const result = useMemo<TCOResult | null>(() => {
    if (!evVehicle || !iceVehicle) return null;
    try {
      return calculateTCO({
        ev: evVehicle,
        ice: iceVehicle,
        annualKm: inputs.annualKm,
        ownershipYears: inputs.ownershipYears,
        electricityRateCategory: inputs.electricityRateCategory,
        homeChargingPercentage: inputs.homeChargingPercentage,
        insuranceType: inputs.insuranceType,
        includeTax: inputs.includeTax,
        region: inputs.region,
      });
    } catch (err) {
      console.error('TCO calculation error:', err);
      return null;
    }
  }, [evVehicle, iceVehicle, inputs]);

  const isValid = useMemo(
    () =>
      inputs.annualKm > 0 &&
      inputs.ownershipYears >= 1 &&
      inputs.ownershipYears <= 20 &&
      inputs.homeChargingPercentage >= 0 &&
      inputs.homeChargingPercentage <= 100,
    [inputs],
  );

  const canCalculate = useMemo(
    () => isValid && evVehicle !== null && iceVehicle !== null,
    [isValid, evVehicle, iceVehicle],
  );

  // Persist preferences (everything except publicChargingPercentage which is derived).
  useEffect(() => {
    savePersisted({
      evVehicleId: inputs.evVehicleId,
      iceVehicleId: inputs.iceVehicleId,
      annualKm: inputs.annualKm,
      ownershipYears: inputs.ownershipYears,
      electricityRateCategory: inputs.electricityRateCategory,
      homeChargingPercentage: inputs.homeChargingPercentage,
      insuranceType: inputs.insuranceType,
      includeTax: inputs.includeTax,
      region: inputs.region,
    });
  }, [inputs]);

  // Reflect state in URL params so links are shareable + back/forward stays sane.
  useEffect(() => {
    const next = new URLSearchParams();
    if (inputs.evVehicleId) next.set('ev', inputs.evVehicleId);
    if (inputs.iceVehicleId) next.set('ice', inputs.iceVehicleId);
    next.set('km', String(inputs.annualKm));
    next.set('yrs', String(inputs.ownershipYears));
    next.set('rate', inputs.electricityRateCategory);
    next.set('home', String(inputs.homeChargingPercentage));
    next.set('ins', inputs.insuranceType);
    next.set('tax', inputs.includeTax ? '1' : '0');
    next.set('reg', inputs.region);
    setSearchParams(next, { replace: true });
  }, [inputs, setSearchParams]);

  // Setters
  const setEVVehicle = useCallback((id: string | null) => {
    setInputs((prev) => ({ ...prev, evVehicleId: id }));
  }, []);

  const setICEVehicle = useCallback((id: string | null) => {
    setInputs((prev) => ({ ...prev, iceVehicleId: id }));
  }, []);

  const setAnnualKm = useCallback((km: number) => {
    setInputs((prev) => ({ ...prev, annualKm: Math.max(0, km) }));
  }, []);

  const setOwnershipYears = useCallback((years: number) => {
    setInputs((prev) => ({ ...prev, ownershipYears: Math.max(1, Math.min(20, years)) }));
  }, []);

  const setElectricityRateCategory = useCallback((category: ElectricityRate) => {
    setInputs((prev) => ({ ...prev, electricityRateCategory: category }));
  }, []);

  const setHomeChargingPercentage = useCallback((percentage: number) => {
    const clamped = Math.max(0, Math.min(100, percentage));
    setInputs((prev) => ({
      ...prev,
      homeChargingPercentage: clamped,
      publicChargingPercentage: 100 - clamped,
    }));
  }, []);

  const setInsuranceType = useCallback((type: InsuranceType) => {
    setInputs((prev) => ({ ...prev, insuranceType: type }));
  }, []);

  const setIncludeTax = useCallback((include: boolean) => {
    setInputs((prev) => ({ ...prev, includeTax: include }));
  }, []);

  const setRegion = useCallback((region: Region) => {
    setInputs((prev) => ({ ...prev, region }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  return {
    inputs,
    result,
    evVehicle,
    iceVehicle,
    setEVVehicle,
    setICEVehicle,
    setAnnualKm,
    setOwnershipYears,
    setElectricityRateCategory,
    setHomeChargingPercentage,
    setInsuranceType,
    setIncludeTax,
    setRegion,
    resetToDefaults,
    isValid,
    canCalculate,
  };
}
