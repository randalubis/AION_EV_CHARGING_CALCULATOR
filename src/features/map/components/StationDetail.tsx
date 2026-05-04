import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { X, MapPin, Clock, Navigation, Zap, DollarSign, RefreshCw, ExternalLink } from 'lucide-react';
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

  const lastVerified = formatLastVerified(station.lastUpdated);

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
            {station.address && <p className="text-white/80 text-xs">{station.address}</p>}
            {station.city && <p className="text-white/40 text-[10px]">{station.city}</p>}
            {distance !== undefined && (
              <p className="text-[#FFC300] text-xs mt-0.5">
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance} km`} dari Anda
              </p>
            )}
          </div>
        </div>

        {lastVerified && (
          <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
            <RefreshCw className="w-3 h-3" />
            <span>Diperbarui {lastVerified}</span>
          </div>
        )}

        {/* Hours & Price — only render rows that have data */}
        {(station.operatingHours || (station.pricing && station.pricing.ratePerKwh > 0)) && (
          <div className="flex items-center gap-4 text-xs flex-wrap">
            {station.operatingHours && (
              <div className="flex items-center gap-1.5 text-white/60">
                <Clock className="w-3.5 h-3.5" />
                <span>{station.operatingHours}</span>
              </div>
            )}
            {station.pricing && station.pricing.ratePerKwh > 0 && (
              <div className="flex items-center gap-1.5 text-white/60">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Rp {station.pricing.ratePerKwh.toLocaleString('id-ID')}/kWh</span>
              </div>
            )}
          </div>
        )}

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
        <NavigatePicker station={station} />
      </div>
    </div>
  );
}

function NavigatePicker({ station }: { station: ChargingStation }) {
  const [open, setOpen] = useState(false);
  const { latitude: lat, longitude: lng, name } = station;
  const encodedName = encodeURIComponent(name);
  const targets: { label: string; href: string }[] = [
    {
      label: 'Google Maps',
      href: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodedName}`,
    },
    {
      label: 'Waze',
      href: `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    },
    {
      label: 'Apple Maps',
      href: `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}`,
    },
  ];

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="w-full flex items-center justify-center gap-1.5 bg-[#FFC300] text-forest-dark text-sm font-semibold py-2.5 rounded-lg hover:bg-[#FFD60A] transition-colors">
          <Navigation className="w-4 h-4" />
          Navigasi
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          className="z-[10000] bg-forest-dark border border-white/10 rounded-lg shadow-2xl p-1 min-w-[180px]"
        >
          {targets.map((t) => (
            <a
              key={t.label}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              <span>{t.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/30" />
            </a>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });

function formatLastVerified(iso: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const diffMs = d.getTime() - Date.now();
  const absHours = Math.abs(diffMs / 3_600_000);
  if (absHours < 1) {
    const minutes = Math.round(diffMs / 60_000);
    return relativeTimeFormatter.format(minutes, 'minute');
  }
  if (absHours < 24) {
    return relativeTimeFormatter.format(Math.round(diffMs / 3_600_000), 'hour');
  }
  return relativeTimeFormatter.format(Math.round(diffMs / 86_400_000), 'day');
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
    available: 'text-[#27AE60]',
    occupied: 'text-amber-400',
    offline: 'text-[#E74C3C]',
    maintenance: 'text-gray-400',
    unknown: 'text-white/40',
  };
  return colors[status] || 'text-white/50';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: 'Tersedia',
    occupied: 'Terisi',
    offline: 'Offline',
    maintenance: 'Perawatan',
    unknown: '—',
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
