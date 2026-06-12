// Base types shared across map feature

export type ConnectorType = 
  | 'type2'           // IEC 62196-2 (Mennekes) - AC
  | 'ccs2'            // CCS Combo 2 - DC
  | 'chademo'         // CHAdeMO - DC
  | 'gb/t'            // GB/T standard (Chinese EVs)
  | 'tesla_supercharger' // Tesla Supercharger
  | 'tesla_destination'; // Tesla Destination

export type AmenityType = 'restroom' | 'cafe' | 'restaurant' | 'wifi' | 'parking' | 'mosque' | 'convenience_store' | 'atm';
