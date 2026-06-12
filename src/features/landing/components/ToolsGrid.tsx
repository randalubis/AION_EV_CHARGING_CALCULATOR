import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TOOLS } from '../content';
import { SectionHeading } from './SectionHeading';
import { useReveal } from './useReveal';

export function ToolsGrid() {
  const ref = useReveal<HTMLDivElement>({ selector: '.tool-card' });

  return (
    <section id="tools" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Fitur Platform"
          title="Semua yang Kamu Butuhkan"
          titleAccent="dalam Satu Tempat"
          subtitle="evhub.id menyediakan tools lengkap untuk membantu kamu mengoptimalkan pengalaman memiliki kendaraan listrik di Indonesia."
        />

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isLive = tool.status === 'live';

            return (
              <Link
                key={tool.id}
                to={tool.href}
                className={`tool-card group relative flex flex-col bg-carbon-900/50 rounded-2xl border border-white/10 overflow-hidden transition-all ${
                  isLive
                    ? 'hover:border-volt/50 hover:shadow-2xl hover:shadow-volt/10'
                    : 'opacity-75'
                }`}
              >
                {/* Decorative cover — gradient from tool accent, no photography */}
                <div
                  className="relative h-32 md:h-40 overflow-hidden bg-carbon-900/60"
                  style={{
                    background: `linear-gradient(135deg, ${tool.accent}26 0%, ${tool.accent}0d 45%, transparent 100%)`,
                  }}
                >
                  {/* Large low-opacity icon drifting off the right edge */}
                  <Icon className="absolute -right-4 top-1/2 -translate-y-1/2 w-20 h-20 text-white/10" />

                  {/* Status badge top-right */}
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      isLive
                        ? 'bg-[#27AE60] text-white'
                        : 'bg-white/15 backdrop-blur text-white/80'
                    }`}
                  >
                    {tool.statusText}
                  </div>

                  {/* Solid icon tile anchored bottom-left */}
                  <div
                    className="absolute bottom-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: tool.accent }}
                  >
                    <Icon className="w-6 h-6 text-carbon-950" />
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-xl font-sans font-bold text-white mb-3 transition-colors group-hover:text-volt">
                    {tool.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{tool.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`mt-auto flex items-center gap-2 text-sm font-semibold ${
                      isLive ? 'text-volt' : 'text-white/50'
                    }`}
                  >
                    {isLive ? 'Coba Sekarang' : 'Lihat Detail'}
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
