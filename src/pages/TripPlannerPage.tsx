import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Route, MapPin, Clock, Battery, ArrowLeft, Navigation } from 'lucide-react';

const features = [
  {
    icon: Route,
    title: 'Rute Optimal',
    description: 'Dapatkan rute terbaik dengan pertimbangan jarak tempuh EV kamu',
  },
  {
    icon: MapPin,
    title: 'Charging Stops',
    description: 'Rekomendasi lokasi charging yang strategis di sepanjang perjalanan',
  },
  {
    icon: Clock,
    title: 'Estimasi Waktu',
    description: 'Hitung total waktu perjalanan termasuk waktu charging',
  },
  {
    icon: Battery,
    title: 'Smart Planning',
    description: 'Algoritma pintar yang mengoptimalkan jadwal charging',
  },
];

export default function TripPlannerPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Trip Planner | evhub.id';

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
            <span className="text-[#FFC300]">Trip Planner</span>
          </div>

          <div className="animate-in text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Route className="w-4 h-4 text-[#FFC300]" />
              <span className="text-white/70 text-sm font-medium">Segera Hadir</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white mb-6">
              Trip
              <span className="text-[#FFC300]"> Planner</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Rencanakan perjalanan lintas kota dengan percaya diri. 
              Dapatkan rekomendasi charging stop optimal berdasarkan 
              baterai dan jarak tempuh mobil EV kamu.
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
            src="/feature-trip.jpg"
            alt="Trip Planner Preview"
            className="w-full h-64 md:h-96 object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-transparent to-transparent" />
          
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-forest-dark/90 backdrop-blur-md rounded-2xl px-8 py-6 border border-[#FFC300]/30 text-center">
              <div className="text-5xl mb-4">🛣️</div>
              <h3 className="text-2xl font-sans font-bold text-white mb-2">
                COMING SOON
              </h3>
              <p className="text-white/60">
                Estimasi rilis: Q3 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-forest-mid/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
              Cara Kerja
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Trip planner kami akan membantu kamu merencanakan perjalanan 
              dengan mudah dan tanpa khawatir kehabisan baterai.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Masukkan Tujuan', desc: 'Tentukan titik awal dan tujuan perjalanan' },
              { step: '2', title: 'Pilih Mobil', desc: 'Pilih model EV kamu untuk perhitungan akurat' },
              { step: '3', title: 'Atur Baterai', desc: 'Tentukan level baterai saat ini' },
              { step: '4', title: 'Dapatkan Rute', desc: 'Lihat rute optimal dengan charging stops' },
            ].map((item, i) => (
              <div key={i} className="animate-in text-center">
                <div className="w-16 h-16 bg-[#FFC300]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-sans font-bold text-[#FFC300]">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
              Fitur yang Akan Hadir
            </h2>
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

      {/* Popular Routes Preview */}
      <div className="py-16 bg-forest-mid/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
              Rute Populer
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Berikut adalah beberapa rute populer yang akan didukung oleh trip planner kami.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { from: 'Jakarta', to: 'Bandung', distance: '150 km', stops: '1 stop' },
              { from: 'Jakarta', to: 'Surabaya', distance: '780 km', stops: '3 stops' },
              { from: 'Jakarta', to: 'Yogyakarta', distance: '520 km', stops: '2 stops' },
            ].map((route, i) => (
              <div
                key={i}
                className="animate-in bg-forest-mid/50 rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-[#FFC300]" />
                  <span className="text-white font-semibold">{route.from}</span>
                  <Navigation className="w-4 h-4 text-white/30" />
                  <span className="text-white font-semibold">{route.to}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-white/50">{route.distance}</span>
                  <span className="text-[#FFC300]">{route.stops}</span>
                </div>
              </div>
            ))}
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
