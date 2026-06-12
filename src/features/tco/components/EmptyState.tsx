import { Zap, Fuel, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  onSelectExample?: () => void;
}

export function EmptyState({ onSelectExample }: EmptyStateProps) {
  return (
    <div className="bg-forest-mid/30 rounded-2xl p-12 border border-white/10 text-center">
      <div className="flex justify-center gap-4 mb-6">
        <div className="w-16 h-16 bg-[#27AE60]/20 rounded-2xl flex items-center justify-center">
          <Zap className="w-8 h-8 text-[#27AE60]" />
        </div>
        <div className="flex items-center">
          <ArrowRight className="w-6 h-6 text-white/30" />
        </div>
        <div className="w-16 h-16 bg-[#E67E22]/20 rounded-2xl flex items-center justify-center">
          <Fuel className="w-8 h-8 text-[#E67E22]" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        Pilih Kendaraan untuk Memulai
      </h3>
      <p className="text-white/50 max-w-md mx-auto mb-6">
        Pilih satu mobil listrik (EV) dan satu mobil bensin (ICE) untuk 
        membandingkan biaya kepemilikan selama 5 tahun.
      </p>
      
      {onSelectExample && (
        <button
          onClick={onSelectExample}
          className="inline-flex items-center gap-2 bg-[#FFC300] hover:bg-[#FFD60A] text-forest-dark font-semibold px-6 py-3 rounded-xl transition-all"
        >
          Contoh Perbandingan
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
      
      <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
        <div className="bg-forest-dark/50 rounded-xl p-4">
          <div className="text-[#FFC300] font-semibold text-sm mb-1">1. Pilih Kendaraan</div>
          <p className="text-white/50 text-xs">
            Pilih EV dan mobil bensin yang ingin dibandingkan
          </p>
        </div>
        <div className="bg-forest-dark/50 rounded-xl p-4">
          <div className="text-[#FFC300] font-semibold text-sm mb-1">2. Atur Penggunaan</div>
          <p className="text-white/50 text-xs">
            Tentukan jarak tempuh tahunan dan pola charging
          </p>
        </div>
        <div className="bg-forest-dark/50 rounded-xl p-4">
          <div className="text-[#FFC300] font-semibold text-sm mb-1">3. Lihat Hasil</div>
          <p className="text-white/50 text-xs">
            Analisis biaya total dan penghematan
          </p>
        </div>
      </div>
    </div>
  );
}
