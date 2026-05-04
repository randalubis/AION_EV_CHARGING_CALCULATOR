import { AlertTriangle } from 'lucide-react';

export function DisclaimerCard() {
  return (
    <div className="mt-6 bg-forest-mid/30 rounded-xl p-6 border-l-4 border-[#FFC300]">
      <div className="text-[#FFC300] text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Catatan Penting
      </div>
      <div className="text-white/60 text-sm space-y-2">
        <p>Ini estimasi. Hasil aktual dapat bervariasi karena:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Suhu baterai &amp; kondisi sekitar</li>
          <li>Usia baterai &amp; penurunan kapasitas</li>
          <li>Kualitas dan panjang kabel cas</li>
          <li>Efisiensi charger aktual per merek/model</li>
          <li>Cas di atas 80% kurang efisien (cell balancing) — sudah diperhitungkan untuk DC</li>
          <li>Cas AC ~10% rugi · Cas DC ~7% rugi (tipikal)</li>
        </ul>
        <p className="mt-3">Gunakan sebagai panduan. Pantau sesi cas aktual untuk data akurat.</p>
      </div>
    </div>
  );
}
