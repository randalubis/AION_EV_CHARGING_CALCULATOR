import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Zap, HelpCircle } from 'lucide-react';
import { EVCalculator } from '../sections/EVCalculator';
import { HowToUseDialog } from '../features/calculator/components/HowToUseDialog';

export default function CalculatorPage() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Kalkulator Charging EV | evhub.id';

    const ctx = gsap.context(() => {
      const elements = headerRef.current?.querySelectorAll('.header-animate');
      if (elements?.length) {
        gsap.fromTo(
          elements,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-forest-dark">
      {/* Compact header */}
      <div ref={headerRef} className="pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="header-animate flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link to="/" className="hover:text-[#FFC300] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-[#FFC300]">Kalkulator</span>
          </div>

          <div className="header-animate flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-[#FFC300]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-[#FFC300]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-white font-bold text-xl md:text-2xl leading-tight">
                  Kalkulator Pengisian Daya
                </h1>
                <p className="text-white/50 text-xs md:text-sm">
                  Estimasi waktu, biaya, dan jarak tempuh pengisian EV
                </p>
              </div>
            </div>
            <HowToUseDialog
              trigger={
                <button className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Cara pakai</span>
                </button>
              }
            />
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
