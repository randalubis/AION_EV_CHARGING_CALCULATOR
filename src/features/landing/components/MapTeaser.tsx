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

// Plausible station positions across the archipelago (Jawa densest).
const DOTS: { x: number; y: number; halo?: boolean }[] = [
  // Sumatra
  { x: 70, y: 70 },
  { x: 85, y: 95, halo: true },
  { x: 100, y: 120 },
  { x: 115, y: 140 },
  // Kalimantan
  { x: 190, y: 80 },
  { x: 210, y: 100, halo: true },
  { x: 230, y: 95 },
  { x: 215, y: 125 },
  // Sulawesi
  { x: 275, y: 90 },
  { x: 285, y: 110, halo: true },
  { x: 270, y: 130 },
  // Jawa (dense)
  { x: 150, y: 165 },
  { x: 165, y: 168, halo: true },
  { x: 180, y: 170 },
  { x: 195, y: 168 },
  { x: 210, y: 172 },
  { x: 225, y: 170, halo: true },
  { x: 240, y: 175 },
  // Bali / Nusa Tenggara
  { x: 255, y: 175 },
  { x: 275, y: 178 },
  // Papua
  { x: 350, y: 120 },
  { x: 365, y: 140 },
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

        {/* Right: map panel */}
        <div className="relative bg-carbon-900/40 border border-white/10 rounded-3xl p-6 overflow-hidden aspect-[4/3]">
          <svg viewBox="0 0 400 200" className="w-full h-full" role="img" aria-label="Peta sebaran SPKLU di Indonesia">
            <g fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)" strokeWidth={1}>
              {/* Sumatra */}
              <path d="M55 50 Q70 60 80 85 Q100 115 125 150 Q120 158 110 150 Q90 120 70 95 Q52 70 55 50 Z" />
              {/* Jawa */}
              <path d="M140 162 Q190 155 250 168 Q255 178 245 182 Q190 175 145 175 Q135 170 140 162 Z" />
              {/* Kalimantan */}
              <path d="M175 60 Q215 55 245 80 Q250 110 225 135 Q200 140 190 120 Q170 95 175 60 Z" />
              {/* Sulawesi */}
              <path d="M268 70 Q288 78 282 100 Q295 115 278 132 Q262 128 270 110 Q258 92 268 70 Z" />
              {/* Papua */}
              <path d="M325 100 Q360 95 385 118 Q380 150 350 152 Q330 140 325 120 Q320 108 325 100 Z" />
              {/* Bali / Nusa Tenggara minor islands */}
              <circle cx="258" cy="178" r="3" />
              <circle cx="275" cy="180" r="3" />
              <circle cx="292" cy="181" r="2.5" />
              <circle cx="308" cy="180" r="2.5" />
            </g>

            {/* Station dots */}
            {DOTS.map((d, i) => (
              <g key={i}>
                {d.halo && (
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r="6"
                    fill="none"
                    stroke="#C6FF4D"
                    strokeOpacity="0.5"
                    className="motion-safe:animate-ping"
                    style={{ animationDelay: `${(i % 5) * 0.6}s` }}
                  />
                )}
                <circle cx={d.x} cy={d.y} r="2.5" fill="#C6FF4D" />
              </g>
            ))}
          </svg>

          {/* Floating count chip */}
          <div className="absolute top-4 right-4 bg-carbon-950/80 backdrop-blur border border-volt/30 rounded-xl px-4 py-2.5">
            <div className="text-volt font-sans font-bold text-xl">
              <CountUp value={3029} />+
            </div>
            <div className="text-white/50 text-xs">SPKLU terdaftar</div>
          </div>
        </div>
      </div>
    </section>
  );
}
