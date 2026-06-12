import { useState } from 'react';
import { Battery, ChevronDown } from 'lucide-react';
import { TIPS } from '../data/tips';

export function TipsAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 bg-forest-mid/50 rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-forest-dark rounded-lg flex items-center justify-center">
            <Battery className="w-5 h-5 text-volt" />
          </div>
          <div className="text-left">
            <div className="text-white font-semibold">Panduan Kesehatan Baterai</div>
            <div className="text-white/50 text-sm">{TIPS.length} tips memperpanjang umur baterai</div>
          </div>
        </div>
        <ChevronDown className={`w-6 h-6 text-volt transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 bg-forest-dark rounded-full flex items-center justify-center flex-shrink-0 text-lg">
                {tip.icon}
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-1">{tip.title}</div>
                <div className="text-white/50 text-sm">{tip.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
