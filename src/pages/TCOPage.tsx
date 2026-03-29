import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Calculator, RotateCcw, ChevronRight } from 'lucide-react';
import { useTCOCalculator } from '../features/tco/hooks/useTCOCalculator';
import { VehicleSelector } from '../features/tco/components/VehicleSelector';
import { UsageInput } from '../features/tco/components/UsageInput';
import { CostParameters } from '../features/tco/components/CostParameters';
import { ComparisonChart } from '../features/tco/components/ComparisonChart';
import { CostBreakdown } from '../features/tco/components/CostBreakdown';
import { SavingsSummary } from '../features/tco/components/SavingsSummary';
import { EmptyState } from '../features/tco/components/EmptyState';
import { CalculationMethodology } from '../features/tco/components/CalculationMethodology';

export default function TCOPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Controls when to show results (explicit user action required)
  const [showResults, setShowResults] = useState(false);
  // Track if user has ever selected vehicles (to hide EmptyState after first interaction)
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  const {
    inputs,
    result,
    evVehicle,
    iceVehicle,
    canCalculate,
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

    const ctx = gsap.context(() => {
      const animateElements = containerRef.current?.querySelectorAll('.animate-in');
      if (animateElements && animateElements.length > 0) {
        gsap.fromTo(
          animateElements,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);
  
  // Scroll to results when explicitly shown
  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults]);
  
  // Handle calculate button click
  const handleCalculate = () => {
    if (canCalculate) {
      setShowResults(true);
    }
  };
  
  // Handle reset
  const handleReset = () => {
    resetToDefaults();
    setShowResults(false);
    setHasUserInteracted(false);
  };
  
  // Handle load example
  const handleLoadExample = () => {
    setEVVehicle('byd_atto3_std');
    setICEVehicle('toyota_corolla_altis');
    setHasUserInteracted(true);
    // Don't auto-show results, let user click Calculate
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-forest-dark">
      {/* Header */}
      <div className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="animate-in flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link to="/" className="hover:text-[#FFC300] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#FFC300]">TCO Calculator</span>
          </div>

          <div className="animate-in text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#FFC300]/10 border border-[#FFC300]/30 rounded-full px-4 py-2 mb-6">
              <Calculator className="w-4 h-4 text-[#FFC300]" />
              <span className="text-[#FFC300] text-sm font-medium">Beta</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white mb-6">
              TCO
              <span className="text-[#FFC300]"> Calculator</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Bandingkan biaya kepemilikan kendaraan listrik (EV) vs mobil bensin (ICE) 
              selama 5 tahun. Hitung penghematan total termasuk bahan bakar, perawatan, 
              asuransi, pajak, dan depresiasi.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="space-y-8">
          {/* Step 1: Vehicle Selection */}
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
            
            {/* Quick start helper - only shows on initial load before any interaction */}
            {!evVehicle && !iceVehicle && !hasUserInteracted && (
              <div className="mb-6">
                <EmptyState onSelectExample={handleLoadExample} />
              </div>
            )}
            
            {/* Vehicle Selector - always visible */}
            <VehicleSelector
              selectedEVId={inputs.evVehicleId}
              selectedICEId={inputs.iceVehicleId}
              onSelectEV={(id) => {
                setEVVehicle(id);
                if (id) setHasUserInteracted(true);
              }}
              onSelectICE={(id) => {
                setICEVehicle(id);
                if (id) setHasUserInteracted(true);
              }}
            />
          </section>
          
          {/* Step 2: Usage Parameters */}
          {evVehicle && iceVehicle && (
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
          
          {/* Step 3: Cost Parameters */}
          {evVehicle && iceVehicle && (
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
          
          {/* Calculate Button */}
          {evVehicle && iceVehicle && (
            <section className="animate-in">
              <div className="bg-gradient-to-r from-[#FFC300]/10 to-transparent border border-[#FFC300]/30 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">Siap untuk menghitung?</h3>
                    <p className="text-white/50 text-sm">
                      {evVehicle.brand} {evVehicle.series} vs {iceVehicle.brand} {iceVehicle.model}
                    </p>
                  </div>
                  <button
                    onClick={handleCalculate}
                    disabled={!canCalculate}
                    className="flex items-center gap-2 px-8 py-4 bg-[#FFC300] text-forest-dark font-semibold rounded-xl hover:bg-[#FFC300]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <Calculator className="w-5 h-5" />
                    Hitung Perbandingan
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>
          )}
          
          {/* Reset Button */}
          {(evVehicle || iceVehicle) && (
            <div className="animate-in flex justify-center">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-white/70 hover:text-[#FFC300] hover:border-[#FFC300] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset ke Default
              </button>
            </div>
          )}
          
          {/* Calculation Methodology */}
          <section className="animate-in">
            <CalculationMethodology />
          </section>
          
          {/* Results Section - Only shown after Calculate button clicked */}
          {showResults && result && (
            <div ref={resultsRef} className="animate-in space-y-8 pt-8 border-t border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Hasil Perbandingan
                </h2>
                <p className="text-white/50">
                  {evVehicle?.brand} {evVehicle?.series} vs {iceVehicle?.brand} {iceVehicle?.model}
                </p>
              </div>
              
              {/* Savings Summary */}
              <SavingsSummary result={result} />
              
              {/* Charts */}
              <ComparisonChart result={result} />
              
              {/* Detailed Breakdown */}
              <CostBreakdown result={result} />
              
            </div>
          )}
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
