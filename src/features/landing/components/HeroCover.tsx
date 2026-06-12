import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Zap } from 'lucide-react';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { STATS } from '../content';
import { CountUp } from './CountUp';
import { useReveal } from './useReveal';

/**
 * Full-bleed hero. The cover photo (/hero-cover.webp) is optional by design:
 * the img starts at opacity-0 and only fades in onLoad, with a volt radial
 * glow underneath — so a missing/slow image still looks intentional, and
 * dropping the generated file into public/ upgrades the hero with no code
 * change.
 */
export function HeroCover() {
  const ref = useReveal<HTMLDivElement>({ selector: '.hero-animate', immediate: true });
  const reduced = usePrefersReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-carbon-950">
      {/* Fallback / underlay: volt radial glow, always present */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 55%, rgba(198, 255, 77, 0.10), transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(198, 255, 77, 0.05), transparent 55%)',
        }}
      />

      {/* Cover image — fades in when loaded; absent file = glow-only hero */}
      <picture>
        <source media="(max-width: 640px)" srcSet="/hero-cover-mobile.webp" />
        <img
          src="/hero-cover.webp"
          alt=""
          aria-hidden
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-[62%_center] transition-opacity duration-700 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgLoaded && !reduced ? 'motion-safe:animate-hero-zoom' : ''}`}
        />
      </picture>

      {/* Scrims for text + navbar legibility */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-carbon-950 via-carbon-950/70 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-carbon-950/80 to-transparent" />
      <div aria-hidden className="hidden lg:block absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-carbon-950/60 to-transparent" />

      {/* Content */}
      <div ref={ref} className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-28 md:pb-32 pt-40">
        <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
          <div className="hero-animate inline-flex items-center gap-2 bg-volt/10 border border-volt/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-volt rounded-full animate-pulse" />
            <span className="text-volt text-sm font-medium">Platform EV Indonesia</span>
          </div>

          <h1 className="hero-animate text-4xl md:text-6xl lg:text-7xl font-sans font-bold text-white leading-[1.05] tracking-tight mb-6">
            Berkendara Listrik,
            <span className="block text-volt">Tanpa Ragu.</span>
          </h1>

          <p className="hero-animate font-body text-white/70 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            Hitung waktu cas untuk 73+ model EV, temukan SPKLU dari 3.000+ stasiun PLN,
            bandingkan biaya, dan gabung komunitas — dirancang khusus untuk kondisi Indonesia.
          </p>

          <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/kalkulator"
              className="inline-flex items-center justify-center gap-2 bg-volt hover:bg-volt-bright text-carbon-950 font-sans font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-[0_0_32px] shadow-volt/30"
            >
              <Zap className="w-5 h-5" />
              Coba Kalkulator
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/peta-spklu"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/15 hover:border-volt/40 text-white font-sans font-semibold py-4 px-8 rounded-xl transition-all"
            >
              <MapPin className="w-5 h-5" />
              Lihat Peta SPKLU
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar — glass panel along the hero's bottom edge */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-8">
        <div className="hero-animate bg-carbon-900/60 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-6 md:py-7 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-sans font-bold text-volt drop-shadow-[0_0_12px_rgba(198,255,77,0.35)]">
                <CountUp value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-white/50 text-xs md:text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      {!reduced && (
        <div aria-hidden className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-white/20">
          <div className="w-5 h-9 border border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1 bg-volt rounded-full animate-bounce" />
          </div>
        </div>
      )}
    </section>
  );
}
