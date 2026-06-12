import { AlertTriangle } from 'lucide-react';

export function DisclaimerCard() {
  return (
    <div className="mt-6 bg-forest-mid/30 rounded-xl p-6 border-l-4 border-volt">
      <div className="text-volt text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Catatan Penting
      </div>
      <div className="text-white/60 text-sm space-y-2">
        <p>Ini estimasi. Hasil aktual dapat bervariasi karena:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Suhu baterai &amp; kondisi sekitar (cas dingin lebih lambat)</li>
          <li>Usia baterai &amp; penurunan kapasitas</li>
          <li>Kualitas &amp; panjang kabel cas</li>
          <li>Kurva pengisian aktual per mobil — kami pakai profil rata-rata EV modern</li>
          <li>
            DC fast charging melambat di atas 80% (cell balancing) — sudah diperhitungkan
            dengan kurva 5-tahap dalam estimasi waktu
          </li>
          <li>
            Rugi efisiensi: AC ~10% (onboard charger), DC ~5% (kabel &amp; baterai).
            Biaya tarif rumah PLN sudah memperhitungkan rugi AC; tarif SPKLU per kWh ke baterai.
          </li>
        </ul>
        <p className="mt-3">Gunakan sebagai panduan. Pantau sesi cas aktual untuk data akurat.</p>
      </div>
    </div>
  );
}
