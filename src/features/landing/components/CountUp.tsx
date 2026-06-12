import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

const DURATION = 1200;

/**
 * Animates a number from 0 to `value` once it scrolls into view.
 * Renders the final value statically under prefers-reduced-motion or when
 * IntersectionObserver is unavailable. id-ID locale formatting (3029 → "3.029").
 */
export function CountUp({ value }: { value: number }) {
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
