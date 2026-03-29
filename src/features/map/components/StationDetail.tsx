import { X, MapPin, Clock, Navigation, Zap, DollarSign } from 'lucide-react';
import type { ChargingStation } from '../types';

interface StationDetailProps {
  station: ChargingStation;
  onClose: () => void;
  distance?: number;
}

export function StationDetail({ station, onClose, distance }: StationDetailProps) {
  const connectorsByType = station.connectors.reduce((acc, connector) => {
    if (!acc[connector.type]) acc[connector.type] = [];
    acc[connector.type].push(connector);
    return acc;
  }, {} as Record<string, typeof station.connectors>);

  return (
    <div className="bg-forest-dark rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-white font-semibold text-base truncate">{station.name}</h2>
            <p className="text-[#FFC300] text-xs">{station.operator}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3 max-h-[50vh] overflow-y-auto">
        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-white/80 text-xs">{station.address}</p>
            <p className="text-white/40 text-[10px]">{station.city}</p>
            {distance !== undefined && (
              <p className="text-[#FFC300] text-xs mt-0.5">{distance} km dari Anda</p>
            )}
          </div>
        </div>

        {/* Hours & Price */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-white/60">
            <Clock className="w-3.5 h-3.5" />
            <span>{station.operatingHours}</span>
          </div>
          {station.pricing && (
            <div className="flex items-center gap-1.5 text-white/60">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Rp {station.pricing.ratePerKwh.toLocaleString('id-ID')}/kWh</span>
            </div>
          )}
        </div>

        {/* Connectors */}
        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Connector</p>
          <div className="space-y-1.5">
            {Object.entries(connectorsByType).map(([type, connectors]) => (
              <div key={type} className="bg-forest-mid/50 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-medium">{getConnectorLabel(type)}</span>
                  <span className="text-white/40 text-[10px]">{connectors.length} unit</span>
                </div>
                <div className="space-y-0.5">
                  {connectors.map(connector => (
                    <div key={connector.id} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-2.5 h-2.5 text-white/30" />
                        <span className="text-white/60">{connector.powerKw}kW {connector.currentType}</span>
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
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5">Fasilitas</p>
            <div className="flex flex-wrap gap-1">
              {station.amenities.slice(0, 4).map((amenity, i) => (
                <span key={i} className="px-2 py-0.5 bg-forest-mid text-white/60 text-[10px] rounded">
                  {getAmenityLabel(amenity)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
            window.open(url, '_blank');
          }}
          className="w-full flex items-center justify-center gap-1.5 bg-[#FFC300] text-forest-dark text-sm font-semibold py-2.5 rounded-lg hover:bg-[#FFD60A] transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Navigasi
        </button>
      </div>
    </div>
  );
}

function getConnectorLabel(type: string): string {
  const labels: Record<string, string> = {
    'type2': 'Type 2 (AC)',
    'ccs2': 'CCS2 (DC)',
    'chademo': 'CHAdeMO',
    'gb/t': 'GB/T',
    'tesla_supercharger': 'Tesla SC',
    'tesla_destination': 'Tesla',
  };
  return labels[type] || type;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'available': 'text-[#27AE60]',
    'occupied': 'text-amber-400',
    'offline': 'text-[#E74C3C]',
    'maintenance': 'text-gray-400',
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
