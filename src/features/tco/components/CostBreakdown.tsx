import type { TCOResult } from '../types';
import { formatCompactNumber } from '../utils/calculations';

interface CostBreakdownProps {
  result: TCOResult;
}

export function CostBreakdown({ result }: CostBreakdownProps) {
  const { ev, ice, savings } = result;
  
  // Calculate total for each category
  const evEnergy = ev.yearlyCosts.reduce((sum, y) => sum + y.energy, 0);
  const evMaintenance = ev.yearlyCosts.reduce((sum, y) => sum + y.maintenance, 0);
  const evInsurance = ev.yearlyCosts.reduce((sum, y) => sum + y.insurance, 0);
  const evTax = ev.yearlyCosts.reduce((sum, y) => sum + y.tax, 0);
  const evDepreciation = ev.yearlyCosts.reduce((sum, y) => sum + y.depreciation, 0);
  
  const iceEnergy = ice.yearlyCosts.reduce((sum, y) => sum + y.energy, 0);
  const iceMaintenance = ice.yearlyCosts.reduce((sum, y) => sum + y.maintenance, 0);
  const iceInsurance = ice.yearlyCosts.reduce((sum, y) => sum + y.insurance, 0);
  const iceTax = ice.yearlyCosts.reduce((sum, y) => sum + y.tax, 0);
  const iceDepreciation = ice.yearlyCosts.reduce((sum, y) => sum + y.depreciation, 0);
  
  const categories = [
    { name: 'Bahan Bakar / Energi', ev: evEnergy, ice: iceEnergy },
    { name: 'Perawatan & Servis', ev: evMaintenance, ice: iceMaintenance },
    { name: 'Asuransi', ev: evInsurance, ice: iceInsurance },
    { name: 'Pajak Kendaraan', ev: evTax, ice: iceTax },
    { name: 'Depresiasi', ev: evDepreciation, ice: iceDepreciation },
  ];
  
  return (
    <div className="bg-carbon-900/50 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h3 className="text-white font-semibold text-lg">Rincian Biaya 5 Tahun</h3>
        <p className="text-white/50 text-sm mt-1">
          Perbandingan detail biaya kepemilikan
        </p>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-white/50 text-sm font-medium">Komponen Biaya</th>
              <th className="text-right p-4 text-[#27AE60] text-sm font-medium">
                {ev.vehicle.brand} {ev.vehicle.series}
              </th>
              <th className="text-right p-4 text-[#E67E22] text-sm font-medium">
                {ice.vehicle.brand} {ice.vehicle.model}
              </th>
              <th className="text-right p-4 text-white/50 text-sm font-medium">Selisih</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => {
              const diff = cat.ice - cat.ev;
              const isBetter = diff > 0; // EV is cheaper
              
              return (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white text-sm">{cat.name}</td>
                  <td className="p-4 text-right text-white text-sm">
                    Rp {formatCompactNumber(cat.ev)}
                  </td>
                  <td className="p-4 text-right text-white text-sm">
                    Rp {formatCompactNumber(cat.ice)}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`text-sm font-medium ${isBetter ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
                      {isBetter ? '-' : '+'}Rp {formatCompactNumber(Math.abs(diff))}
                    </span>
                  </td>
                </tr>
              );
            })}
            
            {/* Total Row */}
            <tr className="bg-volt/10">
              <td className="p-4 text-white font-semibold">Total Biaya Operasional</td>
              <td className="p-4 text-right text-volt font-bold">
                Rp {formatCompactNumber(ev.totalCost)}
              </td>
              <td className="p-4 text-right text-white font-bold">
                Rp {formatCompactNumber(ice.totalCost)}
              </td>
              <td className="p-4 text-right">
                <span className={`font-bold ${savings.absolute > 0 ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
                  {savings.absolute > 0 ? '-' : '+'}Rp {formatCompactNumber(Math.abs(savings.absolute))}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-white/10">
        {/* EV Total */}
        <div className="bg-carbon-950/50 rounded-xl p-4">
          <div className="text-white/50 text-xs mb-1">Total Biaya EV</div>
          <div className="text-[#27AE60] font-bold text-lg">
            Rp {formatCompactNumber(ev.totalCost)}
          </div>
          <div className="text-white/40 text-xs">
            Rp {formatCompactNumber(ev.costPerKm)}/km
          </div>
        </div>
        
        {/* ICE Total */}
        <div className="bg-carbon-950/50 rounded-xl p-4">
          <div className="text-white/50 text-xs mb-1">Total Biaya ICE</div>
          <div className="text-[#E67E22] font-bold text-lg">
            Rp {formatCompactNumber(ice.totalCost)}
          </div>
          <div className="text-white/40 text-xs">
            Rp {formatCompactNumber(ice.costPerKm)}/km
          </div>
        </div>
        
        {/* Savings */}
        <div className="bg-[#27AE60]/10 rounded-xl p-4 border border-[#27AE60]/30">
          <div className="text-[#27AE60] text-xs mb-1">Penghematan</div>
          <div className="text-[#27AE60] font-bold text-lg">
            Rp {formatCompactNumber(savings.absolute)}
          </div>
          <div className="text-[#27AE60]/70 text-xs">
            {savings.percentage > 0 ? `-${savings.percentage}%` : `+${Math.abs(savings.percentage)}%`}
          </div>
        </div>
        
        {/* Break Even */}
        <div className="bg-carbon-950/50 rounded-xl p-4">
          <div className="text-white/50 text-xs mb-1">Break-Even Point</div>
          <div className="text-white font-bold text-lg">
            {savings.breakEvenYear ? `Tahun ${savings.breakEvenYear}` : 'Tidak ada'}
          </div>
          <div className="text-white/40 text-xs">
            {savings.breakEvenYear ? 'EV mulai lebih murah' : 'ICE lebih murah'}
          </div>
        </div>
      </div>
      
      {/* Yearly Breakdown Toggle */}
      <div className="px-6 pb-6">
        <details className="group">
          <summary className="flex items-center justify-between p-4 bg-carbon-950/50 rounded-xl cursor-pointer hover:bg-carbon-950 transition-colors">
            <span className="text-white font-medium text-sm">Lihat Rincian per Tahun</span>
            <span className="text-volt group-open:rotate-180 transition-transform">▼</span>
          </summary>
          
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-white/50">Tahun</th>
                  <th className="text-right p-3 text-[#27AE60]">EV Kumulatif</th>
                  <th className="text-right p-3 text-[#E67E22]">ICE Kumulatif</th>
                  <th className="text-right p-3 text-white/50">Selisih</th>
                </tr>
              </thead>
              <tbody>
                {ev.yearlyCosts.map((evYear, idx) => {
                  const iceYear = ice.yearlyCosts[idx];
                  const diff = iceYear.cumulative - evYear.cumulative;
                  const isEvbetter = diff > 0;
                  
                  return (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="p-3 text-white">Tahun {evYear.year}</td>
                      <td className="p-3 text-right text-white">
                        Rp {formatCompactNumber(evYear.cumulative)}
                      </td>
                      <td className="p-3 text-right text-white">
                        Rp {formatCompactNumber(iceYear.cumulative)}
                      </td>
                      <td className="p-3 text-right">
                        <span className={`${isEvbetter ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
                          {isEvbetter ? '▲' : '▼'} Rp {formatCompactNumber(Math.abs(diff))}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
