import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  /** CSS selector for children to stagger; omit to animate the container itself. */
  selector?: string;
  /** Animate on mount instead of on scroll-into-view (for above-the-fold sections). */
  immediate?: boolean;
  stagger?: number;
  y?: number;
  duration?: number;
}

/**
 * Scroll-reveal animation with a built-in `prefers-reduced-motion` guard.
 * Elements stay visible by default (no opacity-0 in markup), so content is
 * never hidden for reduced-motion users or if JS fails — the animation only
 * sets initial state at the moment it starts.
 *
 * Usage:
 *   const ref = useReveal<HTMLDivElement>({ selector: '.reveal-item' });
 *   return <section ref={ref}>…</section>
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: RevealOptions = {}) {
  const { selector, immediate = false, stagger = 0.12, y = 40, duration = 0.7 } = options;
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) return;

    const targets: Element[] = selector ? Array.from(el.querySelectorAll(selector)) : [el];
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      const animate = () => {
        gsap.fromTo(
          targets,
          { y, opacity: 0 },
          { y: 0, opacity: 1, duration, stagger, ease: 'power3.out' },
        );
      };

      if (immediate) {
        animate();
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          once: true,
          onEnter: animate,
        });
      }
    }, el);

    return () => ctx.revert();
  }, [reduced, selector, immediate, stagger, y, duration]);

  return ref;
}
