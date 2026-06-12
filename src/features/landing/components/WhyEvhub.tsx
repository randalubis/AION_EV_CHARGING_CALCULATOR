import { VALUE_PROPS } from '../content';
import { SectionHeading } from './SectionHeading';
import { useReveal } from './useReveal';

export function WhyEvhub() {
  const ref = useReveal<HTMLDivElement>({ selector: '.why-card' });

  return (
    <section className="py-24 md:py-32">
      <div ref={ref} className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Mengapa evhub.id"
          title="Platform"
          titleAccent="Terpercaya"
          subtitle='evhub.id dibangun oleh tim yang memahami pertanyaan nyata pemilik kendaraan listrik di Indonesia — "Apakah saya bisa sampai?" dan "Bagaimana cara charging lebih pintar?"'
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUE_PROPS.map((prop) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.title}
                className="why-card bg-carbon-900/40 border border-white/10 rounded-2xl p-6 hover:border-volt/30 transition"
              >
                <div className="w-11 h-11 rounded-lg bg-volt/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-volt" aria-hidden />
                </div>
                <h3 className="text-white font-bold mt-4">{prop.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mt-2">{prop.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
