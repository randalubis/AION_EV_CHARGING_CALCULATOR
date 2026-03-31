// Crowdsourced Station Submission Types

// Use the same ConnectorType as the main types
export type ConnectorType = 'type2' | 'ccs2' | 'chademo' | 'gb/t' | 'tesla_supercharger' | 'tesla_destination';
export type AmenityType = 'restroom' | 'cafe' | 'restaurant' | 'wifi' | 'parking' | 'mosque' | 'convenience_store' | 'atm';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ConnectorSubmission {
  id: string;
  type: ConnectorType;
  powerKw: number | string;
  currentType: 'AC' | 'DC';
  count: number | string;
}

export interface StationSubmission {
  id: string;
  status: SubmissionStatus;
  submittedAt: string;
  submittedBy: {
    name: string;
    email: string;
    phone?: string;
  };
  
  // Station Details
  name: string;
  operator: string;
  operatorOther?: string;
  address: string;
  city: string;
  province: string;
  
  // Location
  latitude: number;
  longitude: number;
  locationSource: 'gps' | 'map_click' | 'manual';
  
  // Connectors
  connectors: ConnectorSubmission[];
  
  // Amenities
  amenities: AmenityType[];
  
  // Photos
  photos: string[];
  
  // Pricing (optional)
  pricing?: {
    ratePerKwh: number;
  };
  
  // Operating Hours
  operatingHours: string;
  
  // Notes from submitter
  notes?: string;
  
  // Admin fields
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

// Photo with preview URL
export interface PhotoUpload {
  file: File;
  previewUrl: string;
}

// Form data (before submission)
export interface StationSubmissionFormData {
  submittedBy: {
    name: string;
    email: string;
    phone: string;
  };
  name: string;
  operator: string;
  operatorOther: string;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  locationSource: 'gps' | 'map_click' | 'manual' | null;
  connectors: ConnectorSubmission[];
  amenities: AmenityType[];
  photos: PhotoUpload[];
  pricing: string;
  operatingHours: string;
  notes: string;
}

// Google Sheets row format
export interface GoogleSheetsRow {
  ID: string;
  Status: string;
  'Submitted At': string;
  'Submitter Name': string;
  'Submitter Email': string;
  'Submitter Phone': string;
  'Station Name': string;
  Operator: string;
  'Operator Other': string;
  Address: string;
  City: string;
  Province: string;
  Latitude: string;
  Longitude: string;
  'Location Source': string;
  Connectors: string; // JSON string
  Amenities: string; // Comma separated
  'Photo URLs': string; // Comma separated
  'Rate per kWh': string;
  'Operating Hours': string;
  'Submitter Notes': string;
  'Reviewed At': string;
  'Reviewed By': string;
  'Rejection Reason': string;
  'Admin Notes': string;
}
