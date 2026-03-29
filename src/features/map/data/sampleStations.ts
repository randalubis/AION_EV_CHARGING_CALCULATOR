// Sample Charging Station Data for Indonesia
// This is a starting dataset - in production, this should come from an API

import type { ChargingStation } from '../types';

export const SAMPLE_STATIONS: ChargingStation[] = [
  // Jakarta Area
  {
    id: 'jkt-001',
    name: 'SPKLU PLN UID Jakarta',
    operator: 'PLN',
    latitude: -6.2088,
    longitude: 106.8456,
    address: 'Jl. Trunojoyo Blok M No.135, Kebayoran Baru',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 50, currentType: 'DC', status: 'available', pricePerKwh: 3000 },
      { id: 'c2', type: 'ccs2', powerKw: 50, currentType: 'DC', status: 'occupied', pricePerKwh: 3000 },
      { id: 'c3', type: 'type2', powerKw: 22, currentType: 'AC', status: 'available', pricePerKwh: 3000 },
    ],
    amenities: ['restroom', 'mosque', 'parking'],
    operatingHours: '24 Jam',
    pricing: { ratePerKwh: 3000, currency: 'IDR', notes: 'Tarif flat PLN' },
    lastUpdated: '2025-01-15',
  },
  {
    id: 'jkt-002',
    name: 'Shell Recharge - Shell Sudirman',
    operator: 'Shell',
    latitude: -6.225,
    longitude: 106.8087,
    address: 'Jl. Jenderal Sudirman Kav. 52-53, SCBD',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 180, currentType: 'DC', status: 'available', pricePerKwh: 4500 },
      { id: 'c2', type: 'ccs2', powerKw: 180, currentType: 'DC', status: 'available', pricePerKwh: 4500 },
      { id: 'c3', type: 'chademo', powerKw: 50, currentType: 'DC', status: 'available', pricePerKwh: 4500 },
    ],
    amenities: ['restroom', 'cafe', 'convenience_store', 'atm'],
    operatingHours: '24 Jam',
    pricing: { ratePerKwh: 4500, currency: 'IDR', notes: 'Harga promo' },
    lastUpdated: '2025-01-20',
  },
  {
    id: 'jkt-003',
    name: 'Voltron Charging Station - Pacific Place',
    operator: 'Voltron',
    latitude: -6.224,
    longitude: 106.808,
    address: 'Pacific Place Mall, Lt. B1',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 60, currentType: 'DC', status: 'occupied', pricePerKwh: 3500 },
      { id: 'c2', type: 'type2', powerKw: 22, currentType: 'AC', status: 'available', pricePerKwh: 2500 },
    ],
    amenities: ['restroom', 'wifi', 'parking'],
    operatingHours: '10:00 - 22:00',
    pricing: { ratePerKwh: 3000, currency: 'IDR' },
    lastUpdated: '2025-01-18',
  },
  {
    id: 'jkt-004',
    name: 'Hyundai Charging Station - Jakarta Utara',
    operator: 'Hyundai',
    latitude: -6.1214,
    longitude: 106.7741,
    address: 'Jl. Pluit Selatan Raya No.1, Penjaringan',
    city: 'Jakarta Utara',
    province: 'DKI Jakarta',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 350, currentType: 'DC', status: 'available', pricePerKwh: 5000 },
      { id: 'c2', type: 'ccs2', powerKw: 350, currentType: 'DC', status: 'available', pricePerKwh: 5000 },
    ],
    amenities: ['restroom', 'cafe', 'wifi', 'parking'],
    operatingHours: '08:00 - 20:00',
    pricing: { ratePerKwh: 5000, currency: 'IDR', notes: 'Ultra-fast charging' },
    lastUpdated: '2025-01-22',
  },
  {
    id: 'jkt-005',
    name: 'SPKLU Rest Area KM 19 Tol Jagorawi',
    operator: 'PLN',
    latitude: -6.4044,
    longitude: 106.8186,
    address: 'Rest Area KM 19 Tol Jagorawi, Ciawi',
    city: 'Bogor',
    province: 'Jawa Barat',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 50, currentType: 'DC', status: 'available', pricePerKwh: 3000 },
      { id: 'c2', type: 'chademo', powerKw: 50, currentType: 'DC', status: 'available', pricePerKwh: 3000 },
      { id: 'c3', type: 'type2', powerKw: 22, currentType: 'AC', status: 'available', pricePerKwh: 3000 },
    ],
    amenities: ['restroom', 'mosque', 'restaurant', 'parking'],
    operatingHours: '24 Jam',
    pricing: { ratePerKwh: 3000, currency: 'IDR' },
    lastUpdated: '2025-01-10',
  },
  // Bandung Area
  {
    id: 'bdg-001',
    name: 'SPKLU PLN Bandung',
    operator: 'PLN',
    latitude: -6.9147,
    longitude: 107.6098,
    address: 'Jl. Asia Afrika No.129, Braga',
    city: 'Bandung',
    province: 'Jawa Barat',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 50, currentType: 'DC', status: 'available', pricePerKwh: 3000 },
      { id: 'c2', type: 'type2', powerKw: 22, currentType: 'AC', status: 'occupied', pricePerKwh: 3000 },
    ],
    amenities: ['restroom', 'mosque', 'parking'],
    operatingHours: '24 Jam',
    pricing: { ratePerKwh: 3000, currency: 'IDR' },
    lastUpdated: '2025-01-12',
  },
  {
    id: 'bdg-002',
    name: 'Charge+ - Paris Van Java',
    operator: 'Charge+',
    latitude: -6.8892,
    longitude: 107.5969,
    address: 'Paris Van Java Mall, Lt. P3',
    city: 'Bandung',
    province: 'Jawa Barat',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 60, currentType: 'DC', status: 'available', pricePerKwh: 4000 },
      { id: 'c2', type: 'type2', powerKw: 22, currentType: 'AC', status: 'available', pricePerKwh: 3000 },
      { id: 'c3', type: 'type2', powerKw: 22, currentType: 'AC', status: 'available', pricePerKwh: 3000 },
    ],
    amenities: ['restroom', 'wifi', 'parking', 'convenience_store'],
    operatingHours: '10:00 - 22:00',
    pricing: { ratePerKwh: 3500, currency: 'IDR' },
    lastUpdated: '2025-01-19',
  },
  // Surabaya Area
  {
    id: 'sby-001',
    name: 'SPKLU PLN Surabaya',
    operator: 'PLN',
    latitude: -7.2575,
    longitude: 112.7521,
    address: 'Jl. Pemuda No.1, Embong Kaliasin',
    city: 'Surabaya',
    province: 'Jawa Timur',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 50, currentType: 'DC', status: 'available', pricePerKwh: 3000 },
      { id: 'c2', type: 'chademo', powerKw: 50, currentType: 'DC', status: 'available', pricePerKwh: 3000 },
    ],
    amenities: ['restroom', 'mosque', 'parking'],
    operatingHours: '24 Jam',
    pricing: { ratePerKwh: 3000, currency: 'IDR' },
    lastUpdated: '2025-01-14',
  },
  {
    id: 'sby-002',
    name: 'Tesla Supercharger - Surabaya',
    operator: 'Tesla',
    latitude: -7.2915,
    longitude: 112.7688,
    address: 'Pakuwon Mall, Lt. B2',
    city: 'Surabaya',
    province: 'Jawa Timur',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 250, currentType: 'DC', status: 'available', pricePerKwh: 5500 },
      { id: 'c2', type: 'ccs2', powerKw: 250, currentType: 'DC', status: 'available', pricePerKwh: 5500 },
      { id: 'c3', type: 'ccs2', powerKw: 250, currentType: 'DC', status: 'available', pricePerKwh: 5500 },
      { id: 'c4', type: 'ccs2', powerKw: 250, currentType: 'DC', status: 'available', pricePerKwh: 5500 },
    ],
    amenities: ['restroom', 'wifi', 'parking', 'convenience_store'],
    operatingHours: '10:00 - 22:00',
    pricing: { ratePerKwh: 5500, currency: 'IDR', notes: 'Tesla vehicles priority' },
    lastUpdated: '2025-01-21',
  },
  // Bali
  {
    id: 'bali-001',
    name: 'Bali EV Charging - Seminyak',
    operator: 'Bali EV',
    latitude: -8.6901,
    longitude: 115.166,
    address: 'Jl. Kayu Aya No.58, Seminyak',
    city: 'Badung',
    province: 'Bali',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'type2', powerKw: 22, currentType: 'AC', status: 'available', pricePerKwh: 4000 },
      { id: 'c2', type: 'ccs2', powerKw: 50, currentType: 'DC', status: 'available', pricePerKwh: 5000 },
    ],
    amenities: ['restroom', 'cafe', 'wifi', 'parking'],
    operatingHours: '08:00 - 22:00',
    pricing: { ratePerKwh: 4500, currency: 'IDR' },
    lastUpdated: '2025-01-16',
  },
  // Makassar
  {
    id: 'mks-001',
    name: 'SPKLU PLN Makassar',
    operator: 'PLN',
    latitude: -5.1477,
    longitude: 119.4327,
    address: 'Jl. Jenderal Sudirman No.32, Mariso',
    city: 'Makassar',
    province: 'Sulawesi Selatan',
    status: 'active',
    connectors: [
      { id: 'c1', type: 'ccs2', powerKw: 50, currentType: 'DC', status: 'available', pricePerKwh: 3000 },
      { id: 'c2', type: 'type2', powerKw: 22, currentType: 'AC', status: 'maintenance', pricePerKwh: 3000 },
    ],
    amenities: ['restroom', 'mosque', 'parking'],
    operatingHours: '24 Jam',
    pricing: { ratePerKwh: 3000, currency: 'IDR' },
    lastUpdated: '2025-01-17',
  },
];

// Helper functions
export function getStationsByCity(city: string): ChargingStation[] {
  return SAMPLE_STATIONS.filter(s => 
    s.city.toLowerCase().includes(city.toLowerCase())
  );
}

export function getStationsByOperator(operator: string): ChargingStation[] {
  return SAMPLE_STATIONS.filter(s => 
    s.operator.toLowerCase() === operator.toLowerCase()
  );
}

export function getStationsByConnectorType(type: string): ChargingStation[] {
  return SAMPLE_STATIONS.filter(s => 
    s.connectors.some(c => c.type === type)
  );
}

export function getAllOperators(): string[] {
  return [...new Set(SAMPLE_STATIONS.map(s => s.operator))].sort();
}

export function getAllCities(): string[] {
  return [...new Set(SAMPLE_STATIONS.map(s => s.city))].sort();
}

export function getStationById(id: string): ChargingStation | undefined {
  return SAMPLE_STATIONS.find(s => s.id === id);
}

// Calculate distance between two coordinates in km
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}
