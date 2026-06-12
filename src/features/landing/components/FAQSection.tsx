import { ChevronRight } from 'lucide-react';
import { faqConfig } from '../../../config';
import { SectionHeading } from './SectionHeading';
import { useReveal } from './useReveal';

export function FAQSection() {
  const ref = useReveal<HTMLDivElement>({ selector: 'details' });

  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Pertanyaan Umum"
          title="Yang Sering"
          titleAccent="Ditanyakan"
        />

        <div ref={ref} className="space-y-4">
          {faqConfig.faqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-carbon-900/50 rounded-xl border border-white/10 open:border-volt/30 transition-colors overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="text-white font-semibold pr-4">{faq.question}</span>
                <ChevronRight
                  className="w-5 h-5 text-volt transition-transform group-open:rotate-90 flex-shrink-0"
                  aria-hidden
                />
              </summary>
              <div className="px-6 pb-6 text-white/60 leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>

        <p className="text-center text-white/60 mt-10">
          Masih punya pertanyaan?{' '}
          <a href="mailto:hello@evhub.id" className="text-volt hover:underline">
            Hubungi kami
          </a>
        </p>
      </div>
    </section>
  );
}
