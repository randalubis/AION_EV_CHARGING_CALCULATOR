import { Zap, Navigation } from 'lucide-react';
import type { ChargingStation } from '../types';

interface StationCardProps {
  station: ChargingStation;
  isSelected?: boolean;
  onClick?: () => void;
  distance?: number;
}

export function StationCard({ station, isSelected, onClick, distance }: StationCardProps) {
  const totalConnectors = station.connectors.reduce((sum, c) => sum + (c.count ?? 1), 0);
  const knownStatusConnectors = station.connectors.filter(c => c.status !== 'unknown');
  const availableConnectors = knownStatusConnectors.filter(c => c.status === 'available').length;
  const hasKnownAvailability = knownStatusConnectors.length > 0;

  const maxPower = station.connectors.length > 0
    ? Math.max(...station.connectors.map(c => c.powerKw))
    : 0;
  const hasFastCharging = station.connectors.some(c => c.powerKw >= 50);
  const ratePerKwh = station.pricing?.ratePerKwh;
  const hasPricing = typeof ratePerKwh === 'number' && ratePerKwh > 0;

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'bg-volt/10 border-volt'
          : 'bg-carbon-900/30 border-white/10 hover:border-white/20'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          <h3 className="text-white font-medium text-sm truncate">{station.name}</h3>
          <p className="text-white/50 text-xs truncate">{station.operator}</p>
        </div>
        {hasFastCharging && (
          <span className="px-1.5 py-0.5 bg-volt/20 text-volt text-[10px] rounded font-medium flex-shrink-0">
            Fast
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
        {maxPower > 0 && (
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {maxPower}kW
          </span>
        )}
        {hasKnownAvailability ? (
          <span className={availableConnectors > 0 ? 'text-[#27AE60]' : 'text-[#E74C3C]'}>
            {availableConnectors}/{totalConnectors} tersedia
          </span>
        ) : totalConnectors > 0 ? (
          <span className="text-white/40">
            {totalConnectors} konektor
          </span>
        ) : null}
        {distance !== undefined && (
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance}km`}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-1 min-w-0">
          {[...new Set(station.connectors.map(c => c.type))].slice(0, 3).map(type => (
            <span
              key={type}
              className="px-1.5 py-0.5 bg-white/5 text-white/40 text-[10px] rounded"
            >
              {getConnectorLabel(type)}
            </span>
          ))}
        </div>
        {hasPricing && (
          <span className="text-volt text-xs flex-shrink-0 ml-2">
            Rp{ratePerKwh.toLocaleString('id-ID')}/kWh
          </span>
        )}
      </div>
    </div>
  );
}

function getConnectorLabel(type: string): string {
  const labels: Record<string, string> = {
    type2: 'Type 2',
    ccs2: 'CCS2',
    chademo: 'CHAdeMO',
    'gb/t': 'GB/T',
  };
  return labels[type] || type;
}
