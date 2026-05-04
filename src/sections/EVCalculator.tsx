import { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Battery, MapPin, Clock, Wallet, Route, Share2, RotateCcw, ChevronDown, Info, AlertTriangle } from 'lucide-react';
import { BRANDS, CARS } from '../features/calculator/data/carData';
import { CHARGERS, EFF } from '../features/calculator/data/chargers';
import { TARIFFS } from '../features/calculator/data/tariffs';
import { TIPS } from '../features/calculator/data/tips';

gsap.registerPlugin(ScrollTrigger);

// ─── HELPERS ──────────────────────────────────────────────────────
const fmtTime = (h: number) => {
  if (h < 0.017) return "<1 menit";
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  if (hh === 0) return `${mm}m`;
  if (mm === 0) return `${hh}j`;
  return `${hh}j ${mm}m`;
};

const fmtRp = (n: number) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;

const barClr = (p: number) => {
  if (p <= 15) return "#C0392B";
  if (p <= 30) return "#E67E22";
  if (p <= 50) return "#F1C40F";
  return "#27AE60";
};

export function EVCalculator() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<HTMLDivElement>(null);

  // State
  const [brandId, setBrandId] = useState("bmw");
  const [carId, setCarId] = useState("bmw_ix1");
  const [inputMode, setInputMode] = useState<"pct" | "range">("pct");
  const [curVal, setCurVal] = useState(0);
  const [tgtVal, setTgtVal] = useState(80);
  const [chargerIdx, setChargerIdx] = useState(0);
  const [tariff, setTariff] = useState(1444);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);

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
  const isAC = charger.type === "ac";
  const eff = EFF[charger.type];
  const effPct = Math.round(eff * 100);
  const lossPct = 100 - effPct;
  const effPwr = isAC 
    ? Math.min(charger.kw, car?.maxAcKw || 0) 
    : Math.min(charger.kw, car?.maxDcKw || 0);
  
  const gridKwh = needBat / eff;
  const timeH = effPwr > 0 ? gridKwh / effPwr : 0;
  const cost = gridKwh * tariff;
  const rangeAdded = Math.max(0, tgtRange - curRange);

  const unit = inputMode === "range" ? "km" : "%";
  const curMax = inputMode === "range" ? (car?.maxRange || 0) : 100;
  const tgtMax = inputMode === "range" ? (car?.maxRange || 0) : 100;
  const tgtMin = inputMode === "range" ? Math.round((car?.maxRange || 0) * 0.1) : 10;

  // Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(headingRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
          );
        },
        once: true,
      });

      ScrollTrigger.create({
        trigger: calcRef.current,
        start: 'top 78%',
        onEnter: () => {
          gsap.fromTo(calcRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
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
      setShowResult(false);
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
      setShowResult(false);
      setTgtVal(inputMode === "range" ? Math.round(newCar.maxRange * 0.8) : 80);
      if (newCar.maxDcKw === 0 && CHARGERS[chargerIdx].type === "dc") {
        setChargerIdx(0);
      }
    }
  };

  const handleModeChange = (mode: "pct" | "range") => {
    setInputMode(mode);
    setCurVal(0);
    setShowResult(false);
    if (car) {
      setTgtVal(mode === "range" ? Math.round(car.maxRange * 0.8) : 80);
    }
  };

  const handleCalculate = () => {
    if (curVal > 0) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurVal(0);
    setShowResult(false);
    if (car) {
      setTgtVal(inputMode === "range" ? Math.round(car.maxRange * 0.8) : 80);
    }
  };

  const handleShare = async () => {
    if (!car || !brand) return;
    const shareText = `⚡ EV Charging Estimate — evhub.id
🚗 ${brand.name} ${car.series} ${car.variant}
🔋 ${curPct.toFixed(0)}% → ${tgtPct.toFixed(0)}% (${needBat.toFixed(1)} kWh needed)
⏱ ${fmtTime(timeH)} via ${charger.label}
📏 +${rangeAdded.toFixed(0)} km range added
💰 ~${fmtRp(cost)}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'EV Charging Estimate', text: shareText, url: 'https://evhub.id' });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Hasil disalin ke clipboard!');
      } catch {}
    }
  };

  const brandCars = CARS.filter(c => c.brand === brandId);
  const isOverTarget = curVal > 0 && tgtPct <= curPct + 0.5;
  const isCurEmpty = curVal === 0;

  // Find best charger for the car
  const bestACIdx = CHARGERS.reduce((best, ci, i) => {
    if (ci.type !== 'ac') return best;
    const pw = Math.min(ci.kw, car?.maxAcKw || 0);
    if (best === -1) return i;
    const bestPw = Math.min(CHARGERS[best].kw, car?.maxAcKw || 0);
    return pw > bestPw ? i : best;
  }, -1);

  const bestDCIdx = car && car.maxDcKw > 0 
    ? CHARGERS.reduce((best, ci, i) => {
        if (ci.type !== 'dc') return best;
        const pw = Math.min(ci.kw, car.maxDcKw);
        if (best === -1) return i;
        const bestPw = Math.min(CHARGERS[best].kw, car.maxDcKw);
        return pw > bestPw ? i : best;
      }, -1)
    : -1;

  return (
    <section ref={sectionRef} id="kalkulator" className="relative w-full py-24 md:py-32 bg-forest-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={headingRef} className="opacity-0 mb-12">
          <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-4">
            Kalkulator Charging
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white tracking-tight leading-tight">
            Hitung Kebutuhan
            <br />
            <span className="font-serif italic font-normal text-white/80">
              Pengisian Daya
            </span>
          </h2>
          <p className="mt-6 text-white/60 font-body text-base md:text-lg max-w-xl leading-relaxed">
            Pilih mobil EV kamu, atur level baterai saat ini dan target pengisian. 
            Dapatkan estimasi waktu, biaya, dan jarak tempuh dalam hitungan detik.
          </p>
        </div>

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
                                background: isFilled ? barClr(curPct) : 'rgba(255,255,255,0.07)',
                                boxShadow: isFilled ? `0 0 8px ${barClr(curPct)}55` : 'none'
                              }}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: curVal > 0 ? barClr(curPct) : 'rgba(255,255,255,0.5)' }}>
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

                {/* Manual Input */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white/50 text-sm whitespace-nowrap">Atur manual:</span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={curVal || ''}
                      onChange={(e) => setCurVal(parseInt(e.target.value) || 0)}
                      placeholder="0"
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
                
                {/* Tariff */}
                <div className="mb-4">
                  <div className="relative mb-3">
                    <input
                      type="number"
                      value={tariff}
                      onChange={(e) => setTariff(parseInt(e.target.value) || 0)}
                      className="w-full bg-forest-dark border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:border-[#FFC300] focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">Rp/kWh</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TARIFFS.map(t => (
                      <button
                        key={t.label}
                        onClick={() => setTariff(t.val)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          tariff === t.val
                            ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                            : 'bg-forest-dark border-white/10 text-white/70 hover:border-white/30'
                        }`}
                        title={t.desc}
                      >
                        {t.label}: {t.val.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                  <p className="text-white/40 text-xs mt-3">
                    PLN R1–R3 adalah tarif rumah tangga. 'Umum' adalah perkiraan tarif SPKLU publik.
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
                        disabled={!car}
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
                      {isAC ? `AC Charging: ~${effPct}% efisiensi` : `DC Fast Charging: ~${effPct}% efisiensi`}
                    </strong>
                    <span className="text-white/50"> ({lossPct}% rugi dari PLN)</span>
                  </div>
                  <div className="text-white/40 text-xs mt-1">
                    Berdasarkan riset EPA/ADAC 2023–24. Bervariasi tergantung suhu, kabel & baterai.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleCalculate}
              disabled={curVal === 0}
              className="flex-1 bg-[#FFC300] hover:bg-[#FFD60A] disabled:opacity-50 disabled:cursor-not-allowed text-forest-dark font-sans font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Hitung Pengisian Daya
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-4 border border-white/20 hover:border-[#FFC300] text-white/70 hover:text-[#FFC300] rounded-xl transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {/* Validation Messages */}
          {isOverTarget && (
            <div className="mt-4 bg-[#FFC300]/10 border border-[#FFC300]/40 rounded-lg p-4 flex items-center gap-3 text-[#FFC300]">
              <AlertTriangle className="w-5 h-5" />
              Level saat ini lebih tinggi dari target — tidak perlu pengisian.
            </div>
          )}

          {isCurEmpty && !showResult && (
            <div className="mt-4 bg-white/5 border border-white/20 rounded-lg p-4 flex items-center gap-3 text-white/50">
              <Info className="w-5 h-5" />
              Atur level baterai saat ini untuk melihat hasil.
            </div>
          )}

          {/* Results */}
          {showResult && curVal > 0 && !isOverTarget && (
            <div className="mt-8 bg-gradient-to-br from-forest-mid to-forest-dark rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-2 text-[#FFC300] text-sm uppercase tracking-wider mb-6">
                <Zap className="w-4 h-4" />
                Perlu Pengisian Daya
              </div>

              {/* Main kWh */}
              <div className="text-center mb-8">
                <div className="text-7xl font-sans font-bold text-[#FFD60A]">{gridKwh.toFixed(1)}</div>
                <div className="text-white/50 text-lg">kWh dari PLN</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-forest-dark/50 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                    <Clock className="w-4 h-4" />
                    Estimasi Waktu
                  </div>
                  <div className="text-2xl font-sans font-bold text-white">{fmtTime(timeH)}</div>
                </div>
                <div className="bg-forest-dark/50 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                    <Battery className="w-4 h-4" />
                    Ke Baterai
                  </div>
                  <div className="text-2xl font-sans font-bold text-white">{needBat.toFixed(1)} <span className="text-sm text-white/50">kWh</span></div>
                </div>
                <div className="bg-forest-dark/50 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                    <Route className="w-4 h-4" />
                    Jarak Bertambah
                  </div>
                  <div className="text-2xl font-sans font-bold text-[#27AE60]">+{rangeAdded.toFixed(0)} <span className="text-sm text-white/50">km</span></div>
                </div>
                <div className="bg-forest-dark/50 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4" />
                    Jarak Akhir
                  </div>
                  <div className="text-2xl font-sans font-bold text-white">{tgtRange.toFixed(0)} <span className="text-sm text-white/50">km</span></div>
                </div>
              </div>

              {/* Charger Info */}
              <div className="bg-[#FFC300]/10 rounded-xl p-4 border border-[#FFC300]/30 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFC300]/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#FFC300]" />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs uppercase tracking-wider">Jenis Charger</div>
                      <div className="text-white font-semibold">{effPwr} kW</div>
                    </div>
                  </div>
                  <span className="bg-[#FFC300]/20 text-[#FFC300] text-xs font-semibold px-3 py-1 rounded-full">
                    {isAC ? 'AC' : 'DC Fast'}
                  </span>
                </div>
              </div>

              {/* Cost */}
              {tariff > 0 && (
                <div className="bg-[#FFC300]/10 rounded-xl p-6 border border-[#FFC300]/30 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#FFC300] text-sm uppercase tracking-wider">
                      <Wallet className="w-4 h-4" />
                      Estimasi Biaya
                    </div>
                    <div className="text-3xl font-sans font-bold text-[#FFD60A]">{fmtRp(cost)}</div>
                  </div>
                </div>
              )}

              {/* Efficiency Note */}
              <div className="text-white/50 text-sm mb-6">
                Cas {effPwr} kW · ~{effPct}% efisiensi ({lossPct}% rugi PLN)
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <a
                  href="https://maps.google.com/?q=SPKLU+stasiun+pengisian+daya+EV+terdekat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-forest-dark hover:bg-forest-mid border border-white/20 hover:border-[#FFC300] text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Cari SPKLU Terdekat
                </a>
                <button
                  onClick={handleShare}
                  className="px-6 py-3 border border-white/20 hover:border-[#FFC300] text-white/70 hover:text-[#FFC300] rounded-xl transition-all flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Bagikan
                </button>
              </div>
            </div>
          )}

          {/* Already at Target */}
          {showResult && curVal > 0 && isOverTarget && (
            <div className="mt-8 bg-[#27AE60]/10 rounded-2xl p-8 border border-[#27AE60]/30 text-center">
              <div className="text-5xl mb-4">✅</div>
              <div className="text-2xl font-sans font-bold text-[#27AE60] mb-2">Sudah mencapai target!</div>
              <div className="text-white/60">
                Baterai ({curPct.toFixed(0)}{unit}) sudah di atau di atas target ({tgtPct.toFixed(0)}{unit}).
              </div>
            </div>
          )}

          {/* Tips Accordion */}
          <div className="mt-8 bg-forest-mid/50 rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setTipsOpen(!tipsOpen)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-forest-dark rounded-lg flex items-center justify-center">
                  <Battery className="w-5 h-5 text-[#FFC300]" />
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">Panduan Kesehatan Baterai</div>
                  <div className="text-white/50 text-sm">6 tips memperpanjang umur baterai</div>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-[#FFC300] transition-transform ${tipsOpen ? 'rotate-180' : ''}`} />
            </button>
            {tipsOpen && (
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

          {/* Disclaimer */}
          <div className="mt-6 bg-forest-mid/30 rounded-xl p-6 border-l-4 border-[#FFC300]">
            <div className="text-[#FFC300] text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Catatan Penting
            </div>
            <div className="text-white/60 text-sm space-y-2">
              <p>Ini estimasi. Hasil aktual dapat bervariasi karena:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Suhu baterai & kondisi sekitar</li>
                <li>Usia baterai & penurunan kapasitas</li>
                <li>Kualitas dan panjang kabel cas</li>
                <li>Efisiensi charger aktual per merek/model</li>
                <li>Cas di atas 80% kurang efisien (cell balancing)</li>
                <li>Cas AC ~10% rugi · Cas DC ~7% rugi (tipikal)</li>
              </ul>
              <p className="mt-3">Gunakan sebagai panduan. Pantau sesi cas aktual untuk data akurat.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,195,0,0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,195,0,0.5);
        }
      `}</style>
    </section>
  );
}
