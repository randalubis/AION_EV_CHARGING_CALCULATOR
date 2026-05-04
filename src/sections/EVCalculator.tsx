import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Battery, Route, ChevronDown, Info, AlertTriangle, RotateCcw } from 'lucide-react';
import { BRANDS, CARS } from '../features/calculator/data/carData';
import { CHARGERS, EFF } from '../features/calculator/data/chargers';
import { TARIFFS } from '../features/calculator/data/tariffs';
import {
  batteryColor,
  calcChargeTimeHours,
  calcCost,
  findBestChargerIdx,
  fmtRp,
  fmtTime,
  TAPER_NOTE_PCT,
} from '../features/calculator/utils/charging';
import { ResultsPanel } from '../features/calculator/components/ResultsPanel';
import { TipsAccordion } from '../features/calculator/components/TipsAccordion';
import { DisclaimerCard } from '../features/calculator/components/DisclaimerCard';
import './EVCalculator.css';

gsap.registerPlugin(ScrollTrigger);

const STORAGE_KEY = 'evhub:calc:v1';

interface PersistedState {
  carId?: string;
  inputMode?: 'pct' | 'range';
  tariff?: number;
  chargerIdx?: number;
}

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : {};
  } catch {
    return {};
  }
}

function savePersisted(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private browsing, full quota — silently ignore */
  }
}

function readNumberParam(params: URLSearchParams, key: string): number | null {
  const v = params.get(key);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function EVCalculator() {
  const sectionRef = useRef<HTMLElement>(null);
  const calcRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Resolve initial state from (priority order): URL params → localStorage → defaults
  const initialState = useMemo(() => {
    const persisted = loadPersisted();
    const urlCarId = searchParams.get('car');
    const urlMode = searchParams.get('mode') as 'pct' | 'range' | null;

    const carId = (urlCarId && CARS.some((c) => c.id === urlCarId) ? urlCarId : null)
      ?? (persisted.carId && CARS.some((c) => c.id === persisted.carId) ? persisted.carId : null)
      ?? 'bmw_ix1';
    const carMaybe = CARS.find((c) => c.id === carId);
    const brandId = carMaybe?.brand ?? 'bmw';

    const inputMode: 'pct' | 'range' = (urlMode === 'pct' || urlMode === 'range')
      ? urlMode
      : (persisted.inputMode === 'pct' || persisted.inputMode === 'range') ? persisted.inputMode : 'pct';

    const tariff = readNumberParam(searchParams, 'tariff') ?? persisted.tariff ?? 1444;
    const chargerIdx = (() => {
      const fromUrl = readNumberParam(searchParams, 'charger');
      if (fromUrl !== null && fromUrl >= 0 && fromUrl < CHARGERS.length) return fromUrl;
      const fromStore = persisted.chargerIdx;
      if (typeof fromStore === 'number' && fromStore >= 0 && fromStore < CHARGERS.length) return fromStore;
      return 0;
    })();

    const cur = readNumberParam(searchParams, 'cur') ?? 0;
    const tgtFromUrl = readNumberParam(searchParams, 'tgt');
    const tgt = tgtFromUrl !== null
      ? tgtFromUrl
      : (inputMode === 'range' ? Math.round((carMaybe?.maxRange ?? 0) * 0.8) : 80);

    return { brandId, carId, inputMode, tariff, chargerIdx, cur, tgt };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State
  const [brandId, setBrandId] = useState(initialState.brandId);
  const [carId, setCarId] = useState(initialState.carId);
  const [inputMode, setInputMode] = useState<'pct' | 'range'>(initialState.inputMode);
  const [curVal, setCurVal] = useState(initialState.cur);
  const [tgtVal, setTgtVal] = useState(initialState.tgt);
  const [chargerIdx, setChargerIdx] = useState(initialState.chargerIdx);
  const [tariff, setTariff] = useState(initialState.tariff);

  // Derived values
  const brand = BRANDS.find(b => b.id === brandId);
  const car = CARS.find(c => c.id === carId);
  const kpk = car ? car.battery / car.maxRange : 0;
  
  const curKwh = useMemo(() => {
    if (!car) return 0;
    return inputMode === "range" 
      ? Math.min(curVal, car.maxRange) * kpk 
      : (Math.min(curVal, 100) / 100) * car.battery;
  }, [car, curVal, inputMode, kpk]);
  
  const tgtKwh = useMemo(() => {
    if (!car) return 0;
    return inputMode === "range" 
      ? Math.min(tgtVal, car.maxRange) * kpk 
      : (Math.min(tgtVal, 100) / 100) * car.battery;
  }, [car, tgtVal, inputMode, kpk]);
  
  const curPct = useMemo(() => {
    if (!car) return 0;
    return inputMode === "range" ? (curVal / car.maxRange) * 100 : curVal;
  }, [car, curVal, inputMode]);
  
  const tgtPct = useMemo(() => {
    if (!car) return 0;
    return inputMode === "range" ? (tgtVal / car.maxRange) * 100 : tgtVal;
  }, [car, tgtVal, inputMode]);
  
  const curRange = curKwh / kpk;
  const tgtRange = (tgtPct / 100) * (car?.maxRange || 0);
  
  const needBat = Math.max(0, tgtKwh - curKwh);
  const charger = CHARGERS[chargerIdx];
  const isAC = charger.type === 'ac';
  const eff = EFF[charger.type];
  const effPct = Math.round(eff * 100);
  const effPwr = isAC
    ? Math.min(charger.kw, car?.maxAcKw || 0)
    : Math.min(charger.kw, car?.maxDcKw || 0);

  // Cost depends on the tariff's billing mode. Home (R1/R2/R3) bills the grid
  // meter so the user pays for AC OBC losses; public (Umum + custom) bills the
  // connector so users pay for what's delivered to the battery. Custom tariffs
  // default to public — most non-PLN-home users are at SPKLU.
  const billingMode = TARIFFS.find((t) => t.val === tariff)?.billingMode ?? 'public';
  const { paidKwh, rupiah: cost } = calcCost(needBat, tariff, billingMode, isAC, eff);

  const timeH = car ? calcChargeTimeHours(curPct, tgtPct, car.battery, eff, effPwr, !isAC) : 0;
  const rangeAdded = Math.max(0, tgtRange - curRange);
  const hasTaperImpact = !isAC && tgtPct > TAPER_NOTE_PCT;

  const unit = inputMode === "range" ? "km" : "%";
  const curMax = inputMode === "range" ? (car?.maxRange || 0) : 100;
  const tgtMax = inputMode === "range" ? (car?.maxRange || 0) : 100;
  const tgtMin = inputMode === "range" ? Math.round((car?.maxRange || 0) * 0.1) : 10;

  // Persist user preferences (not session values like cur/tgt)
  useEffect(() => {
    savePersisted({ carId, inputMode, tariff, chargerIdx });
  }, [carId, inputMode, tariff, chargerIdx]);

  // Reflect full state in URL params so links are shareable + back/forward stays sane.
  useEffect(() => {
    const next = new URLSearchParams();
    next.set('car', carId);
    next.set('mode', inputMode);
    if (curVal > 0) next.set('cur', String(curVal));
    next.set('tgt', String(tgtVal));
    next.set('charger', String(chargerIdx));
    next.set('tariff', String(tariff));
    setSearchParams(next, { replace: true });
  }, [carId, inputMode, curVal, tgtVal, chargerIdx, tariff, setSearchParams]);

  // Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: calcRef.current,
        start: 'top 78%',
        onEnter: () => {
          gsap.fromTo(
            calcRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          );
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handlers
  const handleBrandChange = (newBrandId: string) => {
    setBrandId(newBrandId);
    const brandCars = CARS.filter(c => c.brand === newBrandId);
    if (brandCars.length > 0) {
      const newCar = brandCars[0];
      setCarId(newCar.id);
      setCurVal(0);
      setTgtVal(inputMode === "range" ? Math.round(newCar.maxRange * 0.8) : 80);
      if (newCar.maxDcKw === 0 && CHARGERS[chargerIdx].type === "dc") {
        setChargerIdx(0);
      }
    }
  };

  const handleCarChange = (newCarId: string) => {
    const newCar = CARS.find(c => c.id === newCarId);
    if (newCar) {
      setCarId(newCarId);
      setCurVal(0);
      setTgtVal(inputMode === "range" ? Math.round(newCar.maxRange * 0.8) : 80);
      if (newCar.maxDcKw === 0 && CHARGERS[chargerIdx].type === "dc") {
        setChargerIdx(0);
      }
    }
  };

  const handleModeChange = (mode: "pct" | "range") => {
    setInputMode(mode);
    setCurVal(0);
    if (car) {
      setTgtVal(mode === "range" ? Math.round(car.maxRange * 0.8) : 80);
    }
  };

  const handleReset = () => {
    setCurVal(0);
    if (car) {
      setTgtVal(inputMode === "range" ? Math.round(car.maxRange * 0.8) : 80);
    }
  };

  const handleShare = async () => {
    if (!car || !brand) return;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://evhub.id/kalkulator';
    const shareText = `⚡ Estimasi Pengisian EV — evhub.id
🚗 ${brand.name} ${car.series} ${car.variant}
🔋 ${curPct.toFixed(0)}% → ${tgtPct.toFixed(0)}% (${needBat.toFixed(1)} kWh)
⏱ ${fmtTime(timeH)} · ${charger.label}
📏 +${rangeAdded.toFixed(0)} km
💰 ~${fmtRp(cost)}

Buka: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Estimasi Pengisian EV', text: shareText, url: shareUrl });
        return;
      } catch {
        /* fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Hasil & link disalin ke clipboard!');
    } catch {
      /* clipboard blocked — last-resort, do nothing rather than break */
    }
  };

  const brandCars = useMemo(() => CARS.filter((c) => c.brand === brandId), [brandId]);
  const isOverTarget = curVal > 0 && tgtPct <= curPct + 0.5;
  const isCurEmpty = curVal === 0;

  // "Best charger" = smallest one whose kW saturates the car's accept rate.
  // Bigger chargers don't help; smaller ones leave performance on the table.
  const bestACIdx = useMemo(
    () => (car ? findBestChargerIdx(car.maxAcKw, 'ac') : -1),
    [car],
  );
  const bestDCIdx = useMemo(
    () => (car && car.maxDcKw > 0 ? findBestChargerIdx(car.maxDcKw, 'dc') : -1),
    [car],
  );

  return (
    <section ref={sectionRef} id="kalkulator" className="relative w-full pb-24 md:pb-32 bg-forest-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Calculator */}
        <div ref={calcRef} className="opacity-0">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              {/* Brand Selector */}
              <div className="bg-forest-mid/50 rounded-xl p-6 border border-white/10">
                <label className="text-white/50 text-xs font-body uppercase tracking-widest mb-3 block">
                  Pilih Merek
                </label>
                <div className="relative">
                  <select
                    value={brandId}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="w-full bg-forest-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body appearance-none cursor-pointer focus:border-[#FFC300] focus:outline-none focus:ring-2 focus:ring-[#FFC300]/20 transition-all"
                  >
                    {BRANDS.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                </div>
              </div>

        {/* Car Selector */}
        <div className="bg-forest-mid/50 rounded-xl p-6 border border-white/10">
          <label className="text-white/50 text-xs font-body uppercase tracking-widest mb-3 block">
            Pilih Model ({brandCars.length} varian)
          </label>
          <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {/* Group cars by series */}
            {(() => {
              const groupedBySeriesMap = new Map<string, typeof CARS>();
              brandCars.forEach(car => {
                if (!groupedBySeriesMap.has(car.series)) {
                  groupedBySeriesMap.set(car.series, []);
                }
                groupedBySeriesMap.get(car.series)?.push(car);
              });
              
              const seriesArray = Array.from(groupedBySeriesMap.entries());
              
              return seriesArray.map(([series, seriesCars]) => (
                <div key={series} className="space-y-2">
                  {/* Series Header */}
                  <div className="px-3 py-2 rounded-lg bg-forest-dark/50 border border-white/10">
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                      {series}
                    </div>
                  </div>
                  
                  {/* Series Variants */}
                  <div className="space-y-1.5 ml-2">
                    {seriesCars.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleCarChange(c.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                          carId === c.id
                            ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                            : 'bg-forest-dark border-white/10 text-white hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${carId === c.id ? 'bg-forest-dark' : 'bg-white/30'}`} />
                          <div className="min-w-0">
                            <div className="font-body font-semibold text-sm">{c.variant}</div>
                            <div className={`text-xs truncate ${carId === c.id ? 'text-forest-dark/70' : 'text-white/50'}`}>
                              {c.battery} kWh · {c.maxRange} km
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded flex-shrink-0 whitespace-nowrap ml-2 ${
                          carId === c.id 
                            ? 'bg-forest-dark/20' 
                            : 'bg-[#FFC300]/20 text-[#FFC300]'
                        }`}>
                          {c.maxDcKw > 0 ? `DC ${c.maxDcKw}kW` : 'AC only'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

              {/* Car Hero Card */}
              {car && brand && (
                <div className="bg-gradient-to-br from-forest-mid to-forest-dark rounded-xl p-6 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFC300]/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[#FFC300] text-xs font-body uppercase tracking-widest">{brand.name}</div>
                        <div className="text-white text-xl font-sans font-bold">{car.series}</div>
                        <div className="text-white/50 text-sm">{car.variant}</div>
                      </div>
                      <div className="bg-[#FFC300]/10 border border-[#FFC300]/30 rounded-full px-3 py-1">
                        <span className="text-[#FFC300] text-sm font-semibold">{car.battery} kWh</span>
                      </div>
                    </div>
                    
                    {/* Battery Bar */}
                    <div className="mb-4">
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: 10 }).map((_, i) => {
                          const filled = curVal > 0 ? Math.round((curPct / 100) * 10) : 0;
                          const isFilled = i < filled;
                          return (
                            <div
                              key={i}
                              className="flex-1 h-6 rounded"
                              style={{
                                background: isFilled ? batteryColor(curPct) : 'rgba(255,255,255,0.07)',
                                boxShadow: isFilled ? `0 0 8px ${batteryColor(curPct)}55` : 'none'
                              }}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: curVal > 0 ? batteryColor(curPct) : 'rgba(255,255,255,0.5)' }}>
                          {curVal > 0 ? `${curRange.toFixed(0)} km` : 'Belum diatur'}
                        </span>
                        <span className="text-[#FFC300]">▶ {tgtPct.toFixed(0)}% · {tgtRange.toFixed(0)} km</span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-white/10 rounded-full px-3 py-1 text-xs text-white/70">
                        Jarak maks <span className="text-[#FFC300]">{car.maxRange} km</span>
                      </span>
                      <span className="bg-white/10 rounded-full px-3 py-1 text-xs text-white/70">
                        DC <span className="text-[#FFC300]">{car.maxDcKw > 0 ? `${car.maxDcKw} kW` : 'AC only'}</span>
                      </span>
                      <span className="bg-white/10 rounded-full px-3 py-1 text-xs text-white/70">
                        AC <span className="text-[#FFC300]">{car.maxAcKw} kW</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode Toggle */}
              <div className="bg-forest-mid/50 rounded-xl p-6 border border-white/10">
                <label className="text-white/50 text-xs font-body uppercase tracking-widest mb-3 block">
                  Mode Input
                </label>
                <div className="flex bg-forest-dark rounded-lg p-1">
                  <button
                    onClick={() => handleModeChange('range')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-body font-semibold transition-all flex items-center justify-center gap-2 ${
                      inputMode === 'range'
                        ? 'bg-[#FFC300] text-forest-dark'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Route className="w-4 h-4" />
                    Sisa Jarak (km)
                  </button>
                  <button
                    onClick={() => handleModeChange('pct')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-body font-semibold transition-all flex items-center justify-center gap-2 ${
                      inputMode === 'pct'
                        ? 'bg-[#FFC300] text-forest-dark'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Battery className="w-4 h-4" />
                    Baterai (%)
                  </button>
                </div>
                <p className="text-white/40 text-xs mt-3 text-center">
                  Pilih % jika tahu level baterai · Pilih km jika tahu sisa jarak tempuh
                </p>
              </div>
            </div>

            {/* Right Column - Sliders & Results */}
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-forest-mid/50 rounded-xl p-6 border border-white/10">
                <label className="text-white/50 text-xs font-body uppercase tracking-widest mb-4 block">
                  Status Sekarang
                </label>
                
                <div className="text-center mb-6">
                  <span className={`text-6xl font-sans font-bold ${curVal === 0 ? 'text-white/30' : 'text-[#FFD60A]'}`}>
                    {curVal === 0 ? '—' : curVal}
                  </span>
                  <span className="text-xl text-white/50 ml-2">{unit}</span>
                </div>

                {/* Slider */}
                <div className="mb-4">
                  <input
                    type="range"
                    min={0}
                    max={curMax}
                    value={curVal}
                    onChange={(e) => setCurVal(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FFC300]"
                    style={{
                      background: `linear-gradient(to right, #FFC300 0%, #FFC300 ${(curVal / curMax) * 100}%, rgba(255,255,255,0.1) ${(curVal / curMax) * 100}%, rgba(255,255,255,0.1) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-2">
                    <span>0 {unit}</span>
                    <span>{curMax} {unit}</span>
                  </div>
                </div>

                {/* Manual Input — clamped to 0..max so user can't type 200% or -10 */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white/50 text-sm whitespace-nowrap">Atur manual:</span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={0}
                      max={curMax}
                      value={curVal || ''}
                      onChange={(e) => {
                        const n = parseInt(e.target.value);
                        if (!Number.isFinite(n)) {
                          setCurVal(0);
                          return;
                        }
                        setCurVal(Math.max(0, Math.min(curMax, n)));
                      }}
                      placeholder="0"
                      aria-label={`Level baterai saat ini dalam ${unit}`}
                      className="w-full bg-forest-dark border border-white/20 rounded-lg px-4 py-2 text-white font-body focus:border-[#FFC300] focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">{unit}</span>
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <span className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Pilihan cepat</span>
                  <div className="grid grid-cols-4 gap-2">
                    {inputMode === 'range' && car ? (
                      <>
                        {[0.1, 0.2, 0.3, 0.5].map(p => (
                          <button
                            key={p}
                            onClick={() => setCurVal(Math.round(car.maxRange * p))}
                            className={`py-2 px-1 rounded-lg border text-xs font-semibold transition-all ${
                              curVal === Math.round(car.maxRange * p)
                                ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                                : 'bg-forest-dark border-white/10 text-white/70 hover:border-white/30'
                            }`}
                          >
                            {Math.round(car.maxRange * p)}km
                            <div className="text-[9px] opacity-70">{Math.round(p * 100)}%</div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        {[10, 20, 30, 40, 50, 60, 70, 80].map(v => (
                          <button
                            key={v}
                            onClick={() => setCurVal(v)}
                            className={`py-2 px-1 rounded-lg border text-xs font-semibold transition-all ${
                              curVal === v
                                ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                                : 'bg-forest-dark border-white/10 text-white/70 hover:border-white/30'
                            }`}
                          >
                            {v}%
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Conversion hint */}
                {curVal > 0 && (
                  <div className="mt-4 bg-forest-dark rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                      <Info className="w-3 h-3" />
                      Konversi
                    </div>
                    <div className="text-white/70 text-sm">
                      {inputMode === 'range' 
                        ? <><strong>{curKwh.toFixed(1)} kWh</strong> tersisa · baterai di <strong>{curPct.toFixed(0)}%</strong></>
                        : <><strong>{curPct.toFixed(0)}%</strong> · ~<strong>{curRange.toFixed(0)} km</strong> · <strong>{curKwh.toFixed(1)} kWh</strong></>
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Target */}
              <div className="bg-forest-mid/50 rounded-xl p-6 border border-white/10">
                <label className="text-white/50 text-xs font-body uppercase tracking-widest mb-4 block">
                  → Target Pengisian
                </label>
                
                <div className="text-center mb-6">
                  <span className="text-5xl font-sans font-bold text-[#FFD60A]">{tgtVal}</span>
                  <span className="text-xl text-white/50 ml-2">{unit}</span>
                </div>

                {/* Slider */}
                <div className="mb-4">
                  <input
                    type="range"
                    min={tgtMin}
                    max={tgtMax}
                    value={tgtVal}
                    onChange={(e) => setTgtVal(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #FFC300 0%, #FFC300 ${((tgtVal - tgtMin) / (tgtMax - tgtMin)) * 100}%, rgba(255,255,255,0.1) ${((tgtVal - tgtMin) / (tgtMax - tgtMin)) * 100}%, rgba(255,255,255,0.1) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-2">
                    <span>{tgtMin} {unit}</span>
                    <span>{tgtMax} {unit}</span>
                  </div>
                </div>

                {/* Presets */}
                <div className="grid grid-cols-2 gap-2">
                  {inputMode === 'range' && car ? (
                    <>
                      <button
                        onClick={() => setTgtVal(Math.round(car.maxRange * 0.8))}
                        className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${
                          tgtVal === Math.round(car.maxRange * 0.8)
                            ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                            : 'bg-forest-dark border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        {Math.round(car.maxRange * 0.8)}km
                        <div className="text-xs opacity-70">80% (Daily)</div>
                      </button>
                      <button
                        onClick={() => setTgtVal(car.maxRange)}
                        className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${
                          tgtVal === car.maxRange
                            ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                            : 'bg-forest-dark border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        {car.maxRange}km
                        <div className="text-xs opacity-70">100% (Trip)</div>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setTgtVal(80)}
                        className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${
                          tgtVal === 80
                            ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                            : 'bg-forest-dark border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        80%
                        <div className="text-xs opacity-70">Daily Use</div>
                      </button>
                      <button
                        onClick={() => setTgtVal(100)}
                        className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${
                          tgtVal === 100
                            ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                            : 'bg-forest-dark border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        100%
                        <div className="text-xs opacity-70">Long Trip</div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Cost & Charger */}
              <div className="bg-forest-mid/50 rounded-xl p-6 border border-white/10">
                <label className="text-white/50 text-xs font-body uppercase tracking-widest mb-4 block">
                  Biaya Listrik & Charger
                </label>
                
                {/* Tariff — presets primary, manual entry secondary */}
                <div className="mb-4">
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Tarif Listrik</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {TARIFFS.map(t => (
                      <button
                        key={t.label}
                        onClick={() => setTariff(t.val)}
                        title={t.desc}
                        className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-all ${
                          tariff === t.val
                            ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                            : 'bg-forest-dark border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        <div>{t.label}</div>
                        <div className={`text-[10px] mt-0.5 ${tariff === t.val ? 'text-forest-dark/70' : 'text-white/50'}`}>
                          Rp{t.val.toLocaleString('id-ID')}
                        </div>
                      </button>
                    ))}
                  </div>
                  <details className="group">
                    <summary className="text-white/50 text-xs cursor-pointer hover:text-white/80 list-none flex items-center gap-1.5">
                      <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                      Atur tarif sendiri
                    </summary>
                    <div className="relative mt-2">
                      <input
                        type="number"
                        value={tariff}
                        onChange={(e) => setTariff(parseInt(e.target.value) || 0)}
                        aria-label="Tarif kustom per kWh"
                        className="w-full bg-forest-dark border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:border-[#FFC300] focus:outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-xs">Rp/kWh</span>
                    </div>
                  </details>
                  <p className="text-white/40 text-xs mt-3">
                    PLN R1–R3 adalah tarif rumah tangga. &quot;Umum&quot; adalah perkiraan tarif SPKLU publik.
                  </p>
                </div>

                {/* Charger Selection */}
                <div className="space-y-2">
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Jenis Charger</div>
                  
                  {/* AC Chargers */}
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> AC Charging
                  </div>
                  {CHARGERS.filter(c => c.type === 'ac').map((c) => {
                    const actualIdx = CHARGERS.findIndex(ch => ch === c);
                    const effPwr = Math.min(c.kw, car?.maxAcKw || 0);
                    const isBest = actualIdx === bestACIdx;
                    return (
                      <button
                        key={c.label}
                        onClick={() => setChargerIdx(actualIdx)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          chargerIdx === actualIdx
                            ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                            : 'bg-forest-dark border-white/10 text-white hover:border-white/30'
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold text-sm">{c.label}</div>
                          {isBest && (
                            <div className={`text-xs ${chargerIdx === actualIdx ? 'text-forest-dark/70' : 'text-[#FFD60A]'}`}>
                              ✦ Terbaik untuk mobil ini
                            </div>
                          )}
                        </div>
                        <span className={`font-bold ${chargerIdx === actualIdx ? 'text-forest-dark' : 'text-[#FFC300]'}`}>
                          {effPwr} kW
                        </span>
                      </button>
                    );
                  })}

                  {/* DC Chargers */}
                  {car && car.maxDcKw > 0 && (
                    <>
                      <div className="text-white/40 text-xs uppercase tracking-wider mb-1 mt-4 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> DC Fast Charging
                      </div>
                      {CHARGERS.filter(c => c.type === 'dc').map((c) => {
                        const actualIdx = CHARGERS.findIndex(ch => ch === c);
                        const effPwr = Math.min(c.kw, car.maxDcKw);
                        const isBest = actualIdx === bestDCIdx;
                        const isCapped = c.kw > car.maxDcKw;
                        return (
                          <button
                            key={c.label}
                            onClick={() => setChargerIdx(actualIdx)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                              chargerIdx === actualIdx
                                ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                                : 'bg-forest-dark border-white/10 text-white hover:border-white/30'
                            }`}
                          >
                            <div className="text-left">
                              <div className="font-semibold text-sm">{c.label}</div>
                              {isBest && (
                                <div className={`text-xs ${chargerIdx === actualIdx ? 'text-forest-dark/70' : 'text-[#FFD60A]'}`}>
                                  ✦ Terbaik untuk mobil ini
                                </div>
                              )}
                              {isCapped && (
                                <div className={`text-xs ${chargerIdx === actualIdx ? 'text-forest-dark/70' : 'text-white/50'}`}>
                                  ⚠ Mobil maks {car.maxDcKw} kW DC
                                </div>
                              )}
                            </div>
                            <span className={`font-bold ${chargerIdx === actualIdx ? 'text-forest-dark' : 'text-[#FFC300]'}`}>
                              {effPwr} kW
                            </span>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {car && car.maxDcKw === 0 && (
                    <div className="bg-[#FFC300]/10 border border-[#FFC300]/30 rounded-lg p-3 mt-4">
                      <div className="flex items-center gap-2 text-[#FFC300] text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        Model ini hanya mendukung pengisian AC — tidak tersedia DC fast charging.
                      </div>
                    </div>
                  )}
                </div>

                {/* Efficiency Note */}
                <div className="mt-4 bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-white/70 text-sm">
                    <strong className="text-[#FFC300]">
                      {isAC
                        ? `AC ~${effPct}% (rugi onboard charger ~${100 - effPct}%)`
                        : `DC ~${effPct}% (rugi kabel & baterai ~${100 - effPct}%)`}
                    </strong>
                  </div>
                  <div className="text-white/40 text-xs mt-1">
                    {isAC
                      ? 'AC: meter PLN mengukur sisi grid — Anda bayar untuk rugi onboard charger.'
                      : 'DC: SPKLU bayar rugi konversi grid; Anda bayar per kWh ke baterai.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Already at target */}
          {!isCurEmpty && isOverTarget && (
            <div className="mt-8 bg-[#27AE60]/10 rounded-2xl p-8 border border-[#27AE60]/30 text-center">
              <div className="text-5xl mb-4">✅</div>
              <div className="text-2xl font-sans font-bold text-[#27AE60] mb-2">Sudah mencapai target!</div>
              <div className="text-white/60">
                Baterai ({curPct.toFixed(0)}{unit}) sudah di atau di atas target ({tgtPct.toFixed(0)}{unit}).
              </div>
              <button
                onClick={handleReset}
                className="mt-6 px-5 py-2 border border-white/20 hover:border-[#27AE60] text-white/70 hover:text-[#27AE60] text-sm rounded-lg transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Atur ulang
              </button>
            </div>
          )}

          {/* Results — live updates as inputs change */}
          {!isOverTarget && (
            <ResultsPanel
              result={{
                isCurEmpty,
                cost,
                timeH,
                needBat,
                rangeAdded,
                tgtRange,
                paidKwh,
                billingMode,
                chargerLabel: charger.label,
                effPwr,
                effPct,
                isAC,
                hasTaperImpact,
                tariff,
              }}
              onReset={handleReset}
              onShare={handleShare}
            />
          )}

          <TipsAccordion />
          <DisclaimerCard />
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    </section>
  );
}

