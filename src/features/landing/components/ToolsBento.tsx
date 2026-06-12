import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TOOLS, type Tool } from '../content';
import { SectionHeading } from './SectionHeading';
import { useReveal } from './useReveal';

/** Bento sizing keyed by tool id — content.ts stays presentation-free. */
const SPAN: Record<string, string> = {
  kalkulator: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
  peta: '',
  tco: '',
  komunitas: '',
  trip: 'md:col-span-2 lg:col-span-2',
};

function StatusBadge({ tool }: { tool: Tool }) {
  const isLive = tool.status === 'live';
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${
        isLive
          ? 'bg-volt/15 text-volt border-volt/30'
          : 'bg-white/10 text-white/60 border-white/10'
      }`}
    >
      {isLive ? 'Tersedia' : 'Segera Hadir'}
    </span>
  );
}

function FeatureChips({ features }: { features: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {features.map((f) => (
        <span key={f} className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded">
          {f}
        </span>
      ))}
    </div>
  );
}

function HeroCell({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link
      to={tool.href}
      className={`bento-cell group rounded-2xl p-px bg-gradient-to-br from-volt/40 via-white/10 to-transparent transition-transform hover:-translate-y-0.5 ${SPAN[tool.id]}`}
    >
      <div className="bg-carbon-900 rounded-[15px] h-full p-7 relative overflow-hidden flex flex-col">
        {/* Radial volt glow + ghost product image */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 60% at 85% 90%, rgba(198,255,77,0.12), transparent 60%)',
          }}
        />
        <img
          src="/hero-ev.png"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute -bottom-6 -right-8 w-72 opacity-40 pointer-events-none"
        />

        <div className="relative flex items-start justify-between mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: tool.accent }}
          >
            <Icon className="w-5 h-5 text-carbon-950" />
          </div>
          <StatusBadge tool={tool} />
        </div>

        <h3 className="relative text-2xl font-sans font-bold text-white mb-3 transition-colors group-hover:text-volt">
          {tool.title}
        </h3>
        <p className="relative text-white/55 text-sm mb-4 max-w-md">{tool.description}</p>

        <div className="relative mb-4">
          <FeatureChips features={tool.features} />
        </div>

        <div className="relative mt-auto pt-3 flex items-center gap-2 text-volt text-sm font-semibold">
          Coba Sekarang
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function WideCell({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link
      to={tool.href}
      className={`bento-cell group bg-carbon-900/50 border border-white/10 rounded-2xl p-6 flex items-center gap-5 opacity-75 ${SPAN[tool.id]}`}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: tool.accent }}
      >
        <Icon className="w-5 h-5 text-carbon-950" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-sans font-bold text-white mb-1">{tool.title}</h3>
        <p className="text-white/55 text-sm line-clamp-2 mb-2">{tool.description}</p>
        <div className="flex items-center gap-2 text-white/50 text-sm font-semibold">
          Lihat Detail
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      <div className="shrink-0">
        <StatusBadge tool={tool} />
      </div>
    </Link>
  );
}

function StandardCell({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const isLive = tool.status === 'live';
  return (
    <Link
      to={tool.href}
      className={`bento-cell group bg-carbon-900/50 border border-white/10 rounded-2xl p-6 flex flex-col transition-all ${
        isLive
          ? 'hover:border-volt/40 hover:shadow-[0_0_48px_-12px] hover:shadow-volt/25 hover:-translate-y-0.5'
          : 'opacity-75'
      } ${SPAN[tool.id]}`}
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: tool.accent }}
        >
          <Icon className="w-5 h-5 text-carbon-950" />
        </div>
        <StatusBadge tool={tool} />
      </div>

      <h3 className="text-lg font-sans font-bold text-white mb-2 transition-colors group-hover:text-volt">
        {tool.title}
      </h3>
      <p className="text-white/55 text-sm mb-4 line-clamp-2">{tool.description}</p>

      <div className="mb-4">
        <FeatureChips features={tool.features} />
      </div>

      <div
        className={`mt-auto pt-3 flex items-center gap-2 text-sm font-semibold ${
          isLive ? 'text-volt' : 'text-white/50'
        }`}
      >
        {isLive ? 'Coba Sekarang' : 'Lihat Detail'}
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function ToolsBento() {
  const ref = useReveal<HTMLDivElement>({ selector: '.bento-cell', stagger: 0.08 });

  return (
    <section id="tools" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Fitur Platform"
          title="Semua yang Kamu Butuhkan"
          titleAccent="dalam Satu Tempat"
          subtitle="Satu platform dengan tools EV lengkap untuk Indonesia — dari kalkulator charging sampai peta SPKLU dan komunitas."
        />

        <div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(170px,auto)]"
        >
          {TOOLS.map((tool) => {
            if (tool.id === 'kalkulator') return <HeroCell key={tool.id} tool={tool} />;
            if (tool.id === 'trip') return <WideCell key={tool.id} tool={tool} />;
            return <StandardCell key={tool.id} tool={tool} />;
          })}
        </div>
      </div>
    </section>
  );
}
