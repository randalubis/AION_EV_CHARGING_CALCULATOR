// Crowdsourced Station Submission Types

import type { ConnectorType, AmenityType } from './base';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ConnectorSubmission {
  id: string;
  type: ConnectorType;
  powerKw: number;
  currentType: 'AC' | 'DC';
  count: number;
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
  pricing: number | null;
  operatingHours: string;
  notes: string;
}
