import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { MapPin, Navigation, Search, Bell, ArrowLeft } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Peta Interaktif',
    description: 'Lihat semua lokasi SPKLU di Indonesia dengan peta yang mudah digunakan',
  },
  {
    icon: Navigation,
    title: 'Filter Kompatibilitas',
    description: 'Tampilkan hanya stasiun yang kompatibel dengan mobil EV kamu',
  },
  {
    icon: Search,
    title: 'Pencarian Cerdas',
    description: 'Cari SPKLU berdasarkan lokasi, tipe charger, atau ketersediaan',
  },
  {
    icon: Bell,
    title: 'Notifikasi Real-time',
    description: 'Dapatkan update status charger dan ketersediaan terkini',
  },
];

export function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Peta SPKLU | evhub.id';

    const ctx = gsap.context(() => {
      const animateElements = containerRef.current?.querySelectorAll('.animate-in');
      if (animateElements && animateElements.length > 0) {
        gsap.fromTo(
          animateElements,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-forest-dark">
      {/* Header */}
      <div className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="animate-in flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link to="/" className="hover:text-[#FFC300] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#FFC300]">Peta SPKLU</span>
          </div>

          <div className="animate-in text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <MapPin className="w-4 h-4 text-[#FFC300]" />
              <span className="text-white/70 text-sm font-medium">Segera Hadir</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white mb-6">
              Peta
              <span className="text-[#FFC300]"> SPKLU</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Temukan stasiun pengisian kendaraan listrik umum di seluruh Indonesia 
              dengan informasi real-time tentang ketersediaan dan tipe charger.
            </p>

            {/* Notify Form */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12">
              <input
                type="email"
                placeholder="Masukkan email kamu"
                className="flex-1 bg-forest-mid border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
              />
              <button className="bg-[#FFC300] hover:bg-[#FFD60A] text-forest-dark font-semibold px-6 py-3 rounded-xl transition-colors">
                Beritahu Saya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Image */}
      <div className="animate-in relative max-w-6xl mx-auto px-6 md:px-12 mb-20">
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img
            src="/feature-map.jpg"
            alt="Peta SPKLU Preview"
            className="w-full h-64 md:h-96 object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-transparent to-transparent" />
          
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-forest-dark/90 backdrop-blur-md rounded-2xl px-8 py-6 border border-[#FFC300]/30 text-center">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-2xl font-sans font-bold text-white mb-2">
                COMING SOON
              </h3>
              <p className="text-white/60">
                Estimasi rilis: Q2 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-forest-mid/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
              Fitur yang Akan Hadir
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Berikut adalah fitur-fitur menarik yang sedang kami kembangkan 
              untuk peta SPKLU kami.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="animate-in bg-forest-mid/50 rounded-xl p-6 border border-white/10 hover:border-[#FFC300]/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFC300]/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#FFC300]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-sans font-bold text-[#FFC300] mb-2">
                1000+
              </div>
              <div className="text-white/50 text-sm">Lokasi SPKLU</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-sans font-bold text-[#FFC300] mb-2">
                34
              </div>
              <div className="text-white/50 text-sm">Provinsi</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-sans font-bold text-[#FFC300] mb-2">
                Real-time
              </div>
              <div className="text-white/50 text-sm">Update Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#FFC300] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
