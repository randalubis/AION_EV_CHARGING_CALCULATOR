import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STEPS } from '../content';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { SectionHeading } from './SectionHeading';
import { useReveal } from './useReveal';

gsap.registerPlugin(ScrollTrigger);

export function HowItWorks() {
  const ref = useReveal<HTMLDivElement>({ selector: '.step-item' });
  const sectionRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const beam = beamRef.current;
    if (reduced || !section || !beam) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            beam,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: 'power2.out',
              transformOrigin: 'left center',
            },
          );
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="bg-carbon-900/30 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Tiga Langkah"
          titleAccent="Menuju Perjalanan Listrik"
        />

        <div ref={ref} className="relative grid md:grid-cols-3 gap-8">
          {/* Connector: energy beam behind the glow nodes, md+ only. The nodes
              are h-12 (3rem); top-6 centers the beam on them. */}
          <div
            ref={beamRef}
            aria-hidden
            className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-volt/60 to-transparent"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const number = String(i + 1).padStart(2, '0');

            return (
              <div key={step.title} className="step-item relative">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-carbon-900 border border-volt/50 shadow-[0_0_24px_-4px] shadow-volt/50 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-volt" />
                  </div>
                  <span className="text-5xl font-sans font-bold text-white/10 leading-none">
                    {number}
                  </span>
                </div>

                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{step.body}</p>

                <Link
                  to={step.href}
                  className="group inline-flex items-center gap-1.5 text-volt hover:text-volt-bright text-sm font-semibold transition-colors"
                >
                  {step.linkText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
