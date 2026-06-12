import { Link } from 'react-router-dom';
import { ArrowRight, Battery, MapPin, TrendingDown, Zap } from 'lucide-react';
import { useReveal } from './useReveal';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { TOOLS } from '../content';

export function HeroSection() {
  const ref = useReveal<HTMLElement>({ selector: '.hero-animate', immediate: true });
  const reduced = usePrefersReducedMotion();

  const liveTools = TOOLS.filter((t) => t.status === 'live');

  return (
    <section
      ref={ref}
      className="relative min-h-[88vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-dark via-forest-mid to-forest-dark" />

      {/* Decorative glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFC300]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFC300]/3 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <div className="hero-animate inline-flex items-center gap-2 bg-[#FFC300]/10 border border-[#FFC300]/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-[#FFC300] rounded-full animate-pulse" />
              <span className="text-[#FFC300] text-sm font-medium">Platform EV Indonesia</span>
            </div>

            <h1 className="hero-animate text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight mb-6">
              Platform Lengkap untuk
              <span className="block text-[#FFC300]">Pemilik EV Indonesia</span>
            </h1>

            <p className="hero-animate font-body text-white/60 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Hitung waktu cas untuk{' '}
              <span className="font-sans font-semibold text-white/90">73+ model EV</span>, temukan SPKLU
              dari{' '}
              <span className="font-sans font-semibold text-white/90">3.000+ stasiun PLN</span>, bandingkan
              biaya, dan gabung komunitas — semua dirancang khusus untuk kondisi Indonesia.
            </p>

            <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/kalkulator"
                className="inline-flex items-center justify-center gap-2 bg-[#FFC300] hover:bg-[#FFD60A] text-forest-dark font-sans font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
              >
                <Zap className="w-5 h-5" />
                Coba Kalkulator
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/peta-spklu"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-sans font-semibold py-4 px-8 rounded-xl transition-all border border-white/20"
              >
                <MapPin className="w-5 h-5" />
                Lihat Peta SPKLU
              </Link>
            </div>

            {/* Mobile-only tool chips — hero image is hidden on mobile, so this
                gives mobile users a quick visual entry into the live tools. */}
            <div className="hero-animate lg:hidden mt-8 flex gap-3 overflow-x-auto pb-2 justify-center lg:justify-start">
              {liveTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    to={tool.href}
                    className="flex-shrink-0 inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-colors"
                  >
                    <Icon className="w-4 h-4" style={{ color: tool.accent }} />
                    <span className="text-white/70 text-sm font-medium whitespace-nowrap">
                      {tool.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Hero image with floating clickable cards (desktop only) */}
          <div className="hero-animate relative hidden lg:block">
            <div className="relative">
              <img
                src="/hero-ev.png"
                alt="Electric Vehicle Charging"
                loading="eager"
                className="w-full max-w-lg mx-auto drop-shadow-2xl"
              />
              <Link
                to="/kalkulator"
                className="absolute -bottom-4 -left-4 bg-forest-mid/90 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl hover:border-[#FFC300]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFC300]/20 rounded-lg flex items-center justify-center">
                    <Battery className="w-5 h-5 text-[#FFC300]" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Cek waktu cas</div>
                    <div className="text-white/50 text-xs">untuk EV-mu</div>
                  </div>
                </div>
              </Link>
              <Link
                to="/tco-calculator"
                className="absolute -top-4 -right-4 bg-forest-mid/90 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl hover:border-[#27AE60]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#27AE60]/20 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-[#27AE60]" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Bandingkan biaya</div>
                    <div className="text-white/50 text-xs">EV vs Bensin</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator — hidden for reduced-motion users */}
      {!reduced && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <div className="w-5 h-9 border border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-1 bg-[#FFC300]/70 rounded-full animate-bounce" />
          </div>
        </div>
      )}
    </section>
  );
}
