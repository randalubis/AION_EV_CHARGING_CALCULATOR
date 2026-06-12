import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { STATS } from '../content';

const DURATION = 1200;

/** Animates a number from 0 to `value` once it scrolls into view. */
function CountUp({ value }: { value: number }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // Only the animated path goes through state; static paths render `value` directly.
  const [animated, setAnimated] = useState<number | null>(null);
  const canAnimate = !reduced && typeof IntersectionObserver !== 'undefined';

  useEffect(() => {
    const el = ref.current;
    if (!canAnimate || !el) return;

    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [canAnimate, value]);

  const display = canAnimate ? (animated ?? 0) : value;
  return <span ref={ref}>{display.toLocaleString('id-ID')}</span>;
}

export function StatsStrip() {
  return (
    <section className="py-16 bg-forest-mid/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-sans font-bold text-[#FFC300] mb-2">
                <CountUp value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
