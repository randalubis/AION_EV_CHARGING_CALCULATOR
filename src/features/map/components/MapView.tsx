import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import type { ChargingStation, MapViewport } from '../types';

// Create custom icons with proper size
const createStationIcon = (isSelected: boolean, hasAvailable: boolean): L.DivIcon => {
  const color = isSelected ? '#FFC300' : hasAvailable ? '#27AE60' : '#E74C3C';
  const shadow = isSelected ? '0 0 0 4px rgba(255, 195, 0, 0.3)' : '0 2px 4px rgba(0,0,0,0.3)';
  
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
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width: 16px; height: 16px;">
          <path d="M11 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H11V21ZM13 21H19C20.1046 21 21 20.1046 21 19V12L17 12V8L21 8V5C21 3.89543 20.1046 3 19 3H13V21ZM19 14V19H15V14H19ZM9 7V11L7 11V7H9ZM15 7V11L13 11V7H15Z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: 'custom-marker-icon',
  });
};

// Create user location icon
const createUserIcon = (): L.DivIcon => {
  return L.divIcon({
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
};

// Map viewport controller
interface ViewportControllerProps {
  viewport: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
}

function ViewportController({ viewport, onViewportChange }: ViewportControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (viewport.center && viewport.zoom) {
      map.setView(viewport.center, viewport.zoom, { animate: true, duration: 0.5 });
    }
  }, [map, viewport]);

  useEffect(() => {
    const handleMoveEnd = () => {
      if (onViewportChange) {
        onViewportChange({
          center: [map.getCenter().lat, map.getCenter().lng],
          zoom: map.getZoom(),
        });
      }
    };

    map.on('moveend', handleMoveEnd);
    map.on('zoomend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomend', handleMoveEnd);
    };
  }, [map, onViewportChange]);

  return null;
}

// Locate button component
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
      className="absolute bottom-6 right-6 z-[1000] w-10 h-10 bg-[#FFC300] text-forest-dark rounded-lg shadow-lg hover:bg-[#e6b000] transition-colors flex items-center justify-center"
      title="Lokasi saya"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    </button>
  );
}

interface MapViewProps {
  stations: ChargingStation[];
  selectedStationId: string | null;
  onStationSelect: (id: string) => void;
  viewport: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  userLocation: [number, number] | null;
}

export function MapView({
  stations,
  selectedStationId,
  onStationSelect,
  viewport,
  onViewportChange,
  userLocation,
}: MapViewProps) {
  const defaultCenter: [number, number] = [-2.5489, 118.0149];
  const defaultZoom = 5;

  return (
    <>
      <style>{`
        .leaflet-container {
          background: #1a1a2e;
          font-family: inherit;
        }
        .custom-marker-icon {
          background: transparent;
          border: none;
        }
        .custom-user-icon {
          background: transparent;
          border: none;
        }
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 8px !important;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
          margin-top: 12px !important;
          margin-right: 12px !important;
        }
        .leaflet-control-zoom a {
          background: #1a2e1a !important;
          color: white !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 20px !important;
          transition: all 0.2s;
        }
        .leaflet-control-zoom a:hover {
          background: #243824 !important;
        }
        .leaflet-control-zoom a:first-child {
          border-radius: 8px 8px 0 0 !important;
        }
        .leaflet-control-zoom a:last-child {
          border-radius: 0 0 8px 8px !important;
          border-top: none !important;
        }
        .leaflet-popup-content-wrapper {
          background: #1a2e1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 12px !important;
          color: white !important;
        }
        .leaflet-popup-tip {
          background: #1a2e1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .leaflet-popup-content {
          margin: 12px !important;
        }
      `}</style>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        doubleClickZoom={true}
        touchZoom={true}
        style={{ 
          height: '100%', 
          width: '100%',
          borderRadius: '0 0.75rem 0.75rem 0',
          zIndex: 1,
        }}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ViewportController viewport={viewport} onViewportChange={onViewportChange} />

        {stations.map((station) => {
          const hasAvailable = station.connectors.some(c => c.status === 'available');
          const isSelected = station.id === selectedStationId;

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

        {userLocation && (
          <Marker
            position={userLocation}
            icon={createUserIcon()}
          >
            <Popup>
              <span className="text-white text-sm">Lokasi Anda</span>
            </Popup>
          </Marker>
        )}

        <LocateButton onLocate={() => {}} />
      </MapContainer>
    </>
  );
}
