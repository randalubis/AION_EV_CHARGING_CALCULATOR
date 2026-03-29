import { X, MapPin, Clock, Navigation, Zap, DollarSign, Phone } from 'lucide-react';
import type { ChargingStation } from '../types';

interface StationDetailProps {
  station: ChargingStation;
  onClose: () => void;
  distance?: number;
}

export function StationDetail({ station, onClose, distance }: StationDetailProps) {
  // Group connectors by type
  const connectorsByType = station.connectors.reduce((acc, connector) => {
    if (!acc[connector.type]) acc[connector.type] = [];
    acc[connector.type].push(connector);
    return acc;
  }, {} as Record<string, typeof station.connectors>);

  return (
    <div className="bg-forest-dark rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">{station.name}</h2>
            <p className="text-[#FFC300] text-sm">{station.operator}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-white/50 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm">{station.address}</p>
            <p className="text-white/50 text-xs">{station.city}, {station.province}</p>
            {distance !== undefined && (
              <p className="text-[#FFC300] text-xs mt-1">{distance} km dari lokasi Anda</p>
            )}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-white/50 flex-shrink-0" />
          <div>
            <p className="text-white/50 text-xs">Jam Operasional</p>
            <p className="text-white text-sm">{station.operatingHours}</p>
          </div>
        </div>

        {/* Pricing */}
        {station.pricing && (
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-white/50 flex-shrink-0" />
            <div>
              <p className="text-white/50 text-xs">Harga</p>
              <p className="text-white text-sm">
                Rp {station.pricing.ratePerKwh.toLocaleString('id-ID')}/kWh
                {station.pricing.notes && (
                  <span className="text-white/50 text-xs block">{station.pricing.notes}</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Connectors */}
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Connector Tersedia</p>
          <div className="space-y-2">
            {Object.entries(connectorsByType).map(([type, connectors]) => (
              <div key={type} className="bg-forest-mid/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{getConnectorLabel(type)}</span>
                  <span className="text-white/50 text-xs">{connectors.length} unit</span>
                </div>
                <div className="space-y-1">
                  {connectors.map(connector => (
                    <div 
                      key={connector.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-white/30" />
                        <span className="text-white/70">{connector.powerKw} kW</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white/50">{connector.currentType}</span>
                      </div>
                      <span className={getStatusColor(connector.status)}>
                        {getStatusLabel(connector.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        {station.amenities.length > 0 && (
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Fasilitas</p>
            <div className="flex flex-wrap gap-2">
              {station.amenities.map(amenity => (
                <span
                  key={amenity.type}
                  className="px-3 py-1 bg-forest-mid text-white/70 text-xs rounded-full"
                >
                  {getAmenityLabel(amenity.type)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <p className="text-white/30 text-xs text-center">
          Data terakhir diperbarui: {new Date(station.lastUpdated).toLocaleDateString('id-ID')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
            window.open(url, '_blank');
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#FFC300] text-forest-dark font-semibold py-3 rounded-lg hover:bg-[#FFD60A] transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Navigasi ke Lokasi
        </button>
      </div>
    </div>
  );
}

function getConnectorLabel(type: string): string {
  const labels: Record<string, string> = {
    'type2': 'Type 2 (AC)',
    'ccs2': 'CCS2 (DC Fast Charging)',
    'chademo': 'CHAdeMO (DC)',
    'gb/t': 'GB/T (China Standard)',
    'tesla_supercharger': 'Tesla Supercharger',
    'tesla_destination': 'Tesla Destination',
  };
  return labels[type] || type;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'available': 'text-[#27AE60]',
    'occupied': 'text-[#E67E22]',
    'offline': 'text-[#E74C3C]',
    'maintenance': 'text-[#95A5A6]',
  };
  return colors[status] || 'text-white/50';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'available': 'Tersedia',
    'occupied': 'Terisi',
    'offline': 'Offline',
    'maintenance': 'Perawatan',
  };
  return labels[status] || status;
}

function getAmenityLabel(type: string): string {
  const labels: Record<string, string> = {
    'restroom': 'Toilet',
    'cafe': 'Kafe',
    'restaurant': 'Restoran',
    'wifi': 'WiFi',
    'parking': 'Parkir',
    'mosque': 'Mushola',
    'convenience_store': 'Minimarket',
    'atm': 'ATM',
  };
  return labels[type] || type;
}
