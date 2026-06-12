import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { STEPS } from '../content';
import { SectionHeading } from './SectionHeading';
import { useReveal } from './useReveal';

export function HowItWorks() {
  const ref = useReveal<HTMLDivElement>({ selector: '.step-item' });

  return (
    <section className="bg-forest-mid/30 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Tiga Langkah"
          titleAccent="Menuju Perjalanan Listrik"
        />

        <div ref={ref} className="relative grid md:grid-cols-3 gap-8">
          {/* Connector: dashed line behind the icon tiles, md+ only. The tiles
              are h-12 (3rem); top-6 centers the line on them. */}
          <div
            aria-hidden
            className="hidden md:block absolute top-6 left-0 right-0 border-t border-dashed border-white/10"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const number = String(i + 1).padStart(2, '0');

            return (
              <div key={step.title} className="step-item relative">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-volt/15 flex items-center justify-center shrink-0">
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
