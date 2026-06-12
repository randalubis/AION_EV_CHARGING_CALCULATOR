import { MapPin, Zap, Home } from 'lucide-react';
import { ELECTRICITY_RATES } from '../data/electricityRates';
import type { TCOInputs } from '../types';

interface UsageInputProps {
  annualKm: number;
  ownershipYears: number;
  electricityRateCategory: TCOInputs['electricityRateCategory'];
  homeChargingPercentage: number;
  onAnnualKmChange: (km: number) => void;
  onOwnershipYearsChange: (years: number) => void;
  onElectricityRateChange: (category: TCOInputs['electricityRateCategory']) => void;
  onHomeChargingChange: (percentage: number) => void;
}

export function UsageInput({
  annualKm,
  ownershipYears,
  electricityRateCategory,
  homeChargingPercentage,
  onAnnualKmChange,
  onOwnershipYearsChange,
  onElectricityRateChange,
  onHomeChargingChange,
}: UsageInputProps) {
  const kmOptions = [5000, 10000, 15000, 20000, 25000, 30000, 50000];
  const yearOptions = [1, 2, 3, 4, 5];
  
  const publicChargingPercentage = 100 - homeChargingPercentage;
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Annual Distance */}
      <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FFC300]/20 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#FFC300]" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Jarak Tempuh</h3>
            <p className="text-white/50 text-sm">Penggunaan tahunan</p>
          </div>
        </div>
        
        {/* Quick Select Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {kmOptions.map(km => (
            <button
              key={km}
              onClick={() => onAnnualKmChange(km)}
              className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                annualKm === km
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-dark border border-white/10 text-white/70 hover:border-white/30'
              }`}
            >
              {(km / 1000)}K
            </button>
          ))}
        </div>
        
        {/* Custom Input */}
        <div className="relative">
          <input
            type="number"
            value={annualKm}
            onChange={(e) => onAnnualKmChange(parseInt(e.target.value) || 0)}
            className="w-full bg-forest-dark border border-white/20 rounded-lg px-4 py-3 text-white font-medium focus:border-[#FFC300] focus:outline-none"
            min={0}
            step={1000}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">
            km/tahun
          </span>
        </div>
        
        <p className="text-white/40 text-xs mt-2">
          {(annualKm / 12).toLocaleString('id-ID')} km/bulan
        </p>
      </div>
      
      {/* Ownership Duration */}
      <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FFC300]/20 rounded-lg flex items-center justify-center">
            <span className="text-[#FFC300] font-bold text-sm">Yr</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">Periode Kepemilikan</h3>
            <p className="text-white/50 text-sm">Lama menggunakan kendaraan</p>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {yearOptions.map(years => (
            <button
              key={years}
              onClick={() => onOwnershipYearsChange(years)}
              className={`py-3 rounded-xl text-center font-semibold transition-all ${
                ownershipYears === years
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-dark border border-white/10 text-white/70 hover:border-white/30'
              }`}
            >
              <div className="text-xl">{years}</div>
              <div className="text-xs opacity-70">Thn</div>
            </button>
          ))}
        </div>
        
        {/* Custom Years Input */}
        <div className="relative">
          <input
            type="number"
            value={ownershipYears > 5 ? ownershipYears : ''}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              if (val >= 1 && val <= 20) onOwnershipYearsChange(val);
            }}
            placeholder="Lainnya (6-20 thn)"
            className="w-full bg-forest-dark border border-white/20 rounded-lg px-4 py-3 text-white font-medium focus:border-[#FFC300] focus:outline-none placeholder:text-white/30"
            min={6}
            max={20}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">
            tahun
          </span>
        </div>
        
        <p className="text-white/40 text-xs mt-4">
          Total jarak: {(annualKm * ownershipYears).toLocaleString('id-ID')} km
        </p>
      </div>
      
      {/* Electricity Settings */}
      <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10 md:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#27AE60]/20 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#27AE60]" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Pengaturan Listrik</h3>
            <p className="text-white/50 text-sm">Tarif dan pola charging</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Electricity Rate */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">
              Tarif Listrik
            </label>
            <div className="space-y-2">
              {ELECTRICITY_RATES.map(rate => (
                <button
                  key={rate.category}
                  onClick={() => onElectricityRateChange(rate.category)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                    electricityRateCategory === rate.category
                      ? 'bg-[#FFC300] border-[#FFC300] text-forest-dark'
                      : 'bg-forest-dark border-white/10 text-white hover:border-white/30'
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{rate.name}</div>
                    <div className={`text-xs ${electricityRateCategory === rate.category ? 'text-forest-dark/70' : 'text-white/50'}`}>
                      {rate.description}
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${electricityRateCategory === rate.category ? 'text-forest-dark' : 'text-[#FFC300]'}`}>
                    Rp {rate.ratePerKwh.toLocaleString('id-ID')}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Charging Mix */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">
              Pola Charging
            </label>
            
            {/* Slider */}
            <div className="bg-forest-dark rounded-xl p-4 border border-white/10 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70 flex items-center gap-1">
                  <Home className="w-4 h-4" /> Rumah
                </span>
                <span className="text-white/70 flex items-center gap-1">
                  Publik <Zap className="w-4 h-4" />
                </span>
              </div>
              
              <input
                type="range"
                min={0}
                max={100}
                value={homeChargingPercentage}
                onChange={(e) => onHomeChargingChange(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer mb-3"
                style={{
                  background: `linear-gradient(to right, #27AE60 0%, #27AE60 ${homeChargingPercentage}%, rgba(255,255,255,0.1) ${homeChargingPercentage}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#27AE60]">{homeChargingPercentage}%</div>
                  <div className="text-xs text-white/40">Home Charging</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FFC300]">{publicChargingPercentage}%</div>
                  <div className="text-xs text-white/40">Public Charging</div>
                </div>
              </div>
            </div>
            
            {/* Quick Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[100, 80, 50, 30, 0].map(pct => (
                <button
                  key={pct}
                  onClick={() => onHomeChargingChange(pct)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    homeChargingPercentage === pct
                      ? 'bg-[#27AE60] text-white'
                      : 'bg-forest-dark border border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            
            <p className="text-white/40 text-xs mt-3">
              {homeChargingPercentage >= 80 
                ? '✓ Pola charging ideal - biaya lebih hemat'
                : homeChargingPercentage >= 50
                ? '→ Seimbang antara kenyamanan dan biaya'
                : '⚠ Banyak menggunakan public charging - biaya lebih tinggi'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
