import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, RotateCcw, Wallet, HelpCircle, Share2 } from 'lucide-react';
import { useTCOCalculator } from '../features/tco/hooks/useTCOCalculator';
import { VehicleSelector } from '../features/tco/components/VehicleSelector';
import { UsageInput } from '../features/tco/components/UsageInput';
import { CostParameters } from '../features/tco/components/CostParameters';
import { ComparisonChart } from '../features/tco/components/ComparisonChart';
import { CostBreakdown } from '../features/tco/components/CostBreakdown';
import { SavingsSummary } from '../features/tco/components/SavingsSummary';
import { EmptyState } from '../features/tco/components/EmptyState';
import { CalculationMethodology } from '../features/tco/components/CalculationMethodology';
import { HowToUseDialog } from '../features/tco/components/HowToUseDialog';
import { formatRupiah } from '../features/tco/utils/calculations';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function TCOPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    inputs,
    result,
    evVehicle,
    iceVehicle,
    setEVVehicle,
    setICEVehicle,
    setAnnualKm,
    setOwnershipYears,
    setElectricityRateCategory,
    setHomeChargingPercentage,
    setInsuranceType,
    setIncludeTax,
    setRegion,
    resetToDefaults,
  } = useTCOCalculator();

  useEffect(() => {
    document.title = 'TCO Calculator | evhub.id';
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const animateElements = containerRef.current?.querySelectorAll('.animate-in');
      if (animateElements && animateElements.length > 0) {
        gsap.fromTo(
          animateElements,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
        );
      }
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleReset = () => {
    if (!evVehicle && !iceVehicle) {
      resetToDefaults();
      return;
    }
    if (window.confirm('Yakin mau reset semua input ke default?')) {
      resetToDefaults();
    }
  };

  const handleLoadExample = () => {
    setEVVehicle('byd_atto3_std');
    setICEVehicle('toyota_corolla_altis');
  };

  const handleShare = async () => {
    if (!result || !evVehicle || !iceVehicle) return;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://evhub.id/tco-calculator';
    const winner = result.savings.absolute >= 0 ? 'EV' : 'ICE';
    const savingsAbs = Math.abs(result.savings.absolute);
    const breakEven = result.savings.breakEvenYear
      ? `Break-even tahun ${result.savings.breakEvenYear}`
      : 'ICE tetap lebih murah dalam periode ini';
    const text = `📊 Perbandingan TCO ${inputs.ownershipYears} tahun — evhub.id
🚗 EV: ${evVehicle.brand} ${evVehicle.series} — ${formatRupiah(result.ev.totalCost)}
⛽ ICE: ${iceVehicle.brand} ${iceVehicle.model} — ${formatRupiah(result.ice.totalCost)}
${winner === 'EV' ? '⚡' : '⛽'} ${winner} hemat ${formatRupiah(savingsAbs)} (${Math.abs(result.savings.percentage).toFixed(0)}%)
🎯 ${breakEven}

Buka: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Perbandingan TCO', text, url: shareUrl });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      alert('Hasil & link disalin ke clipboard!');
    } catch {
      /* clipboard blocked */
    }
  };

  const bothVehiclesSelected = !!evVehicle && !!iceVehicle;

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-forest-dark">
      {/* Compact header — matches the Calculator/SPKLU pattern */}
      <div className="pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="animate-in flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link to="/" className="hover:text-[#FFC300] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-[#FFC300]">TCO Calculator</span>
          </div>

          <div className="animate-in flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-[#FFC300]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-[#FFC300]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-white font-bold text-xl md:text-2xl leading-tight">
                  TCO Calculator
                </h1>
                <p className="text-white/50 text-xs md:text-sm">
                  Bandingkan biaya kepemilikan EV vs mobil bensin selama beberapa tahun
                </p>
              </div>
            </div>
            <HowToUseDialog
              trigger={
                <button className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-colors flex-shrink-0">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Cara pakai</span>
                </button>
              }
            />
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="space-y-8">
          {/* Step 1 — Vehicle Selection */}
          <section className="animate-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-[#FFC300] rounded-full flex items-center justify-center text-forest-dark font-bold">
                1
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Pilih Kendaraan</h2>
                <p className="text-white/50 text-sm">Pilih mobil EV dan ICE yang ingin dibandingkan</p>
              </div>
            </div>

            {!evVehicle && !iceVehicle && (
              <div className="mb-6">
                <EmptyState onSelectExample={handleLoadExample} />
              </div>
            )}

            <VehicleSelector
              selectedEVId={inputs.evVehicleId}
              selectedICEId={inputs.iceVehicleId}
              onSelectEV={setEVVehicle}
              onSelectICE={setICEVehicle}
            />
          </section>

          {/* Step 2 — Usage */}
          {bothVehiclesSelected && (
            <section className="animate-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-[#FFC300] rounded-full flex items-center justify-center text-forest-dark font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Penggunaan</h2>
                  <p className="text-white/50 text-sm">Atur jarak tempuh dan pola charging</p>
                </div>
              </div>

              <UsageInput
                annualKm={inputs.annualKm}
                ownershipYears={inputs.ownershipYears}
                electricityRateCategory={inputs.electricityRateCategory}
                homeChargingPercentage={inputs.homeChargingPercentage}
                onAnnualKmChange={setAnnualKm}
                onOwnershipYearsChange={setOwnershipYears}
                onElectricityRateChange={setElectricityRateCategory}
                onHomeChargingChange={setHomeChargingPercentage}
              />
            </section>
          )}

          {/* Step 3 — Cost Parameters */}
          {bothVehiclesSelected && (
            <section className="animate-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-[#FFC300] rounded-full flex items-center justify-center text-forest-dark font-bold">
                  3
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Pengaturan Biaya</h2>
                  <p className="text-white/50 text-sm">Pilih jenis asuransi dan wilayah</p>
                </div>
              </div>

              <CostParameters
                insuranceType={inputs.insuranceType}
                includeTax={inputs.includeTax}
                region={inputs.region}
                onInsuranceTypeChange={setInsuranceType}
                onIncludeTaxChange={setIncludeTax}
                onRegionChange={setRegion}
              />
            </section>
          )}

          {/* Toolbar — Reset + Share when applicable */}
          {(evVehicle || iceVehicle) && (
            <div className="animate-in flex flex-wrap justify-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 border border-white/20 rounded-xl text-sm text-white/70 hover:text-[#FFC300] hover:border-[#FFC300] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset ke Default
              </button>
              {result && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/20 rounded-xl text-sm text-white/70 hover:text-[#FFC300] hover:border-[#FFC300] transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Bagikan
                </button>
              )}
            </div>
          )}

          {/* Results — live, no Calculate button */}
          {result && evVehicle && iceVehicle && (
            <div className="animate-in space-y-8 pt-8 border-t border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Hasil Perbandingan
                </h2>
                <p className="text-white/50">
                  {evVehicle.brand} {evVehicle.series} vs {iceVehicle.brand} {iceVehicle.model}
                </p>
              </div>

              <SavingsSummary result={result} />
              <ComparisonChart result={result} />
              <CostBreakdown result={result} />
            </div>
          )}

          {/* Methodology stays as in-page accordion (reference content) */}
          <section className="animate-in">
            <CalculationMethodology />
          </section>
        </div>
      </div>

      {/* Back to Home */}
      <div className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#FFC300] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
