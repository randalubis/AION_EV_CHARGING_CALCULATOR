import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import { Locate, Plus, Minus } from 'lucide-react';
import type { ChargingStation, MapViewport } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icons for Vite
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  stations: ChargingStation[];
  selectedStationId: string | null;
  onStationSelect: (id: string) => void;
  viewport?: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  userLocation?: [number, number] | null;
}

// Map controller component to handle viewport changes
function MapController({ 
  viewport, 
  onViewportChange,
  selectedStationId,
  stations 
}: { 
  viewport?: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  selectedStationId: string | null;
  stations: ChargingStation[];
}) {
  const map = useMap();
  
  useEffect(() => {
    if (viewport) {
      map.setView(viewport.center, viewport.zoom, { animate: true });
    }
  }, [viewport, map]);

  useEffect(() => {
    if (selectedStationId) {
      const station = stations.find(s => s.id === selectedStationId);
      if (station) {
        map.setView([station.latitude, station.longitude], 16, { animate: true });
      }
    }
  }, [selectedStationId, stations, map]);

  // Notify parent of viewport changes
  useEffect(() => {
    const handleMove = () => {
      const center = map.getCenter();
      onViewportChange?.({
        center: [center.lat, center.lng],
        zoom: map.getZoom(),
      });
    };
    
    map.on('moveend', handleMove);
    return () => { map.off('moveend', handleMove); };
  }, [map, onViewportChange]);

  return null;
}

// Create custom marker icons
function createStationIcon(isSelected: boolean, hasAvailable: boolean): L.DivIcon {
  const color = isSelected ? '#FFC300' : hasAvailable ? '#27AE60' : '#E74C3C';
  const size = isSelected ? 40 : 32;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        ${isSelected ? 'animation: pulse 2s infinite;' : ''}
      ">
        <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="white">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 195, 0, 0.7); }
          50% { box-shadow: 0 0 0 15px rgba(255, 195, 0, 0); }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
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
  const mapRef = useRef<L.Map | null>(null);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current?.setView([latitude, longitude], 14);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan.');
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Leaflet Map */}
      <MapContainer
        center={viewport?.center || DEFAULT_CENTER}
        zoom={viewport?.zoom || DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
        zoomControl={false}
        ref={(map) => {
          if (map) {
            mapRef.current = map;
          }
        }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dark mode tile layer option (commented out, can be toggled) */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        /> */}

        {/* Map Controller */}
        <MapController 
          viewport={viewport}
          onViewportChange={onViewportChange}
          selectedStationId={selectedStationId}
          stations={stations}
        />

        {/* Station Markers */}
        {stations.map((station) => {
          const isSelected = selectedStationId === station.id;
          const hasAvailable = station.connectors.some(c => c.status === 'available');
          
          return (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={createStationIcon(isSelected, hasAvailable)}
              eventHandlers={{
                click: () => onStationSelect(station.id),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold text-forest-dark">{station.name}</h3>
                  <p className="text-sm text-gray-600">{station.operator}</p>
                  <p className="text-xs text-gray-500 mt-1">{station.address}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      hasAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {hasAvailable ? 'Tersedia' : 'Penuh'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Rp {station.pricing?.ratePerKwh.toLocaleString('id-ID')}/kWh
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User Location Marker */}
        {userLocation && (
          <CircleMarker
            center={userLocation}
            radius={8}
            pathOptions={{
              fillColor: '#3B82F6',
              color: 'white',
              weight: 2,
              fillOpacity: 1,
            }}
          />
        )}

        {/* User location accuracy circle */}
        {userLocation && (
          <CircleMarker
            center={userLocation}
            radius={50}
            pathOptions={{
              fillColor: '#3B82F6',
              color: '#3B82F6',
              weight: 0,
              fillOpacity: 0.2,
            }}
          />
        )}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-forest-dark border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-[#FFC300] hover:text-[#FFC300] transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-forest-dark border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-[#FFC300] hover:text-[#FFC300] transition-colors shadow-lg"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={handleLocate}
          className="w-10 h-10 bg-forest-dark border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-[#FFC300] hover:text-[#FFC300] transition-colors shadow-lg"
          title="Lokasi saya"
        >
          <Locate className="w-5 h-5" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute left-4 bottom-4 bg-forest-dark/90 backdrop-blur-sm rounded-lg p-3 border border-white/10 z-[1000]">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#27AE60] border border-white" />
            <span className="text-white/70">Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#E74C3C] border border-white" />
            <span className="text-white/70">Penuh</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
            <span className="text-white/70">Anda</span>
          </div>
        </div>
      </div>

      {/* Station Count */}
      <div className="absolute top-4 left-4 bg-forest-dark/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 z-[1000]">
        <span className="text-[#FFC300] font-semibold">{stations.length}</span>
        <span className="text-white/70 text-sm ml-1">stasiun ditemukan</span>
      </div>
    </div>
  );
}
