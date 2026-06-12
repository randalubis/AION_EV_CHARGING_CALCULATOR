import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import { useEffect, useRef } from 'react';
import type { ChargingStation, MapViewport } from '../types';

// Marker glyphs — chosen so available vs unavailable differ by shape, not
// just color (accessibility for colorblind users).
const PLUG_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width: 16px; height: 16px;">
    <path d="M11 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H11V21ZM13 21H19C20.1046 21 21 20.1046 21 19V12L17 12V8L21 8V5C21 3.89543 20.1046 3 19 3H13V21ZM19 14V19H15V14H19ZM9 7V11L7 11V7H9ZM15 7V11L13 11V7H15Z"/>
  </svg>
`;
const QUESTION_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
    <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>
`;

function buildStationIcon(color: string, shadow: string, glyph: string, size = 32, borderWidth = 3): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: ${borderWidth}px solid white;
        box-shadow: ${shadow};
        display: flex;
        align-items: center;
        justify-content: center;
      ">${glyph}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    className: 'custom-marker-icon',
  });
}

const STATION_ICONS = {
  selected: buildStationIcon('#C6FF4D', '0 0 0 4px rgba(198, 255, 77, 0.3)', PLUG_SVG, 36, 4),
  available: buildStationIcon('#27AE60', '0 2px 4px rgba(0,0,0,0.3)', PLUG_SVG),
  unavailable: buildStationIcon('#E74C3C', '0 2px 4px rgba(0,0,0,0.3)', QUESTION_SVG),
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
      className="absolute bottom-24 right-6 z-[1000] w-10 h-10 bg-volt/90 text-carbon-950 rounded-lg shadow-lg hover:bg-volt-dim transition-colors flex items-center justify-center pointer-events-auto"
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
    <div className="absolute bottom-4 left-4 z-[1000] bg-carbon-950/85 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-xs flex flex-col gap-1.5 pointer-events-none">
      <span className="flex items-center gap-2 text-white/70">
        <LegendDot color="#27AE60">⚡</LegendDot>
        Tersedia
      </span>
      <span className="flex items-center gap-2 text-white/70">
        <LegendDot color="#E74C3C">?</LegendDot>
        Status tidak diketahui
      </span>
      <span className="flex items-center gap-2 text-white/70">
        <LegendDot color="#C6FF4D" thicker>⚡</LegendDot>
        Terpilih
      </span>
    </div>
  );
}

function LegendDot({ color, thicker, children }: { color: string; thicker?: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-white ${thicker ? 'border-2' : 'border'}`}
      style={{ background: color }}
      aria-hidden
    >
      {children}
    </span>
  );
}
