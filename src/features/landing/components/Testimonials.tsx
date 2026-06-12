import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS, type Testimonial } from '../testimonials';
import { SectionHeading } from './SectionHeading';
import { useReveal } from './useReveal';

const TOOL_LABELS: Record<Testimonial['tool'], string> = {
  kalkulator: 'Kalkulator',
  peta: 'Peta SPKLU',
  tco: 'TCO',
  komunitas: 'Komunitas',
};

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

export function Testimonials() {
  const ref = useReveal<HTMLDivElement>();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    };
    // Defer the initial sync out of the effect body (lint: no sync setState in effects).
    const raf = requestAnimationFrame(onReInit);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onReInit);
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onReInit);
    };
  }, [emblaApi]);

  return (
    <section className="py-24 md:py-32 bg-carbon-900/30">
      <div ref={ref} className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Cerita Pengguna"
          title="Apa Kata"
          titleAccent="Pemilik EV"
          subtitle="Pengalaman nyata dari komunitas — dari cas harian sampai perjalanan lintas kota."
        />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="flex-[0_0_88%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4"
              >
                <div className="h-full flex flex-col bg-carbon-900/50 border border-white/10 rounded-2xl p-6">
                  <Quote className="w-8 h-8 text-volt/40" aria-hidden />
                  <p className="text-white/70 leading-relaxed flex-1 mt-3">“{t.quote}”</p>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: `hsl(${t.accentHue} 45% 22%)`,
                        color: `hsl(${t.accentHue} 80% 70%)`,
                      }}
                      aria-hidden
                    >
                      {initials(t.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-semibold">{t.name}</div>
                      <div className="text-white/45 text-xs">
                        {t.vehicle} · {t.region}
                      </div>
                    </div>
                    <span className="ml-auto text-[10px] uppercase tracking-wide bg-volt/10 text-volt/90 px-2 py-1 rounded shrink-0">
                      {TOOL_LABELS[t.tool]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Sebelumnya"
            className="w-10 h-10 rounded-full border border-white/15 text-white/60 hover:border-volt/50 hover:text-volt transition flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden />
          </button>

          <div className="flex items-center gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Ke testimoni ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === selectedIndex ? 'bg-volt w-6' : 'bg-white/20 w-2'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Berikutnya"
            className="w-10 h-10 rounded-full border border-white/15 text-white/60 hover:border-volt/50 hover:text-volt transition flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
