// TCO Calculator Hook
// Manages state and calculations for the TCO calculator

import { useState, useMemo, useCallback } from 'react';
import type { EVVehicle, ICEVehicle, TCOInputs, TCOResult } from '../types';
import { calculateTCO } from '../utils/calculations';
import { getEVVehicleById } from '../data/evVehicles';
import { getICEVehicleById } from '../data/iceVehicles';

// Default input values
const DEFAULT_INPUTS: TCOInputs = {
  evVehicleId: null,
  iceVehicleId: null,
  annualKm: 15000,              // 15,000 km/year (average)
  ownershipYears: 5,            // 5 years
  electricityRateCategory: 'pln_r1',
  homeChargingPercentage: 80,   // 80% home charging
  publicChargingPercentage: 20, // 20% public charging
  insuranceType: 'comprehensive',
  includeTax: true,
  region: 'jakarta',
};

interface UseTCOCalculatorReturn {
  // State
  inputs: TCOInputs;
  result: TCOResult | null;
  
  // Selected vehicles
  evVehicle: EVVehicle | null;
  iceVehicle: ICEVehicle | null;
  
  // Actions
  setEVVehicle: (id: string | null) => void;
  setICEVehicle: (id: string | null) => void;
  setAnnualKm: (km: number) => void;
  setOwnershipYears: (years: number) => void;
  setElectricityRateCategory: (category: TCOInputs['electricityRateCategory']) => void;
  setHomeChargingPercentage: (percentage: number) => void;
  setInsuranceType: (type: 'comprehensive' | 'tlo') => void;
  setIncludeTax: (include: boolean) => void;
  setRegion: (region: TCOInputs['region']) => void;
  resetToDefaults: () => void;
  
  // Validation
  isValid: boolean;
  canCalculate: boolean;
}

export function useTCOCalculator(): UseTCOCalculatorReturn {
  // State for user inputs
  const [inputs, setInputs] = useState<TCOInputs>(DEFAULT_INPUTS);
  
  // Get selected vehicles
  const evVehicle = useMemo(() => {
    return inputs.evVehicleId ? getEVVehicleById(inputs.evVehicleId) ?? null : null;
  }, [inputs.evVehicleId]);
  
  const iceVehicle = useMemo(() => {
    return inputs.iceVehicleId ? getICEVehicleById(inputs.iceVehicleId) ?? null : null;
  }, [inputs.iceVehicleId]);
  
  // Calculate TCO result when inputs change
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
        region: inputs.region,
      });
    } catch (error) {
      console.error('TCO calculation error:', error);
      return null;
    }
  }, [evVehicle, iceVehicle, inputs]);
  
  // Validation
  const isValid = useMemo(() => {
    return (
      inputs.annualKm > 0 &&
      inputs.ownershipYears >= 1 &&
      inputs.ownershipYears <= 10 &&
      inputs.homeChargingPercentage >= 0 &&
      inputs.homeChargingPercentage <= 100
    );
  }, [inputs]);
  
  const canCalculate = useMemo(() => {
    return isValid && evVehicle !== null && iceVehicle !== null;
  }, [isValid, evVehicle, iceVehicle]);
  
  // Action handlers
  const setEVVehicle = useCallback((id: string | null) => {
    setInputs(prev => ({ ...prev, evVehicleId: id }));
  }, []);
  
  const setICEVehicle = useCallback((id: string | null) => {
    setInputs(prev => ({ ...prev, iceVehicleId: id }));
  }, []);
  
  const setAnnualKm = useCallback((km: number) => {
    setInputs(prev => ({ ...prev, annualKm: Math.max(0, km) }));
  }, []);
  
  const setOwnershipYears = useCallback((years: number) => {
    setInputs(prev => ({ ...prev, ownershipYears: Math.max(1, Math.min(10, years)) }));
  }, []);
  
  const setElectricityRateCategory = useCallback((category: TCOInputs['electricityRateCategory']) => {
    setInputs(prev => ({ ...prev, electricityRateCategory: category }));
  }, []);
  
  const setHomeChargingPercentage = useCallback((percentage: number) => {
    const clamped = Math.max(0, Math.min(100, percentage));
    setInputs(prev => ({
      ...prev,
      homeChargingPercentage: clamped,
      publicChargingPercentage: 100 - clamped,
    }));
  }, []);
  
  const setInsuranceType = useCallback((type: 'comprehensive' | 'tlo') => {
    setInputs(prev => ({ ...prev, insuranceType: type }));
  }, []);
  
  const setIncludeTax = useCallback((include: boolean) => {
    setInputs(prev => ({ ...prev, includeTax: include }));
  }, []);
  
  const setRegion = useCallback((region: TCOInputs['region']) => {
    setInputs(prev => ({ ...prev, region: region }));
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
