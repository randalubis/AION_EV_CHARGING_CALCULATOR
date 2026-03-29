import { useEffect, useRef, useState } from 'react';
import { Locate, Plus, Minus } from 'lucide-react';
import type { ChargingStation, MapViewport } from '../types';

interface MapViewProps {
  stations: ChargingStation[];
  selectedStationId: string | null;
  onStationSelect: (id: string) => void;
  viewport?: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  userLocation?: [number, number] | null;
}

// Indonesia center coordinates
const DEFAULT_CENTER: [number, number] = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;

export function MapView({
  stations,
  selectedStationId,
  onStationSelect,
  viewport,
  onViewportChange,
  userLocation,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(viewport?.zoom || DEFAULT_ZOOM);
  const [center, setCenter] = useState<[number, number]>(viewport?.center || DEFAULT_CENTER);

  // Simple visual representation of the map
  // In production, this would be replaced with Leaflet or Mapbox

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 3));

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setZoom(14);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan.');
        }
      );
    }
  };

  // Notify parent of viewport changes
  useEffect(() => {
    onViewportChange?.({ center, zoom });
  }, [center, zoom, onViewportChange]);

  return (
    <div className="relative w-full h-full bg-forest-mid rounded-xl overflow-hidden">
      {/* Map Placeholder Background */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-gradient-to-br from-forest-dark via-forest-mid to-forest-dark"
      >
        {/* Grid pattern to simulate map */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${zoom * 10}px ${zoom * 10}px`,
          }}
        />

        {/* Simulated Indonesia shape (simplified) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M45,20 L55,20 L60,30 L65,45 L60,60 L55,75 L50,85 L45,75 L40,60 L35,45 L40,30 Z"
            fill="none"
            stroke="#FFC300"
            strokeWidth="0.5"
          />
          {/* Sumatra */}
          <path
            d="M20,25 L25,20 L30,25 L28,35 L25,40 L22,35 Z"
            fill="none"
            stroke="#FFC300"
            strokeWidth="0.5"
          />
          {/* Kalimantan */}
          <path
            d="M45,15 L65,15 L70,25 L65,35 L45,35 L40,25 Z"
            fill="none"
            stroke="#FFC300"
            strokeWidth="0.5"
          />
          {/* Sulawesi */}
          <path
            d="M70,30 L75,28 L78,35 L75,45 L72,50 L70,45 Z"
            fill="none"
            stroke="#FFC300"
            strokeWidth="0.5"
          />
          {/* Papua */}
          <path
            d="M85,35 L95,35 L98,50 L95,65 L85,65 L82,50 Z"
            fill="none"
            stroke="#FFC300"
            strokeWidth="0.5"
          />
        </svg>

        {/* Station Markers */}
        {stations.map((station) => {
          // Simple projection to place markers on the placeholder map
          const x = ((station.longitude - 95) / 30) * 100; // Indonesia longitude range
          const y = ((6 - station.latitude) / 18) * 100; // Indonesia latitude range

          const isSelected = selectedStationId === station.id;
          const hasAvailable = station.connectors.some(c => c.status === 'available');

          return (
            <button
              key={station.id}
              onClick={() => onStationSelect(station.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all"
              style={{
                left: `${Math.max(5, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(95, y))}%`,
                zIndex: isSelected ? 10 : 1,
              }}
            >
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  isSelected
                    ? 'bg-[#FFC300] border-[#FFC300] scale-125'
                    : hasAvailable
                    ? 'bg-[#27AE60] border-white'
                    : 'bg-[#E74C3C] border-white'
                }`}
              >
                <ZapIcon className="w-4 h-4 text-white" isSelected={isSelected} />
                
                {/* Pulse effect for selected */}
                {isSelected && (
                  <span className="absolute inset-0 rounded-full bg-[#FFC300] animate-ping opacity-50" />
                )}
              </div>
            </button>
          );
        })}

        {/* User location marker */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${((userLocation[1] - 95) / 30) * 100}%`,
              top: `${((6 - userLocation[0]) / 18) * 100}%`,
              zIndex: 20,
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
              <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-50" />
            </div>
          </div>
        )}

        {/* Zoom level indicator */}
        <div className="absolute bottom-4 left-4 bg-forest-dark/90 backdrop-blur-sm rounded-lg px-3 py-1 text-white/50 text-xs">
          Zoom: {zoom}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-forest-dark border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-[#FFC300] hover:text-[#FFC300] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-forest-dark border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-[#FFC300] hover:text-[#FFC300] transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={handleLocate}
          className="w-10 h-10 bg-forest-dark border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-[#FFC300] hover:text-[#FFC300] transition-colors"
          title="Lokasi saya"
        >
          <Locate className="w-5 h-5" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute left-4 bottom-4 bg-forest-dark/90 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#27AE60]" />
            <span className="text-white/70">Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#E74C3C]" />
            <span className="text-white/70">Penuh</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-white/70">Anda</span>
          </div>
        </div>
      </div>

      {/* Station Count */}
      <div className="absolute top-4 left-4 bg-forest-dark/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
        <span className="text-[#FFC300] font-semibold">{stations.length}</span>
        <span className="text-white/70 text-sm ml-1">stasiun ditemukan</span>
      </div>
    </div>
  );
}

function ZapIcon({ className, isSelected }: { className?: string; isSelected?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={isSelected ? '#0d1310' : 'currentColor'}
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
