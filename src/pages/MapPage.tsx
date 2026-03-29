import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Search, MapPin, List, X } from 'lucide-react';
import { MapView, StationCard, StationDetail, FilterPanel } from '../features/map';
import { useStations } from '../features/map/hooks/useStations';
import type { MapViewport } from '../features/map/types';

export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showList, setShowList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-2.5489, 118.0149], // Indonesia center
    zoom: 5,
  });

  const {
    stations,
    selectedStation,
    filters,
    stats,
    updateFilters,
    clearFilters,
    selectStation,
  } = useStations({ userLocation });

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setViewport({ center: [latitude, longitude], zoom: 12 });
        },
        (error) => {
          console.log('Geolocation not available:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    document.title = 'Peta SPKLU | evhub.id';

    const ctx = gsap.context(() => {
      const animateElements = containerRef.current?.querySelectorAll('.animate-in');
      if (animateElements && animateElements.length > 0) {
        gsap.fromTo(
          animateElements,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Filter stations by search query
  const filteredStations = stations.filter(station => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      station.name.toLowerCase().includes(query) ||
      station.address.toLowerCase().includes(query) ||
      station.city.toLowerCase().includes(query) ||
      station.operator.toLowerCase().includes(query)
    );
  });

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-forest-dark overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-forest-dark to-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-white/70 hover:text-[#FFC300] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Kembali</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-white font-semibold text-lg">Peta SPKLU</h1>
                <p className="text-white/50 text-xs hidden sm:block">
                  {stats.total} stasiun • {stats.available} tersedia
                </p>
              </div>
            </div>

            {/* Right: Stats & Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-4 bg-forest-dark/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <div className="text-center">
                  <div className="text-[#FFC300] font-semibold text-sm">{stats.total}</div>
                  <div className="text-white/40 text-xs">Stasiun</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <div className="text-[#27AE60] font-semibold text-sm">{stats.available}</div>
                  <div className="text-white/40 text-xs">Tersedia</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <div className="text-[#3498DB] font-semibold text-sm">{stats.fastCharging}</div>
                  <div className="text-white/40 text-xs">Fast Charging</div>
                </div>
              </div>

              <button
                onClick={() => setShowList(!showList)}
                className="md:hidden w-10 h-10 bg-forest-dark/80 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center text-white hover:border-[#FFC300] transition-colors"
              >
                {showList ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-full pt-16">
        {/* Sidebar - Station List */}
        <aside
          className={`absolute md:relative z-10 w-full md:w-96 h-full bg-forest-dark/95 backdrop-blur-sm border-r border-white/10 transform transition-transform duration-300 ${
            showList ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:hidden'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Search */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Cari stasiun, kota, atau operator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-forest-mid border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-white/30 hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="px-4 py-3 border-b border-white/10">
              <FilterPanel
                filters={filters}
                onUpdateFilters={updateFilters}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Station List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredStations.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">Tidak ada stasiun ditemukan</p>
                  <p className="text-white/30 text-xs mt-1">Coba ubah filter atau pencarian</p>
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
                    }}
                    distance={station.distance}
                  />
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative">
          <MapView
            stations={filteredStations}
            selectedStationId={selectedStation?.id || null}
            onStationSelect={selectStation}
            viewport={viewport}
            onViewportChange={setViewport}
            userLocation={userLocation}
          />

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setShowList(!showList)}
            className="absolute bottom-6 left-6 md:hidden z-10 bg-[#FFC300] text-forest-dark px-4 py-2 rounded-full font-medium text-sm shadow-lg flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            {showList ? 'Tutup Daftar' : 'Lihat Daftar'}
          </button>

          {/* Station Detail Panel */}
          {selectedStation && (
            <div className="absolute top-4 right-4 w-80 z-10 animate-in">
              <StationDetail
                station={selectedStation}
                onClose={() => selectStation(null)}
                distance={selectedStation.distance}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
