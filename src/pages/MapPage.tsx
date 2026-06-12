import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Drawer } from 'vaul';
import gsap from 'gsap';
import { useDelayedFlag } from '../hooks/useDelayedFlag';
import { useIsMobile } from '../hooks/use-mobile';
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
  const isMobile = useIsMobile();
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
    availableAmenities,
    sortBy,
    setSortBy,
    loading,
    error,
    updateFilters,
    clearFilters,
    selectStation,
    loadStationById,
  } = useStations({ userLocation, bounds });

  const listStations = isSearching ? searchResults : stations;
  const showLoadingPill = useDelayedFlag(loading, 500);
  const initialLoading = loading && stations.length === 0 && !isSearching;

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
    <div ref={containerRef} className="bg-carbon-950">
      {/* Beta banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-amber-200 text-xs">
            Beta — bantu kami melengkapi data dengan tombol + di pojok kanan bawah
          </span>
        </div>
      </div>

      {/* Header — matches the calculator page's structure */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-4">
        <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
          <Link to="/" className="hover:text-volt transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-volt">Peta SPKLU</span>
        </div>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-volt/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Compass className="w-5 h-5 text-volt" />
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-xl md:text-2xl leading-tight">Peta SPKLU</h1>
              <p className="text-white/50 text-xs md:text-sm">
                {stats.total} stasiun di area · {stats.fastCharging} fast (50kW+)
              </p>
            </div>
          </div>
          <HowToUseDialog
            trigger={
              <button className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-colors flex-shrink-0">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Cara pakai</span>
              </button>
            }
          />
        </div>
      </div>

      {/* Map Section — fills viewport below header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-4">
        {/* Mobile: Toggle List Button */}
        <button
          onClick={() => setShowList(!showList)}
          className="md:hidden w-full mb-2 bg-carbon-900 border border-white/10 rounded-lg px-4 py-2 flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            <List className="w-4 h-4" />
            <span className="text-sm">Daftar Stasiun</span>
            <span className="bg-volt/20 text-volt text-xs px-2 py-0.5 rounded-full">{listStations.length}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${showList ? 'rotate-180' : ''}`} />
        </button>

        <div className="bg-carbon-900/30 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row h-[calc(100svh-15rem)] min-h-[420px] md:min-h-[520px]">
            {/* Sidebar */}
            <aside className={`
              ${showList ? 'block' : 'hidden'}
              md:block w-full md:w-72 lg:w-80 bg-carbon-950 border-b md:border-b-0 md:border-r border-white/10
              flex flex-col flex-shrink-0
            `}>
              {/* Search */}
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Cari stasiun, kota, atau operator..."
                    aria-label="Cari stasiun"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-carbon-900 border border-white/20 rounded-lg pl-9 pr-8 py-2 text-white text-sm placeholder:text-white/30 focus:border-volt focus:outline-none"
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
                      <span className="bg-volt text-carbon-950 text-xs px-1.5 py-0.5 rounded-full">!</span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="px-3 pb-3">
                    <FilterPanel
                      filters={filters}
                      operators={availableOperators}
                      amenities={availableAmenities}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
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
                {initialLoading && listStations.length === 0 ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-white/10 bg-carbon-900/20 animate-pulse">
                      <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
                      <div className="h-2.5 bg-white/10 rounded w-1/3 mb-3" />
                      <div className="flex gap-2">
                        <div className="h-2 bg-white/10 rounded w-12" />
                        <div className="h-2 bg-white/10 rounded w-16" />
                      </div>
                    </div>
                  ))
                ) : listStations.length === 0 ? (
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
              {(showLoadingPill || error) && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
                  {showLoadingPill && (
                    <div className="bg-carbon-950/90 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white/80 flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-volt border-t-transparent rounded-full animate-spin" />
                      Memuat stasiun...
                    </div>
                  )}
                  {error && !showLoadingPill && (
                    <div className="bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1.5 text-xs text-red-200">
                      Gagal memuat: {error}
                    </div>
                  )}
                </div>
              )}

              {/* First-load skeleton over the map area */}
              {initialLoading && (
                <div className="absolute inset-0 z-[500] flex items-center justify-center bg-carbon-950/40 backdrop-blur-[1px] pointer-events-none">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-volt border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/70 text-sm">Memuat stasiun di area Anda...</p>
                  </div>
                </div>
              )}

              {/* Pick-from-map banner */}
              {pickingLocation && (
                <div className="absolute top-3 left-3 right-3 z-[1000] bg-volt text-carbon-950 rounded-lg px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
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

      {/* Station Detail — mobile bottom sheet (drag-to-dismiss) */}
      {isMobile && (
        <Drawer.Root
          open={!!selectedStation}
          onOpenChange={(open) => {
            if (!open) selectAndSyncUrl(null);
          }}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[1999]" />
            <Drawer.Content
              aria-describedby={undefined}
              className="fixed inset-x-0 bottom-0 z-[2000] bg-carbon-950 border-t border-white/10 rounded-t-2xl flex flex-col max-h-[80vh] outline-none"
            >
              <Drawer.Title className="sr-only">Detail Stasiun</Drawer.Title>
              <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
                <span className="w-10 h-1 rounded-full bg-white/30" />
              </div>
              <div className="overflow-y-auto pb-safe">
                {selectedStation && (
                  <StationDetail
                    station={selectedStation}
                    onClose={() => selectAndSyncUrl(null)}
                    distance={selectedStation.distance}
                  />
                )}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
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
