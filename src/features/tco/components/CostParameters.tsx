import { Shield, MapPin, Check } from 'lucide-react';
import { REGIONAL_TAX_RATES } from '../data/regionalTaxRates';
import type { TCOInputs } from '../types';

interface CostParametersProps {
  insuranceType: 'comprehensive' | 'tlo';
  includeTax: boolean;
  region: TCOInputs['region'];
  onInsuranceTypeChange: (type: 'comprehensive' | 'tlo') => void;
  onIncludeTaxChange: (include: boolean) => void;
  onRegionChange: (region: TCOInputs['region']) => void;
}

export function CostParameters({
  insuranceType,
  includeTax,
  region,
  onInsuranceTypeChange,
  onIncludeTaxChange,
  onRegionChange,
}: CostParametersProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Insurance Type */}
      <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#3498DB]/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#3498DB]" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Jenis Asuransi</h3>
            <p className="text-white/50 text-sm">Pertanggungan kendaraan</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Comprehensive */}
          <button
            onClick={() => onInsuranceTypeChange('comprehensive')}
            className={`w-full p-4 rounded-xl border transition-all text-left ${
              insuranceType === 'comprehensive'
                ? 'bg-[#3498DB]/10 border-[#3498DB]'
                : 'bg-forest-dark border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                insuranceType === 'comprehensive' ? 'border-[#3498DB] bg-[#3498DB]' : 'border-white/30'
              }`}>
                {insuranceType === 'comprehensive' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">All Risk (Comprehensive)</div>
                <p className="text-white/50 text-sm mt-1">
                  Menanggung kerusakan total, ringan, dan pencurian. Premi lebih tinggi.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">2-2.5%</span>
                  <span className="text-xs text-white/40">dari harga kendaraan</span>
                </div>
              </div>
            </div>
          </button>
          
          {/* TLO */}
          <button
            onClick={() => onInsuranceTypeChange('tlo')}
            className={`w-full p-4 rounded-xl border transition-all text-left ${
              insuranceType === 'tlo'
                ? 'bg-[#3498DB]/10 border-[#3498DB]'
                : 'bg-forest-dark border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                insuranceType === 'tlo' ? 'border-[#3498DB] bg-[#3498DB]' : 'border-white/30'
              }`}>
                {insuranceType === 'tlo' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">TLO (Total Loss Only)</div>
                <p className="text-white/50 text-sm mt-1">
                  Hanya menanggung kerusakan &gt;75% dan pencurian. Premi lebih rendah.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">0.3-0.5%</span>
                  <span className="text-xs text-white/40">dari harga kendaraan</span>
                </div>
              </div>
            </div>
          </button>
        </div>
        
        <p className="text-white/40 text-xs mt-4">
          * Asumsi diskon NCB (No Claim Bonus) 10% per tahun
        </p>
      </div>
      
      {/* Region & Tax */}
      <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#E74C3C]/20 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#E74C3C]" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Wilayah & Pajak</h3>
            <p className="text-white/50 text-sm">Lokasi kepemilikan</p>
          </div>
        </div>
        
        {/* Region Selection */}
        <div className="mb-6">
          <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">
            Pilih Wilayah
          </label>
          <div className="grid grid-cols-2 gap-2">
            {REGIONAL_TAX_RATES.map(r => (
              <button
                key={r.region}
                onClick={() => onRegionChange(r.region as TCOInputs['region'])}
                className={`p-3 rounded-lg border transition-all text-left ${
                  region === r.region
                    ? 'bg-volt border-volt text-forest-dark'
                    : 'bg-forest-dark border-white/10 text-white hover:border-white/30'
                }`}
              >
                <div className="font-medium text-sm">{r.name}</div>
                <div className={`text-xs ${region === r.region ? 'text-forest-dark/70' : 'text-white/50'}`}>
                  PKB {(r.rate * 100).toFixed(1)}%
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Include Tax Toggle */}
        <div className="bg-forest-dark rounded-xl p-4 border border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-12 h-6 rounded-full transition-all relative ${
              includeTax ? 'bg-[#27AE60]' : 'bg-white/20'
            }`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                includeTax ? 'left-6.5' : 'left-0.5'
              }`} style={{ left: includeTax ? '26px' : '2px' }} />
            </div>
            <input
              type="checkbox"
              checked={includeTax}
              onChange={(e) => onIncludeTaxChange(e.target.checked)}
              className="hidden"
            />
            <div className="flex-1">
              <div className="text-white font-medium text-sm">Hitung Pajak Kendaraan</div>
              <p className="text-white/50 text-xs">
                PKB + SWDKLLJ tahunan
              </p>
            </div>
          </label>
          
          {includeTax && (
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
              <div className="flex justify-between mb-1">
                <span>PKB</span>
                <span>Pajak tahunan</span>
              </div>
              <div className="flex justify-between">
                <span>SWDKLLJ</span>
                <span>Rp 143.000/tahun</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
