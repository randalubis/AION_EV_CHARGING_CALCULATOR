import { Calculator } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="bg-forest-mid/30 rounded-2xl p-12 border border-white/10 text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 border-4 border-volt/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-volt border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Calculator className="w-8 h-8 text-volt" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        Menghitung Perbandingan...
      </h3>
      <p className="text-white/50">
        Sedang menganalisis biaya kepemilikan 5 tahun
      </p>
    </div>
  );
}
