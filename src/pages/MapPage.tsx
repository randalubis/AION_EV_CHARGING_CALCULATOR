import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import {
  Search, MapPin, List, X, AlertTriangle,
  Compass, Filter, ChevronDown, Crosshair, HelpCircle,
} from 'lucide-react';
import { MapView, StationCard, StationDetail, FilterPanel, AddStationButton, AddStationModal, HowToUseDialog } from '../features/map';
import { useStations, type Bounds } from '../features/map/hooks/useStations';
import type { MapViewport } from '../features/map/types';

export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showList, setShowList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-2.5489, 118.0149],
    zoom: 5,
  });

  // Add-station flow state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pickingLocation, setPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const {
    stations,
    searchResults,
    isSearching,
    searchLoading,
    selectedStation,
    filters,
    searchQuery,
    setSearchQuery,
    stats,
    availableOperators,
    loading,
    error,
    updateFilters,
    clearFilters,
    selectStation,
    loadStationById,
  } = useStations({ userLocation, bounds });

  const listStations = isSearching ? searchResults : stations;

  // URL deep-linking: when ?id=... is present in the URL on mount, fetch
  // that station and fly the map to it.
  const idParam = searchParams.get('id');
  useEffect(() => {
    if (!idParam || selectedStation?.id === idParam) return;
    let cancelled = false;
    loadStationById(idParam).then((station) => {
      if (cancelled || !station) return;
      setViewport({ center: [station.latitude, station.longitude], zoom: 15 });
    });
    return () => {
      cancelled = true;
    };
  }, [idParam, loadStationById, selectedStation?.id]);

  const selectAndSyncUrl = useCallback(
    (id: string | null) => {
      selectStation(id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id) next.set('id', id);
          else next.delete('id');
          return next;
        },
        { replace: true },
      );
    },
    [selectStation, setSearchParams],
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setViewport({ center: [latitude, longitude], zoom: 12 });
        },
        () => console.log('Geolocation not available')
      );
    }
  }, []);

  useEffect(() => {
    document.title = 'Peta SPKLU | evhub.id';
    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll('.animate-in');
      if (elements?.length) {
        gsap.fromTo(elements, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05 });
      }
    });
    return () => ctx.revert();
  }, []);

  const handleMapClick = pickingLocation
    ? (lat: number, lng: number) => {
        setPickedLocation({ lat, lng });
        setPickingLocation(false);
        setAddModalOpen(true);
      }
    : undefined;

  const handleRequestPickFromMap = () => {
    setAddModalOpen(false);
    setPickingLocation(true);
  };

  const handleCancelPick = () => {
    setPickingLocation(false);
    setAddModalOpen(true);
  };

  return (
    <div ref={containerRef} className="bg-forest-dark pt-20">
      {/* Beta banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-amber-200 text-xs">
            Beta — bantu kami melengkapi data dengan tombol + di pojok kanan bawah
          </span>
        </div>
      </div>

      {/* Compact header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-[#FFC300]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-[#FFC300]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-base sm:text-lg leading-tight truncate">Peta SPKLU</h1>
            <p className="text-white/50 text-xs truncate">
              {stats.total} di area · {stats.fastCharging} fast
            </p>
          </div>
        </div>
        <HowToUseDialog
          trigger={
            <button className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-colors flex-shrink-0">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cara pakai</span>
            </button>
          }
        />
      </div>

      {/* Map Section — fills viewport below header */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        {/* Mobile: Toggle List Button */}
        <button
          onClick={() => setShowList(!showList)}
          className="md:hidden w-full mb-2 bg-forest-mid border border-white/10 rounded-lg px-4 py-2 flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            <List className="w-4 h-4" />
            <span className="text-sm">Daftar Stasiun</span>
            <span className="bg-[#FFC300]/20 text-[#FFC300] text-xs px-2 py-0.5 rounded-full">{listStations.length}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${showList ? 'rotate-180' : ''}`} />
        </button>

        <div className="bg-forest-mid/30 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row h-[calc(100svh-10rem)] min-h-[420px] md:min-h-[520px]">
            {/* Sidebar */}
            <aside className={`
              ${showList ? 'block' : 'hidden'}
              md:block w-full md:w-72 lg:w-80 bg-forest-dark border-b md:border-b-0 md:border-r border-white/10
              flex flex-col flex-shrink-0
            `}>
              {/* Search */}
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Cari stasiun..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-forest-mid border border-white/20 rounded-lg pl-9 pr-8 py-2 text-white text-sm placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                      <X className="w-3.5 h-3.5 text-white/40" />
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Filter */}
              <div className="border-b border-white/10">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-white/70 hover:text-white hover:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filter</span>
                    {(filters.connectorTypes.length > 0 || filters.minPowerKw > 0) && (
                      <span className="bg-[#FFC300] text-forest-dark text-xs px-1.5 py-0.5 rounded-full">!</span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="px-3 pb-3">
                    <FilterPanel
                      filters={filters}
                      operators={availableOperators}
                      onUpdateFilters={updateFilters}
                      onClearFilters={clearFilters}
                    />
                  </div>
                )}
              </div>

              {/* Station List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                {isSearching && (
                  <p className="text-white/40 text-[11px] uppercase tracking-wider px-1 pb-1">
                    {searchLoading ? 'Mencari...' : `Hasil untuk "${searchQuery}"`}
                  </p>
                )}
                {listStations.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-10 h-10 text-white/20 mx-auto mb-2" />
                    <p className="text-white/50 text-sm">
                      {isSearching
                        ? searchLoading
                          ? 'Mencari...'
                          : `Tidak ada hasil untuk "${searchQuery}"`
                        : 'Tidak ada stasiun di area ini'}
                    </p>
                    {!isSearching && (
                      <p className="text-white/30 text-xs mt-1">Geser peta atau perbesar tampilan</p>
                    )}
                  </div>
                ) : (
                  listStations.map(station => (
                    <StationCard
                      key={station.id}
                      station={station}
                      isSelected={selectedStation?.id === station.id}
                      onClick={() => {
                        selectAndSyncUrl(station.id);
                        setViewport({
                          center: [station.latitude, station.longitude],
                          zoom: Math.max(viewport.zoom, 14),
                        });
                        setShowList(false);
                      }}
                      distance={station.distance}
                    />
                  ))
                )}
              </div>
            </aside>

            {/* Map */}
            <div className="flex-1 relative min-h-0">
              <MapView
                stations={stations}
                selectedStationId={selectedStation?.id || null}
                onStationSelect={selectAndSyncUrl}
                viewport={viewport}
                userLocation={userLocation}
                onMapClick={handleMapClick}
                onBoundsChange={setBounds}
              />

              {/* Loading & error indicators */}
              {(loading || error) && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
                  {loading && (
                    <div className="bg-forest-dark/90 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white/80 flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-[#FFC300] border-t-transparent rounded-full animate-spin" />
                      Memuat stasiun...
                    </div>
                  )}
                  {error && !loading && (
                    <div className="bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1.5 text-xs text-red-200">
                      Gagal memuat: {error}
                    </div>
                  )}
                </div>
              )}

              {/* Pick-from-map banner */}
              {pickingLocation && (
                <div className="absolute top-3 left-3 right-3 z-[1000] bg-[#FFC300] text-forest-dark rounded-lg px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <Crosshair className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      Ketuk lokasi di peta untuk memilih
                    </span>
                  </div>
                  <button
                    onClick={handleCancelPick}
                    className="flex-shrink-0 text-sm font-semibold underline"
                  >
                    Batal
                  </button>
                </div>
              )}

              {/* Station Detail — desktop side panel */}
              {selectedStation && (
                <div className="hidden md:block absolute top-3 right-3 w-72 z-[1000] max-h-[calc(100%-24px)] overflow-y-auto">
                  <StationDetail
                    station={selectedStation}
                    onClose={() => selectAndSyncUrl(null)}
                    distance={selectedStation.distance}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Station Detail — mobile bottom sheet */}
      {selectedStation && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-[2000] bg-forest-dark border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto pb-safe animate-slide-up">
          <div className="sticky top-0 flex justify-center pt-2 pb-1 bg-forest-dark">
            <span className="w-10 h-1 rounded-full bg-white/20" />
          </div>
          <StationDetail
            station={selectedStation}
            onClose={() => selectAndSyncUrl(null)}
            distance={selectedStation.distance}
          />
        </div>
      )}

      {/* Add Station Button */}
      {!pickingLocation && <AddStationButton onClick={() => setAddModalOpen(true)} />}

      {/* Add Station Modal */}
      <AddStationModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setPickedLocation(null);
        }}
        onRequestPickFromMap={handleRequestPickFromMap}
        initialLocation={pickedLocation}
      />
    </div>
  );
}
