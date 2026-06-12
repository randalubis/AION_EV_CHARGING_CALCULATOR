import { BRANDS } from '../content';

function Track({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className={`flex w-max items-center gap-10 ${ariaHidden ? 'motion-reduce:hidden' : ''}`}
    >
      {BRANDS.map((b) => (
        <div key={b.id} className="flex items-center gap-3">
          <img
            src={`/brands/${b.id}.svg`}
            alt={b.name}
            loading="lazy"
            width={40}
            height={40}
            className="w-10 h-10 rounded-lg opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition"
          />
          <span className="text-white/40 text-sm whitespace-nowrap">{b.name}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Slim logo band. A single flex container animates (translateX -50% over 45s)
 * and holds two identical track copies, so the loop is seamless. Under
 * prefers-reduced-motion the animation is disabled, the duplicate track is
 * hidden, and the container degrades to a static centered wrapped grid.
 */
export function BrandMarquee() {
  return (
    <section className="py-10">
      <p className="text-center text-white/40 text-xs uppercase tracking-widest mb-8">
        Mendukung 73+ model dari 18 merek
      </p>

      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max items-center gap-10 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:w-full">
          <Track />
          <Track ariaHidden />
        </div>
      </div>
    </section>
  );
}
