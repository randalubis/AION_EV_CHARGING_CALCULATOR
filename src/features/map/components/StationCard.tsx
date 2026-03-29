import { Zap, Clock, Navigation, Battery } from 'lucide-react';
import type { ChargingStation } from '../types';

interface StationCardProps {
  station: ChargingStation;
  isSelected?: boolean;
  onClick?: () => void;
  distance?: number;
}

export function StationCard({ station, isSelected, onClick, distance }: StationCardProps) {
  // Count available connectors
  const availableConnectors = station.connectors.filter(c => c.status === 'available').length;
  const totalConnectors = station.connectors.length;
  
  // Get max power
  const maxPower = Math.max(...station.connectors.map(c => c.powerKw));
  
  // Check if has fast charging (50kW+)
  const hasFastCharging = station.connectors.some(c => c.powerKw >= 50);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected 
          ? 'bg-[#FFC300]/10 border-[#FFC300]' 
          : 'bg-forest-dark/50 border-white/10 hover:border-white/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-white font-semibold text-sm">{station.name}</h3>
          <p className="text-white/50 text-xs">{station.operator}</p>
        </div>
        {hasFastCharging && (
          <span className="px-2 py-0.5 bg-[#FFC300]/20 text-[#FFC300] text-xs rounded-full font-medium">
            Fast
          </span>
        )}
      </div>

      {/* Address */}
      <p className="text-white/40 text-xs mb-3 line-clamp-2">{station.address}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs mb-3">
        <div className="flex items-center gap-1 text-white/60">
          <Zap className="w-3.5 h-3.5" />
          <span>{maxPower} kW max</span>
        </div>
        <div className="flex items-center gap-1 text-white/60">
          <Battery className="w-3.5 h-3.5" />
          <span className={availableConnectors > 0 ? 'text-[#27AE60]' : 'text-[#E74C3C]'}>
            {availableConnectors}/{totalConnectors} tersedia
          </span>
        </div>
        {distance !== undefined && (
          <div className="flex items-center gap-1 text-white/60">
            <Navigation className="w-3.5 h-3.5" />
            <span>{distance} km</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-white/40">
          <Clock className="w-3.5 h-3.5" />
          <span>{station.operatingHours}</span>
        </div>
        <div className="text-[#FFC300]">
          Rp {station.pricing?.ratePerKwh.toLocaleString('id-ID')}/kWh
        </div>
      </div>

      {/* Connector Types */}
      <div className="flex gap-2 mt-3">
        {[...new Set(station.connectors.map(c => c.type))].map(type => (
          <span 
            key={type}
            className="px-2 py-0.5 bg-white/5 text-white/50 text-xs rounded"
          >
            {getConnectorLabel(type)}
          </span>
        ))}
      </div>
    </div>
  );
}

function getConnectorLabel(type: string): string {
  const labels: Record<string, string> = {
    'type2': 'Type 2',
    'ccs2': 'CCS2',
    'chademo': 'CHAdeMO',
    'gb/t': 'GB/T',
    'tesla_supercharger': 'Tesla SC',
    'tesla_destination': 'Tesla Dest',
  };
  return labels[type] || type;
}
