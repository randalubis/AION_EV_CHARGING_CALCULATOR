import { Battery, Clock, Info, MapPin, Route, RotateCcw, Share2, Wallet, Zap } from 'lucide-react';
import { MapsPicker, searchTargets } from '../../map/components/MapsPicker';
import { fmtRp, fmtTime, TAPER_START_PCT } from '../utils/charging';

export interface CalcResult {
  isCurEmpty: boolean;
  cost: number;
  timeH: number;
  needBat: number;
  rangeAdded: number;
  tgtRange: number;
  gridKwh: number;
  chargerLabel: string;
  effPwr: number;
  effPct: number;
  isAC: boolean;
  hasTaperImpact: boolean;
  tariff: number;
}

interface ResultsPanelProps {
  result: CalcResult;
  onReset: () => void;
  onShare: () => void;
}

export function ResultsPanel({ result, onReset, onShare }: ResultsPanelProps) {
  const r = result;

  return (
    <div className="mt-8 bg-gradient-to-br from-forest-mid to-forest-dark rounded-2xl p-6 md:p-8 border border-white/10">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-[#FFC300] text-sm uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          {r.isCurEmpty ? 'Estimasi' : 'Estimasi Pengisian'}
        </div>
        {!r.isCurEmpty && (
          <button
            onClick={onReset}
            className="text-white/40 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Atur ulang
          </button>
        )}
      </div>

      {/* Hero: Cost */}
      <div className="bg-[#FFC300]/10 rounded-xl p-6 border border-[#FFC300]/30 mb-6">
        <div className="flex items-center gap-2 text-[#FFC300] text-xs uppercase tracking-wider mb-2">
          <Wallet className="w-4 h-4" />
          Estimasi Biaya
        </div>
        <div className="text-4xl md:text-5xl font-sans font-bold text-[#FFD60A]">
          {r.isCurEmpty || r.tariff <= 0 ? '—' : fmtRp(r.cost)}
        </div>
        {!r.isCurEmpty && r.tariff > 0 && (
          <div className="text-white/50 text-xs mt-1">
            {fmtRp(r.tariff)}/kWh × {r.gridKwh.toFixed(1)} kWh
          </div>
        )}
      </div>

      {/* Time + Energy + Range */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <ResultStat icon={Clock} label="Waktu" value={r.isCurEmpty ? '—' : fmtTime(r.timeH)} />
        <ResultStat
          icon={Battery}
          label="Energi"
          value={r.isCurEmpty ? '—' : `${r.needBat.toFixed(1)}`}
          unit="kWh"
        />
        <ResultStat
          icon={Route}
          label="Jarak +"
          value={r.isCurEmpty ? '—' : `+${r.rangeAdded.toFixed(0)}`}
          unit="km"
          accent
        />
        <ResultStat
          icon={MapPin}
          label="Jarak akhir"
          value={r.isCurEmpty ? '—' : `${r.tgtRange.toFixed(0)}`}
          unit="km"
        />
      </div>

      {/* Charger summary */}
      <div className="bg-forest-dark/40 rounded-xl p-4 border border-white/10 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-[#FFC300]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-[#FFC300]" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">{r.chargerLabel}</div>
            <div className="text-white/40 text-xs">
              Efektif {r.effPwr} kW · ~{r.effPct}% efisiensi
            </div>
          </div>
        </div>
        <span className="bg-[#FFC300]/20 text-[#FFC300] text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
          {r.isAC ? 'AC' : 'DC Fast'}
        </span>
      </div>

      {r.hasTaperImpact && !r.isCurEmpty && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200/90 text-xs leading-relaxed">
            Estimasi memperhitungkan taper di atas {TAPER_START_PCT}% — DC fast charging melambat
            untuk melindungi baterai. Untuk perjalanan jauh, lebih hemat waktu cas sampai 80% lalu
            lanjut perjalanan.
          </p>
        </div>
      )}

      {r.isCurEmpty && (
        <div className="bg-white/5 rounded-lg p-3 mb-4 flex items-center gap-2 text-white/50 text-sm">
          <Info className="w-4 h-4 flex-shrink-0" />
          Atur level baterai saat ini untuk melihat estimasi.
        </div>
      )}

      <div className="flex gap-3">
        <MapsPicker
          align="start"
          targets={searchTargets('SPKLU stasiun pengisian daya EV terdekat')}
          trigger={
            <button
              type="button"
              className="flex-1 bg-forest-dark hover:bg-forest-mid border border-white/20 hover:border-[#FFC300] text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Cari SPKLU Terdekat
            </button>
          }
        />
        <button
          onClick={onShare}
          disabled={r.isCurEmpty}
          className="px-6 py-3 border border-white/20 hover:border-[#FFC300] text-white/70 hover:text-[#FFC300] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all flex items-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Bagikan
        </button>
      </div>
    </div>
  );
}

function ResultStat({
  icon: Icon,
  label,
  value,
  unit,
  accent,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-forest-dark/50 rounded-xl p-3 md:p-4 border border-white/10">
      <div className="flex items-center gap-1.5 text-white/50 text-[10px] md:text-xs uppercase tracking-wider mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className={`text-xl md:text-2xl font-sans font-bold ${accent ? 'text-[#27AE60]' : 'text-white'}`}>
        {value}
        {unit && <span className="text-xs md:text-sm text-white/50 ml-1">{unit}</span>}
      </div>
    </div>
  );
}
