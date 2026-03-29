import { TrendingDown, TrendingUp, Leaf, Award } from 'lucide-react';
import type { TCOResult } from '../types';
import { formatCompactNumber } from '../utils/calculations';

interface SavingsSummaryProps {
  result: TCOResult;
}

export function SavingsSummary({ result }: SavingsSummaryProps) {
  const { ev, ice, savings } = result;
  const isEvbetter = savings.absolute > 0;
  
  // Calculate environmental impact (approximate)
  // ICE: ~120g CO2/km, EV: ~40g CO2/km (including power generation)
  const annualKm = 15000; // Default assumption for display
  const totalKm = annualKm * 5;
  const iceCo2 = totalKm * 0.12; // kg CO2
  const evCo2 = totalKm * 0.04;  // kg CO2
  const co2Saved = iceCo2 - evCo2;
  const treesEquivalent = Math.round(co2Saved / 20); // 1 tree absorbs ~20kg CO2/year
  
  return (
    <div className="space-y-6">
      {/* Main Savings Card */}
      <div className={`rounded-2xl p-8 border ${
        isEvbetter 
          ? 'bg-gradient-to-br from-[#27AE60]/20 to-[#27AE60]/5 border-[#27AE60]/30' 
          : 'bg-gradient-to-br from-[#E74C3C]/20 to-[#E74C3C]/5 border-[#E74C3C]/30'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-2xl font-bold ${isEvbetter ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
              {isEvbetter ? 'EV Lebih Hemat!' : 'ICE Lebih Hemat'}
            </h3>
            <p className="text-white/60 mt-1">
              Total penghematan selama {ev.yearlyCosts.length} tahun
            </p>
          </div>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            isEvbetter ? 'bg-[#27AE60]/20' : 'bg-[#E74C3C]/20'
          }`}>
            {isEvbetter ? (
              <TrendingDown className="w-8 h-8 text-[#27AE60]" />
            ) : (
              <TrendingUp className="w-8 h-8 text-[#E74C3C]" />
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Savings Amount */}
          <div className="bg-forest-dark/50 rounded-xl p-6">
            <div className="text-white/50 text-sm mb-2">Total Penghematan</div>
            <div className={`text-3xl font-bold ${isEvbetter ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
              Rp {formatCompactNumber(Math.abs(savings.absolute))}
            </div>
            <div className={`text-sm mt-1 ${isEvbetter ? 'text-[#27AE60]/70' : 'text-[#E74C3C]/70'}`}>
              {savings.percentage > 0 ? `${savings.percentage}% lebih murah` : `${Math.abs(savings.percentage)}% lebih mahal`}
            </div>
          </div>
          
          {/* Monthly Savings */}
          <div className="bg-forest-dark/50 rounded-xl p-6">
            <div className="text-white/50 text-sm mb-2">Penghematan per Bulan</div>
            <div className={`text-3xl font-bold ${isEvbetter ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
              Rp {formatCompactNumber(Math.abs(savings.absolute) / (ev.yearlyCosts.length * 12))}
            </div>
            <div className="text-white/40 text-sm mt-1">
              Rata-rata per bulan
            </div>
          </div>
          
          {/* Cost per km */}
          <div className="bg-forest-dark/50 rounded-xl p-6">
            <div className="text-white/50 text-sm mb-2">Biaya per Kilometer</div>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-[#27AE60] font-bold text-xl">Rp {formatCompactNumber(ev.costPerKm)}</div>
                <div className="text-[#27AE60]/70 text-xs">EV</div>
              </div>
              <div className="text-white/30">vs</div>
              <div>
                <div className="text-[#E67E22] font-bold text-xl">Rp {formatCompactNumber(ice.costPerKm)}</div>
                <div className="text-[#E67E22]/70 text-xs">ICE</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Break Even Info */}
        {savings.breakEvenYear && (
          <div className="mt-6 bg-forest-dark/50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFC300]/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#FFC300]" />
            </div>
            <div>
              <div className="text-white font-medium">Break-Even Point</div>
              <div className="text-white/60 text-sm">
                EV mulai lebih hemat pada <span className="text-[#FFC300] font-semibold">Tahun {savings.breakEvenYear}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Environmental Impact */}
      <div className="bg-gradient-to-br from-[#2ECC71]/20 to-[#27AE60]/5 rounded-2xl p-6 border border-[#27AE60]/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#27AE60]/20 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-[#27AE60]" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Dampak Lingkungan</h3>
            <p className="text-white/50 text-sm">Selama 5 tahun penggunaan</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-forest-dark/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-[#27AE60]">{Math.round(co2Saved).toLocaleString('id-ID')}</div>
            <div className="text-white/50 text-sm">kg CO₂ dihemat</div>
          </div>
          
          <div className="bg-forest-dark/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-[#27AE60]">{treesEquivalent}</div>
            <div className="text-white/50 text-sm">setara pohon ditumbuhkan</div>
          </div>
          
          <div className="bg-forest-dark/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-[#27AE60]">{(iceCo2 / evCo2).toFixed(1)}x</div>
            <div className="text-white/50 text-sm">lebih rendah emisi</div>
          </div>
        </div>
        
        <p className="text-white/40 text-xs mt-4 text-center">
          *Estimasi berdasarkan data emisi rata-rata EV vs mobil bensin di Indonesia
        </p>
      </div>
      
      {/* Quick Comparison */}
      <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Perbandingan Cepat</h3>
        
        <div className="space-y-4">
          {/* Purchase Price */}
          <div className="flex items-center justify-between p-4 bg-forest-dark/50 rounded-xl">
            <span className="text-white/70">Harga Beli</span>
            <div className="flex items-center gap-6">
              <span className="text-[#27AE60] font-medium">Rp {formatCompactNumber(ev.initialPrice)}</span>
              <span className="text-[#E67E22] font-medium">Rp {formatCompactNumber(ice.initialPrice)}</span>
            </div>
          </div>
          
          {/* Residual Value */}
          <div className="flex items-center justify-between p-4 bg-forest-dark/50 rounded-xl">
            <span className="text-white/70">Nilai Jual (5 tahun)</span>
            <div className="flex items-center gap-6">
              <span className="text-[#27AE60] font-medium">Rp {formatCompactNumber(ev.residualValue)}</span>
              <span className="text-[#E67E22] font-medium">Rp {formatCompactNumber(ice.residualValue)}</span>
            </div>
          </div>
          
          {/* Total Depreciation */}
          <div className="flex items-center justify-between p-4 bg-forest-dark/50 rounded-xl">
            <span className="text-white/70">Total Depresiasi</span>
            <div className="flex items-center gap-6">
              <span className="text-white font-medium">Rp {formatCompactNumber(ev.totalDepreciation)}</span>
              <span className="text-white font-medium">Rp {formatCompactNumber(ice.totalDepreciation)}</span>
            </div>
          </div>
          
          {/* Winner Badge */}
          <div className={`p-4 rounded-xl text-center ${
            isEvbetter 
              ? 'bg-[#27AE60]/10 border border-[#27AE60]/30' 
              : 'bg-[#E67E22]/10 border border-[#E67E22]/30'
          }`}>
            <span className={isEvbetter ? 'text-[#27AE60]' : 'text-[#E67E22]'}>
              {isEvbetter 
                ? `✓ ${ev.vehicle.brand} ${ev.vehicle.series} lebih hemat Rp ${formatCompactNumber(savings.absolute)}`
                : `✓ ${ice.vehicle.brand} ${ice.vehicle.model} lebih hemat Rp ${formatCompactNumber(Math.abs(savings.absolute))}`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
