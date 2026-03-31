import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { 
  Search, MapPin, List, X, AlertTriangle, Info, 
  Compass, Filter, ChevronDown
} from 'lucide-react';
import { MapView, StationCard, StationDetail, FilterPanel, AddStationButton, AddStationModal } from '../features/map';
import { useStations } from '../features/map/hooks/useStations';
import { submitStationToSheets } from '../features/map/services/submissionApi';
import type { MapViewport, StationSubmissionFormData } from '../features/map/types';

export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showList, setShowList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-2.5489, 118.0149],
    zoom: 5,
  });
  
  // Crowdsourcing modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [clickLocation, setClickLocation] = useState<{ lat: number; lng: number } | null>(null);

  const {
    stations,
    selectedStation,
    filters,
    stats,
    updateFilters,
    clearFilters,
    selectStation,
  } = useStations({ userLocation });

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

  const filteredStations = stations.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || 
           s.city.toLowerCase().includes(q) || 
           s.operator.toLowerCase().includes(q);
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-forest-dark pt-20">
      {/* Early Build Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-amber-200 text-xs sm:text-sm font-medium text-center">
            Early Build — Fitur dalam pengembangan
          </span>
        </div>
      </div>

      {/* Hero Card */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="animate-in bg-forest-mid/40 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFC300]/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFC300]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-lg sm:text-xl mb-1">Temukan Stasiun Charging</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Peta SPKLU (Stasiun Pengisian Kendaraan Listrik Umum) membantu Anda menemukan lokasi charger 
                dengan informasi real-time: ketersediaan, tipe connector, kecepatan, dan harga.
              </p>
            </div>
          </div>

          {/* How to Use */}
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-[#FFC300]" />
              <span className="text-white font-medium text-sm">Cara Penggunaan</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="flex items-start gap-2 bg-white/5 rounded-lg p-3">
                <span className="w-5 h-5 bg-[#27AE60]/20 text-[#27AE60] rounded flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span className="text-white/70 text-xs">Klik ikon <strong className="text-white">petir</strong> pada peta untuk lihat detail stasiun</span>
              </div>
              <div className="flex items-start gap-2 bg-white/5 rounded-lg p-3">
                <span className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span className="text-white/70 text-xs">Detail stasiun akan muncul di <strong className="text-white">panel samping kanan</strong></span>
              </div>
              <div className="flex items-start gap-2 bg-white/5 rounded-lg p-3">
                <span className="w-5 h-5 bg-[#FFC300]/20 text-[#FFC300] rounded flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span className="text-white/70 text-xs">Tekan <strong className="text-white">Navigasi</strong> untuk arahkan ke Google Maps</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#27AE60] border border-white" />
                <span className="text-white/60">Tersedia</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E74C3C] border border-white" />
                <span className="text-white/60">Penuh</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FFC300] border border-white" />
                <span className="text-white/60">Terpilih</span>
              </span>
            </div>

            <p className="text-white/40 text-xs mt-3 italic">
              *Data sample untuk demo. Data lengkap akan ditambahkan.
            </p>
          </div>
        </div>
      </div>

      {/* Map Section Header with Stats */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-white font-bold text-lg">Peta SPKLU</h3>
            <p className="text-white/50 text-sm">{stats.total} stasiun tersedia</p>
          </div>
          <div className="flex items-center gap-4 text-sm bg-forest-mid/40 rounded-lg px-4 py-2 border border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="text-[#FFC300] font-semibold">{stats.total}</span>
              <span className="text-white/50">Total</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5">
              <span className="text-[#27AE60] font-semibold">{stats.available}</span>
              <span className="text-white/50">Tersedia</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400 font-semibold">{stats.fastCharging}</span>
              <span className="text-white/50">Fast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        {/* Mobile: Toggle List Button */}
        <button
          onClick={() => setShowList(!showList)}
          className="md:hidden w-full mb-3 bg-forest-mid border border-white/10 rounded-lg px-4 py-2.5 flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            <List className="w-4 h-4" />
            <span className="text-sm">Daftar Stasiun</span>
            <span className="bg-[#FFC300]/20 text-[#FFC300] text-xs px-2 py-0.5 rounded-full">{filteredStations.length}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${showList ? 'rotate-180' : ''}`} />
        </button>

        <div className="bg-forest-mid/30 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row h-[500px] md:h-[600px]">
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
                      onUpdateFilters={updateFilters}
                      onClearFilters={clearFilters}
                    />
                  </div>
                )}
              </div>

              {/* Station List - with proper scroll */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: 'calc(500px - 120px)', WebkitOverflowScrolling: 'touch' }}>
                {filteredStations.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-10 h-10 text-white/20 mx-auto mb-2" />
                    <p className="text-white/50 text-sm">Tidak ada stasiun</p>
                  </div>
                ) : (
                  filteredStations.map(station => (
                    <StationCard
                      key={station.id}
                      station={station}
                      isSelected={selectedStation?.id === station.id}
                      onClick={() => {
                        selectStation(station.id);
                        setViewport({
                          center: [station.latitude, station.longitude],
                          zoom: 15,
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
                stations={filteredStations}
                selectedStationId={selectedStation?.id || null}
                onStationSelect={selectStation}
                viewport={viewport}
                userLocation={userLocation}
                onMapClick={(lat, lng) => {
                  setClickLocation({ lat, lng });
                  setShowAddModal(true);
                }}
              />

              {/* Station Detail - Right side panel */}
              {selectedStation && (
                <div className="absolute top-3 right-3 w-64 sm:w-72 z-10 max-h-[calc(100%-24px)] overflow-y-auto">
                  <StationDetail
                    station={selectedStation}
                    onClose={() => selectStation(null)}
                    distance={selectedStation.distance}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Station Button */}
      <AddStationButton onClick={() => setShowAddModal(true)} />

      {/* Add Station Modal */}
      <AddStationModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setClickLocation(null);
        }}
        initialLocation={clickLocation}
      />
    </div>
  );
}
