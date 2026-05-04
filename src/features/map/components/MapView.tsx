import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import { useEffect, useRef } from 'react';
import type { ChargingStation, MapViewport } from '../types';

const STATION_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width: 16px; height: 16px;">
    <path d="M11 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H11V21ZM13 21H19C20.1046 21 21 20.1046 21 19V12L17 12V8L21 8V5C21 3.89543 20.1046 3 19 3H13V21ZM19 14V19H15V14H19ZM9 7V11L7 11V7H9ZM15 7V11L13 11V7H15Z"/>
  </svg>
`;

function buildStationIcon(color: string, shadow: string): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: ${shadow};
        display: flex;
        align-items: center;
        justify-content: center;
      ">${STATION_SVG}</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: 'custom-marker-icon',
  });
}

const STATION_ICONS = {
  selected: buildStationIcon('#FFC300', '0 0 0 4px rgba(255, 195, 0, 0.3)'),
  available: buildStationIcon('#27AE60', '0 2px 4px rgba(0,0,0,0.3)'),
  unavailable: buildStationIcon('#E74C3C', '0 2px 4px rgba(0,0,0,0.3)'),
};

const USER_ICON = L.divIcon({
  html: `
    <div style="
      background: #3B82F6;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  className: 'custom-user-icon',
});

function pickStationIcon(isSelected: boolean, hasAvailable: boolean): L.DivIcon {
  if (isSelected) return STATION_ICONS.selected;
  return hasAvailable ? STATION_ICONS.available : STATION_ICONS.unavailable;
}

interface ViewportControllerProps {
  viewport: MapViewport;
}

function ViewportController({ viewport }: ViewportControllerProps) {
  const map = useMap();
  const isUserInteracting = useRef(false);

  useEffect(() => {
    const handleDragStart = () => { isUserInteracting.current = true; };
    const handleDragEnd = () => { setTimeout(() => { isUserInteracting.current = false; }, 100); };

    map.on('dragstart', handleDragStart);
    map.on('dragend', handleDragEnd);

    return () => {
      map.off('dragstart', handleDragStart);
      map.off('dragend', handleDragEnd);
    };
  }, [map]);

  useEffect(() => {
    if (!isUserInteracting.current && viewport.center && viewport.zoom) {
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      const targetCenter = viewport.center;

      const centerDiff = Math.abs(currentCenter.lat - targetCenter[0]) + Math.abs(currentCenter.lng - targetCenter[1]);
      const zoomDiff = Math.abs(currentZoom - viewport.zoom);

      if (centerDiff > 0.001 || zoomDiff > 0.5) {
        map.setView(viewport.center, viewport.zoom, { animate: true, duration: 0.5 });
      }
    }
  }, [map, viewport]);

  return null;
}

interface LocateButtonProps {
  onLocate: () => void;
}

function LocateButton({ onLocate }: LocateButtonProps) {
  const map = useMap();

  return (
    <button
      onClick={() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 15, { animate: true });
              onLocate();
            },
            () => alert('Tidak dapat mengakses lokasi')
          );
        }
      }}
      className="absolute bottom-6 right-6 z-[1000] w-10 h-10 bg-[#FFC300] text-forest-dark rounded-lg shadow-lg hover:bg-[#e6b000] transition-colors flex items-center justify-center pointer-events-auto"
      title="Lokasi saya"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    </button>
  );
}

interface MapBounds {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

interface MapViewProps {
  stations: ChargingStation[];
  selectedStationId: string | null;
  onStationSelect: (id: string) => void;
  viewport: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  userLocation: [number, number] | null;
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
}

function BoundsTracker({ onChange }: { onChange?: (bounds: MapBounds) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onChange) return;

    const emit = () => {
      const b = map.getBounds();
      onChange({
        minLng: b.getWest(),
        minLat: b.getSouth(),
        maxLng: b.getEast(),
        maxLat: b.getNorth(),
      });
    };

    emit();
    map.on('moveend', emit);
    return () => {
      map.off('moveend', emit);
    };
  }, [map, onChange]);

  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onMapClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

export function MapView({
  stations,
  selectedStationId,
  onStationSelect,
  viewport,
  userLocation,
  onMapClick,
  onBoundsChange,
}: MapViewProps) {
  const defaultCenter: [number, number] = [-2.5489, 118.0149];
  const defaultZoom = 5;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom={true}
      dragging={true}
      zoomControl={true}
      doubleClickZoom={true}
      touchZoom={true}
      boxZoom={true}
      keyboard={true}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: '0 0.75rem 0.75rem 0',
      }}
      className="leaflet-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains={['a', 'b', 'c', 'd']}
        maxZoom={19}
      />

      <ViewportController viewport={viewport} />
      <MapClickHandler onMapClick={onMapClick} />
      <BoundsTracker onChange={onBoundsChange} />

      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={40}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
      >
        {stations.map((station) => {
          const hasAvailable = station.connectors.some(c => c.status === 'available');
          const isSelected = station.id === selectedStationId;

          return (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={pickStationIcon(isSelected, hasAvailable)}
              eventHandlers={{
                click: () => onStationSelect(station.id),
              }}
            >
              <Popup>
                <div className="min-w-[150px]">
                  <h4 className="font-semibold text-white text-sm mb-1">{station.name}</h4>
                  <p className="text-white/60 text-xs mb-2">{station.operator}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded ${hasAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {hasAvailable ? 'Tersedia' : 'Penuh'}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {userLocation && (
        <Marker position={userLocation} icon={USER_ICON}>
          <Popup>
            <span className="text-white text-sm">Lokasi Anda</span>
          </Popup>
        </Marker>
      )}

      <LocateButton onLocate={() => {}} />
      <LegendOverlay />
    </MapContainer>
  );
}

function LegendOverlay() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-forest-dark/85 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-xs flex flex-col gap-1.5 pointer-events-none">
      <span className="flex items-center gap-2 text-white/70">
        <span className="w-2.5 h-2.5 rounded-full bg-[#27AE60] border border-white" />
        Tersedia
      </span>
      <span className="flex items-center gap-2 text-white/70">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E74C3C] border border-white" />
        Penuh / Tidak diketahui
      </span>
      <span className="flex items-center gap-2 text-white/70">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFC300] border border-white" />
        Terpilih
      </span>
    </div>
  );
}
