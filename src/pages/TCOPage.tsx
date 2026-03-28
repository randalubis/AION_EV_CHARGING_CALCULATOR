import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { TrendingDown, Car, Fuel, Wrench, ArrowLeft, Calculator } from 'lucide-react';

const costFactors = [
  {
    icon: Fuel,
    title: 'Bahan Bakar vs Listrik',
    description: 'Bandingkan biaya bensin per liter dengan biaya kWh listrik',
  },
  {
    icon: Wrench,
    title: 'Biaya Servis',
    description: 'EV memiliki lebih sedikit komponen bergerak = biaya servis lebih rendah',
  },
  {
    icon: Car,
    title: 'Depresiasi',
    description: 'Analisis nilai jual kembali EV vs mobil bensin',
  },
  {
    icon: TrendingDown,
    title: 'Total Penghematan',
    description: 'Lihat berapa banyak yang bisa kamu hemat selama 5 tahun',
  },
];

export function TCOPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'TCO Calculator | setrum.id';

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
            <span className="text-[#FFC300]">TCO Calculator</span>
          </div>

          <div className="animate-in text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Calculator className="w-4 h-4 text-[#FFC300]" />
              <span className="text-white/70 text-sm font-medium">Segera Hadir</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white mb-6">
              TCO
              <span className="text-[#FFC300]"> Calculator</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Total Cost of Ownership — bandingkan biaya kepemilikan EV vs mobil bensin 
              selama 3-5 tahun termasuk bahan bakar, listrik, servis, dan depresiasi.
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
            src="/feature-tco.jpg"
            alt="TCO Calculator Preview"
            className="w-full h-64 md:h-96 object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-transparent to-transparent" />
          
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-forest-dark/90 backdrop-blur-md rounded-2xl px-8 py-6 border border-[#FFC300]/30 text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-sans font-bold text-white mb-2">
                COMING SOON
              </h3>
              <p className="text-white/60">
                Estimasi rilis: Q4 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What is TCO */}
      <div className="py-16 bg-forest-mid/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
                Apa itu TCO?
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                <strong className="text-white">Total Cost of Ownership (TCO)</strong> adalah 
                total biaya yang dikeluarkan untuk memiliki dan mengoperasikan kendaraan 
                selama periode tertentu, biasanya 3-5 tahun.
              </p>
              <p className="text-white/60 leading-relaxed mb-6">
                TCO tidak hanya mencakup harga pembelian, tetapi juga biaya operasional 
                seperti bahan bakar/listrik, servis, asuransi, dan depresiasi.
              </p>
              <div className="bg-[#27AE60]/10 border border-[#27AE60]/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#27AE60] font-semibold mb-2">
                  <TrendingDown className="w-5 h-5" />
                  Fakta Menarik
                </div>
                <p className="text-white/60 text-sm">
                  EV umumnya memiliki TCO yang lebih rendah dibandingkan mobil bensin 
                  setelah 3-4 tahun penggunaan, terutama karena biaya bahan bakar dan 
                  perawatan yang lebih rendah.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Harga Beli', ev: 'Lebih Mahal', petrol: 'Lebih Murah' },
                { label: 'Bahan Bakar', ev: 'Rp 1.500/km', petrol: 'Rp 1.000/km' },
                { label: 'Servis', ev: '70% Lebih Murah', petrol: 'Standard' },
                { label: '5 Tahun TCO', ev: 'Lebih Hemat', petrol: 'Lebih Mahal' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="animate-in bg-forest-mid/50 rounded-xl p-4 border border-white/10"
                >
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-2">
                    {item.label}
                  </div>
                  <div className="text-[#27AE60] font-semibold text-sm">{item.ev}</div>
                  <div className="text-white/30 text-xs">vs {item.petrol}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cost Factors */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
              Faktor Biaya yang Dianalisis
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              TCO Calculator kami akan menganalisis semua faktor biaya berikut 
              untuk memberikan perbandingan yang akurat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {costFactors.map((factor, i) => {
              const Icon = factor.icon;
              return (
                <div
                  key={i}
                  className="animate-in bg-forest-mid/50 rounded-xl p-6 border border-white/10 hover:border-[#FFC300]/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFC300]/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#FFC300]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{factor.title}</h3>
                  <p className="text-white/50 text-sm">{factor.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sample Comparison */}
      <div className="py-16 bg-forest-mid/30">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
              Contoh Perbandingan
            </h2>
            <p className="text-white/60">
              Perkiraan biaya kepemilikan selama 5 tahun (dalam jutaan Rupiah)
            </p>
          </div>

          <div className="animate-in bg-forest-mid/50 rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10">
              <div className="text-white/50 text-sm">Komponen Biaya</div>
              <div className="text-[#FFC300] font-semibold text-center">EV</div>
              <div className="text-white/70 font-semibold text-center">Mobil Bensin</div>
            </div>
            {[
              { item: 'Harga Beli', ev: '450', petrol: '350' },
              { item: 'Bahan Bakar (5 th)', ev: '45', petrol: '180' },
              { item: 'Servis (5 th)', ev: '15', petrol: '75' },
              { item: 'Asuransi (5 th)', ev: '45', petrol: '60' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 p-4 border-b border-white/5">
                <div className="text-white/70">{row.item}</div>
                <div className="text-center text-white">{row.ev}jt</div>
                <div className="text-center text-white">{row.petrol}jt</div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-4 p-6 bg-[#FFC300]/10">
              <div className="text-white font-semibold">Total 5 Tahun</div>
              <div className="text-center text-[#FFC300] font-bold">555jt</div>
              <div className="text-center text-white font-bold">665jt</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6 bg-[#27AE60]/10">
              <div className="text-[#27AE60] font-semibold">Penghematan</div>
              <div className="text-center text-[#27AE60] font-bold text-lg">110jt</div>
              <div className="text-center text-white/50">—</div>
            </div>
          </div>

          <p className="text-white/40 text-sm text-center mt-4">
            *Angka di atas adalah estimasi. Hasil aktual dapat bervariasi.
          </p>
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
