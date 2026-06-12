import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Navigation, Zap } from 'lucide-react';
import { CountUp } from './CountUp';
import { SectionHeading } from './SectionHeading';
import { useReveal } from './useReveal';

const BULLETS = [
  { icon: MapPin, text: 'Filter konektor, daya, dan wilayah' },
  { icon: Zap, text: 'Detail tipe charger di tiap stasiun' },
  { icon: Navigation, text: 'Navigasi langsung ke Google Maps / Waze' },
];

export function MapTeaser() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32">
      <div ref={ref} className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <SectionHeading
            align="left"
            eyebrow="Peta SPKLU"
            title="3.000+ Titik Cas"
            titleAccent="Seluruh Indonesia"
            subtitle="Data stasiun bersumber dari PLN — lengkap dengan tipe konektor dan daya, bukan perkiraan."
          />

          <ul className="mt-8 space-y-4">
            {BULLETS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="w-9 h-9 bg-volt/15 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-volt" />
                </span>
                <span className="text-white/70 text-sm">{text}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/peta-spklu"
            className="mt-8 inline-flex items-center gap-2 bg-volt hover:bg-volt-bright text-carbon-950 font-sans font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_24px] shadow-volt/25"
          >
            Jelajahi Peta
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right: photo panel.
            Placeholder stock photo (Unsplash license) — swap public/map-teaser.webp
            for a real product screenshot of the SPKLU map later; no code change needed. */}
        <div className="relative border border-white/10 rounded-3xl overflow-hidden aspect-[4/3] group">
          <img
            src="/map-teaser.webp"
            alt="Stasiun pengisian kendaraan listrik"
            loading="lazy"
            width={1200}
            height={900}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Carbon tint + volt edge glow so the photo sits in the theme */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-carbon-950/85 via-carbon-950/20 to-transparent" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 80% 90%, rgba(198, 255, 77, 0.12), transparent 60%)',
            }}
          />

          {/* Floating count chip */}
          <div className="absolute top-4 right-4 bg-carbon-950/80 backdrop-blur border border-volt/30 rounded-xl px-4 py-2.5">
            <div className="text-volt font-sans font-bold text-xl">
              <CountUp value={3029} />+
            </div>
            <div className="text-white/50 text-xs">SPKLU terdaftar</div>
          </div>

          {/* Bottom caption strip */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-volt animate-pulse" aria-hidden />
            <span className="text-white/80 text-sm font-medium">
              SPKLU PLN di seluruh Indonesia
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
