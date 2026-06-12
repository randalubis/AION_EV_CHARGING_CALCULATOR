import { Link } from 'react-router-dom';
import { Users, Zap } from 'lucide-react';
import { useReveal } from './useReveal';

export function FinalCTA() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-carbon-900/30 to-carbon-950">
      <div ref={ref} className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-volt/20 bg-carbon-900/40 px-6 py-16 md:py-20 text-center">
          {/* Glow orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-volt/15 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-volt/15 blur-[100px]"
          />
          {/* Faint grid texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white mb-6">
              Siap Mengoptimalkan
              <span className="block text-volt">Pengalaman EV Kamu?</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Mulai dengan kalkulator charging kami dan lihat berapa banyak yang bisa kamu hemat dengan
              beralih ke kendaraan listrik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/kalkulator"
                className="inline-flex items-center justify-center gap-2 bg-volt hover:bg-volt-bright text-carbon-950 font-sans font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-[0_0_48px] shadow-volt/40"
              >
                <Zap className="w-5 h-5" aria-hidden />
                Coba Kalkulator Gratis
              </Link>
              <Link
                to="/komunitas"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-sans font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
              >
                <Users className="w-5 h-5" aria-hidden />
                Gabung Komunitas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
