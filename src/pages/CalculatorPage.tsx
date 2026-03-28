import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EVCalculator } from '../sections/EVCalculator';
import { ArrowLeft, Zap, Info, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  '73+ model EV dari 18 merek',
  'Tarif PLN R1, R2, R3 & Umum',
  'Estimasi waktu & biaya akurat',
  'Support AC & DC charging',
  'Mode input % atau km',
  'Tips kesehatan baterai',
];

export function CalculatorPage() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update page title
    document.title = 'Kalkulator Charging EV | setrum.id';

    const ctx = gsap.context(() => {
      const headerElements = headerRef.current?.querySelectorAll('.header-animate');
      if (headerElements && headerElements.length > 0) {
        gsap.fromTo(
          headerElements,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-forest-dark">
      {/* Page Header */}
      <div ref={headerRef} className="relative pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="header-animate flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link to="/" className="hover:text-[#FFC300] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#FFC300]">Kalkulator</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left: Title & Description */}
            <div className="lg:col-span-2">
              <div className="header-animate inline-flex items-center gap-2 bg-[#FFC300]/10 border border-[#FFC300]/30 rounded-full px-4 py-2 mb-4">
                <Zap className="w-4 h-4 text-[#FFC300]" />
                <span className="text-[#FFC300] text-sm font-medium">Fitur Utama</span>
              </div>

              <h1 className="header-animate text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white mb-4">
                Kalkulator
                <span className="text-[#FFC300]"> Pengisian Daya</span>
              </h1>

              <p className="header-animate text-white/60 text-lg max-w-2xl leading-relaxed mb-6">
                Hitung waktu pengisian, biaya listrik, dan jarak tempuh untuk 
                kendaraan listrik kamu. Mendukung 73+ model EV dari 18 merek 
                dengan tarif PLN yang akurat.
              </p>

              {/* Features */}
              <div className="header-animate grid sm:grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC300] flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info Card */}
            <div className="header-animate bg-forest-mid/50 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 text-[#FFC300] mb-4">
                <Info className="w-5 h-5" />
                <span className="font-semibold">Cara Penggunaan</span>
              </div>
              <ol className="space-y-3 text-white/60 text-sm">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-[#FFC300]/20 rounded-full flex items-center justify-center text-[#FFC300] text-xs font-semibold flex-shrink-0">
                    1
                  </span>
                  Pilih merek dan model EV kamu
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-[#FFC300]/20 rounded-full flex items-center justify-center text-[#FFC300] text-xs font-semibold flex-shrink-0">
                    2
                  </span>
                  Atur level baterai saat ini
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-[#FFC300]/20 rounded-full flex items-center justify-center text-[#FFC300] text-xs font-semibold flex-shrink-0">
                    3
                  </span>
                  Tentukan target pengisian
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-[#FFC300]/20 rounded-full flex items-center justify-center text-[#FFC300] text-xs font-semibold flex-shrink-0">
                    4
                  </span>
                  Pilih jenis charger & tarif
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-[#FFC300]/20 rounded-full flex items-center justify-center text-[#FFC300] text-xs font-semibold flex-shrink-0">
                    5
                  </span>
                  Klik "Hitung" untuk melihat hasil
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <EVCalculator />

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
