// Charging Station Map Types

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
  amenities: AmenityType[];
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

export type AmenityType = 'restroom' | 'cafe' | 'restaurant' | 'wifi' | 'parking' | 'mosque' | 'convenience_store' | 'atm';

export interface Connector {
  id: string;
  type: ConnectorType;
  powerKw: number;
  currentType: 'AC' | 'DC';
  status: 'available' | 'occupied' | 'offline' | 'maintenance';
  pricePerKwh?: number;
}

export type ConnectorType = 
  | 'type2'           // IEC 62196-2 (Mennekes) - AC
  | 'ccs2'            // CCS Combo 2 - DC
  | 'chademo'         // CHAdeMO - DC
  | 'gb/t'            // GB/T standard (Chinese EVs)
  | 'tesla_supercharger' // Tesla Supercharger
  | 'tesla_destination'; // Tesla Destination

export interface Amenity {
  type: AmenityType;
  name?: string;
}

export interface MapFilters {
  connectorTypes: ConnectorType[];
  minPowerKw: number;
  operators: string[];
  status: ('active' | 'maintenance')[];
  amenities: AmenityType[];
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

// Re-export submission types (excluding types that would conflict)
export type { 
  StationSubmission, 
  ConnectorSubmission,
  SubmissionStatus,
  StationSubmissionFormData,
  GoogleSheetsRow,
  PhotoUpload
} from './submission';
