// Illustrative sample testimonials — fabricated for layout/launch purposes.
// Replace entries with real user quotes as they come in; shape stays the same.
export interface Testimonial {
  id: string;
  name: string;
  vehicle: string;
  region: string;
  quote: string;
  tool: 'kalkulator' | 'peta' | 'tco' | 'komunitas';
  accentHue: number; // 0-360, tints the initials avatar
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'raka-pradana',
    name: 'Raka Pradana',
    vehicle: 'Hyundai Ioniq 5',
    region: 'Jakarta Selatan',
    quote:
      'Gue baru ngeh tarif R1 buat cas malam di rumah ternyata jauh lebih murah dari yang gue kira. Kalkulatornya langsung kasih biaya per km, jadi gampang banget bandinginnya.',
    tool: 'kalkulator',
    accentHue: 79,
  },
  {
    id: 'sinta-maharani',
    name: 'Sinta Maharani',
    vehicle: 'Wuling Air ev',
    region: 'Bandung',
    quote:
      'Aku suka sih karena kurva taper DC-nya ikut dihitung — jadi estimasi waktu cas dari 20 ke 80 persen lumayan akurat, nggak overpromise kayak app lain.',
    tool: 'kalkulator',
    accentHue: 145,
  },
  {
    id: 'budi-hartono',
    name: 'Budi Hartono',
    vehicle: 'BYD Atto 3',
    region: 'Surabaya',
    quote:
      'Saya menggunakan peta SPKLU untuk merencanakan perjalanan ke luar kota dan filter konektor CCS2-nya sangat membantu memastikan mobil saya kompatibel di setiap titik.',
    tool: 'peta',
    accentHue: 200,
  },
  {
    id: 'putu-wirawan',
    name: 'Putu Wirawan',
    vehicle: 'Chery Omoda E5',
    region: 'Denpasar',
    quote:
      'Rute Jakarta–Semarang lewat tol jadi nggak bikin deg-degan karena tiap SPKLU rest area kelihatan jelas di peta. Banget kebantu pas mudik kemarin.',
    tool: 'peta',
    accentHue: 260,
  },
  {
    id: 'fadhil-rahman',
    name: 'Fadhil Rahman',
    vehicle: 'BYD Seal',
    region: 'Tangerang Selatan',
    quote:
      'Perbandingan TCO 5 tahun vs mobil bensin bikin keputusan saya jauh lebih mantap. Begitu lihat selisih biaya servis dan bahan bakarnya, angkanya bicara sendiri.',
    tool: 'tco',
    accentHue: 320,
  },
  {
    id: 'maria-tampubolon',
    name: 'Maria Tampubolon',
    vehicle: 'Hyundai Kona Electric',
    region: 'Medan',
    quote:
      'Aku sempat ragu soal depresiasi, tapi titik impas di TCO Calculator ternyata lebih cepat dari dugaanku. Lumayan banget buat ngeyakinin suami akhirnya.',
    tool: 'tco',
    accentHue: 30,
  },
  {
    id: 'andre-wijaya',
    name: 'Andre Wijaya',
    vehicle: 'MG4 EV',
    region: 'Bekasi',
    quote:
      'Gabung grup komunitas per merek bikin gue dapet info real soal bengkel sama promo cas. Sesama pemilik MG di sini aktif banget sih bantuin newbie kayak gue.',
    tool: 'komunitas',
    accentHue: 100,
  },
  {
    id: 'dewi-lestari',
    name: 'Dewi Lestari',
    vehicle: 'Wuling BinguoEV',
    region: 'Semarang',
    quote:
      'Direktori komunitasnya ngebantu aku nemu grup pemilik EV di kotaku sendiri. Ternyata banyak banget yang udah pakai listrik di Semarang, jadi makin pede.',
    tool: 'komunitas',
    accentHue: 180,
  },
  {
    id: 'yusuf-siregar',
    name: 'Yusuf Siregar',
    vehicle: 'Nissan Leaf',
    region: 'Makassar',
    quote:
      'Saya selalu mengecek biaya cas per km sebelum berangkat kerja, dan hasilnya konsisten dengan tagihan listrik bulanan saya. Tools ini benar-benar membumi dengan tarif lokal.',
    tool: 'kalkulator',
    accentHue: 230,
  },
  {
    id: 'citra-anindya',
    name: 'Citra Anindya',
    vehicle: 'VinFast VF e34',
    region: 'Balikpapan',
    quote:
      'Sebagai pengguna baru di luar Jawa, peta SPKLU dengan filter daya membantu saya menemukan stasiun pengisian cepat terdekat tanpa perlu menebak-nebak.',
    tool: 'peta',
    accentHue: 290,
  },
];
