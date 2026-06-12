import { Link } from 'react-router-dom';
import { Users, Zap } from 'lucide-react';
import { useReveal } from './useReveal';

export function FinalCTA() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-forest-mid/30 to-forest-dark">
      <div ref={ref} className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white mb-6">
          Siap Mengoptimalkan
          <span className="block text-[#FFC300]">Pengalaman EV Kamu?</span>
        </h2>
        <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
          Mulai dengan kalkulator charging kami dan lihat berapa banyak yang bisa kamu hemat dengan
          beralih ke kendaraan listrik.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/kalkulator"
            className="inline-flex items-center justify-center gap-2 bg-[#FFC300] hover:bg-[#FFD60A] text-forest-dark font-sans font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
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
    </section>
  );
}
