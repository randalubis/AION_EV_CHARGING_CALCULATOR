import { useState } from 'react';
import { ChevronDown, Calculator, Info } from 'lucide-react';

export function CalculationMethodology() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-carbon-900/30 rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-volt/20 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-volt" />
          </div>
          <div className="text-left">
            <div className="text-white font-semibold">Metodologi Perhitungan TCO</div>
            <div className="text-white/50 text-sm">Pahami bagaimana kalkulasi dilakukan</div>
          </div>
        </div>
        <ChevronDown className={`w-6 h-6 text-volt transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 space-y-6">
          {/* Formula */}
          <div className="bg-carbon-950/50 rounded-xl p-4 border border-white/10">
            <div className="text-volt font-medium mb-2">Rumus TCO</div>
            <div className="text-white font-mono text-sm">
              TCO = Harga Beli + Biaya Operasional - Nilai Sisa
            </div>
          </div>
          
          {/* Cost Components */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>
                Biaya Energi
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• <strong>EV:</strong> (km/tahun ÷ 100) × kWh/100km × tarif listrik</li>
                <li>• <strong>ICE:</strong> (km/tahun ÷ km/liter) × harga BBM</li>
                <li>• PLN tarif: R1 (1,444), R2 (2,076), R3 (2,654), Umum (3,000)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#3498DB] rounded-full"></span>
                Perawatan
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• <strong>EV:</strong> Service ringan + ban + kampas rem</li>
                <li>• <strong>ICE:</strong> Service + oli + filter + timing belt</li>
                <li>• EV lebih murah 60-70% (tanpa oli & filter)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#9B59B6] rounded-full"></span>
                Asuransi
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• All Risk: 1.8-2.5% dari harga kendaraan</li>
                <li>• TLO: 0.3-0.5% dari harga kendaraan</li>
                <li>• Diskon NCB: -10% per tahun (max 25%)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#E74C3C] rounded-full"></span>
                Pajak & Depresiasi
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>• PKB: 1.5-2% dari NJKB (berbeda per wilayah)</li>
                <li>• SWDKLLJ: Rp 143.000/tahun</li>
                <li>• Depresiasi: EV -20% th 1, ICE -15% th 1</li>
              </ul>
            </div>
          </div>
          
          {/* Data Sources */}
          <div className="bg-volt/5 border border-volt/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-volt flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-volt font-medium mb-2">Sumber Data & Disclaimer</div>
                <ul className="space-y-1 text-sm text-white/60">
                  <li>• Harga kendaraan: OTOMOTIF, dealer resmi, dan sumber pasar</li>
                  <li>• Tarif BBM: Pertamina (Pertalite, Pertamax, Dexlite)</li>
                  <li>• Tarif listrik: PLN Tarif Dasar Listrik 2025</li>
                  <li>• Biaya perawatan: Estimasi bengkel resmi dan aftermarket</li>
                  <li>• Depresiasi: Data pasar mobil bekas (OLX, OTO)</li>
                </ul>
                <div className="mt-3 pt-3 border-t border-white/10 text-white/50 text-xs">
                  <strong>Disclaimer:</strong> Perhitungan ini adalah estimasi berdasarkan data rata-rata pasar. 
                  Harga aktual dapat bervariasi tergantung lokasi, kondisi kendaraan, dan perubahan kebijakan. 
                  Hasil tidak mengikat dan digunakan untuk tujuan informasi saja.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
