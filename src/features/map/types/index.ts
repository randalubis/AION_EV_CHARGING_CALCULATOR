// Charging Station Map Types

// Re-export base types
export type { ConnectorType, AmenityType } from './base';

export interface ChargingStation {
  id: string;
  name: string;
  operator: string; // e.g., 'PLN', 'Shell Recharge', 'Voltron', etc.
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  province: string;
  status: 'active' | 'inactive' | 'maintenance' | 'unknown';
  connectors: Connector[];
  amenities: import('./base').AmenityType[];
  operatingHours: string;
  pricing?: {
    ratePerKwh: number;
    currency: string;
    notes?: string;
  };
  lastUpdated: string;
  // Computed field for distance from user
  distance?: number;
}

export interface Connector {
  id: string;
  type: import('./base').ConnectorType;
  powerKw: number;
  currentType: 'AC' | 'DC';
  status: 'available' | 'occupied' | 'offline' | 'maintenance' | 'unknown';
  count?: number;
  pricePerKwh?: number;
}

export interface Amenity {
  type: import('./base').AmenityType;
  name?: string;
}

export interface MapFilters {
  connectorTypes: import('./base').ConnectorType[];
  minPowerKw: number;
  operators: string[];
  status: ('active' | 'maintenance')[];
  amenities: import('./base').AmenityType[];
}

export interface MapViewport {
  center: [number, number]; // [lat, lng]
  zoom: number;
}

// Search result type
export interface SearchResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // in km
}

// Re-export all submission types
export * from './submission';
