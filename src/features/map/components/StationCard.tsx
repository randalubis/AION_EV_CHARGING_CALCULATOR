import { Zap, Clock, Navigation, Battery } from 'lucide-react';
import type { ChargingStation } from '../types';

interface StationCardProps {
  station: ChargingStation;
  isSelected?: boolean;
  onClick?: () => void;
  distance?: number;
}

export function StationCard({ station, isSelected, onClick, distance }: StationCardProps) {
  const availableConnectors = station.connectors.filter(c => c.status === 'available').length;
  const totalConnectors = station.connectors.length;
  const maxPower = Math.max(...station.connectors.map(c => c.powerKw));
  const hasFastCharging = station.connectors.some(c => c.powerKw >= 50);

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'bg-[#FFC300]/10 border-[#FFC300]' 
          : 'bg-forest-mid/30 border-white/10 hover:border-white/20'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          <h3 className="text-white font-medium text-sm truncate">{station.name}</h3>
          <p className="text-white/50 text-xs">{station.operator}</p>
        </div>
        {hasFastCharging && (
          <span className="px-1.5 py-0.5 bg-[#FFC300]/20 text-[#FFC300] text-[10px] rounded font-medium flex-shrink-0">
            Fast
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {maxPower}kW
        </span>
        <span className={availableConnectors > 0 ? 'text-[#27AE60]' : 'text-[#E74C3C]'}>
          {availableConnectors}/{totalConnectors}
        </span>
        {distance !== undefined && (
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            {distance}km
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-1">
          {[...new Set(station.connectors.map(c => c.type))].slice(0, 2).map(type => (
            <span 
              key={type}
              className="px-1.5 py-0.5 bg-white/5 text-white/40 text-[10px] rounded"
            >
              {getConnectorLabel(type)}
            </span>
          ))}
        </div>
        <span className="text-[#FFC300] text-xs">
          Rp{station.pricing?.ratePerKwh.toLocaleString('id-ID')}
        </span>
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
  };
  return labels[type] || type;
}
