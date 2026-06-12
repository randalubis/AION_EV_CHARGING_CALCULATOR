import { useEffect, useState } from 'react';

/**
 * Mirrors the user's `prefers-reduced-motion` system preference.
 * Returns `true` when the user has asked OSes / browsers to minimize
 * non-essential animation. Use this to skip or shorten GSAP scrollers,
 * parallax effects, and other vestibular-aggressive motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduce(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduce;
}
