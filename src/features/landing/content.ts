// Landing page content — single source of truth.
// Section components under ./components consume these arrays; edit copy here,
// not inside the section JSX.

import {
  Car,
  Calculator,
  CheckCircle2,
  Database,
  Gift,
  MapPin,
  Route,
  Search,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// ─── Tools (capabilities grid) ──────────────────────────────────────

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Accent hex used for the card's gradient cover + icon tile. */
  accent: string;
  status: 'live' | 'coming-soon';
  statusText: string;
  href: string;
  features: string[];
}

export const TOOLS: Tool[] = [
  {
    id: 'kalkulator',
    title: 'Kalkulator Charging',
    description:
      'Hitung waktu pengisian, biaya listrik, dan jarak tempuh untuk 73+ model EV. Kurva taper DC dan tarif PLN diperhitungkan.',
    icon: Zap,
    accent: '#FFC300',
    status: 'live',
    statusText: 'Tersedia Sekarang',
    href: '/kalkulator',
    features: ['73+ Model EV', 'Tarif PLN R1–R3 & Umum', 'Kurva taper DC'],
  },
  {
    id: 'peta',
    title: 'Peta SPKLU',
    description:
      'Lebih dari 3.000 stasiun pengisian PLN di seluruh Indonesia. Filter konektor, daya, dan cari per wilayah.',
    icon: MapPin,
    accent: '#27AE60',
    status: 'live',
    statusText: 'Tersedia Sekarang',
    href: '/peta-spklu',
    features: ['3.000+ Stasiun PLN', 'Filter Konektor & Daya', 'Cari per Wilayah'],
  },
  {
    id: 'tco',
    title: 'TCO Calculator',
    description:
      'Bandingkan total biaya kepemilikan EV vs mobil bensin: bahan bakar, servis, pajak, asuransi, dan depresiasi.',
    icon: Wallet,
    accent: '#3498DB',
    status: 'live',
    statusText: 'Tersedia Sekarang',
    href: '/tco-calculator',
    features: ['Perbandingan 5 Tahun', 'Biaya Lengkap', 'Titik Impas'],
  },
  {
    id: 'komunitas',
    title: 'Komunitas EV',
    description:
      'Direktori grup pemilik EV — per merek, wilayah, dan minat. Langsung gabung lewat Facebook group atau formulir.',
    icon: Users,
    accent: '#9B59B6',
    status: 'live',
    statusText: 'Tersedia Sekarang',
    href: '/komunitas',
    features: ['18 Merek', 'Per Wilayah', 'Per Minat'],
  },
  {
    id: 'trip',
    title: 'Trip Planner',
    description:
      'Rencanakan perjalanan lintas kota dengan rekomendasi charging stop optimal berdasarkan jarak tempuh mobilmu.',
    icon: Route,
    accent: '#E67E22',
    status: 'coming-soon',
    statusText: 'Segera Hadir',
    href: '/trip-planner',
    features: ['Rute Optimal', 'Charging Stops', 'Estimasi Waktu'],
  },
];

// ─── Stats strip ────────────────────────────────────────────────────

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: 73, suffix: '+', label: 'Model EV Tercover' },
  { value: 18, suffix: '', label: 'Merek Mobil' },
  { value: 3029, suffix: '+', label: 'SPKLU di Peta' },
  { value: 100, suffix: '%', label: 'Gratis Digunakan' },
];

// ─── How it works (3-step journey) ──────────────────────────────────

export interface Step {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  linkText: string;
}

export const STEPS: Step[] = [
  {
    icon: Car,
    title: 'Pilih mobilmu',
    body: 'Mulai dari 73+ model EV di kalkulator — atau bandingkan dulu biayanya dengan mobil bensin di TCO Calculator.',
    href: '/kalkulator',
    linkText: 'Buka Kalkulator',
  },
  {
    icon: Calculator,
    title: 'Hitung kebutuhanmu',
    body: 'Estimasi waktu cas, biaya listrik, dan jarak tempuh — dengan kurva taper DC dan tarif PLN yang akurat.',
    href: '/tco-calculator',
    linkText: 'Bandingkan Biaya',
  },
  {
    icon: Search,
    title: 'Temukan SPKLU & komunitas',
    body: 'Cari stasiun terdekat dari 3.000+ titik PLN, lalu gabung komunitas pemilik EV sesuai merek dan wilayahmu.',
    href: '/peta-spklu',
    linkText: 'Lihat Peta',
  },
];

// ─── Why evhub (value props) ────────────────────────────────────────

export interface ValueProp {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const VALUE_PROPS: ValueProp[] = [
  {
    icon: Database,
    title: 'Data PLN asli',
    body: 'Peta SPKLU bersumber dari data PLN — 3.000+ stasiun dengan tipe konektor dan daya, bukan perkiraan.',
  },
  {
    icon: CheckCircle2,
    title: 'Dibuat untuk Indonesia',
    body: 'Tarif PLN R1/R2/R3, SWDKLLJ, pajak progresif per provinsi — semua perhitungan memakai angka lokal.',
  },
  {
    icon: Gift,
    title: 'Gratis tanpa registrasi',
    body: 'Semua tools bisa langsung dipakai. Tidak ada akun, tidak ada paywall, tidak ada iklan.',
  },
  {
    icon: Users,
    title: 'Terhubung ke komunitas',
    body: 'Direktori komunitas per merek dan wilayah membantumu menemukan sesama pemilik EV di kotamu.',
  },
];

// ─── Footer navigation (all routes) ─────────────────────────────────

export interface FooterNavLink {
  label: string;
  href: string;
}

export const FOOTER_NAV: FooterNavLink[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Kalkulator', href: '/kalkulator' },
  { label: 'Peta SPKLU', href: '/peta-spklu' },
  { label: 'TCO Calculator', href: '/tco-calculator' },
  { label: 'Komunitas', href: '/komunitas' },
  { label: 'Trip Planner', href: '/trip-planner' },
];
