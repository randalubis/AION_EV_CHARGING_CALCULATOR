// Site Configuration
// setrum.id - Platform EV Charging Indonesia

export interface SiteConfig {
  language: string;
  siteTitle: string;
  siteDescription: string;
}

export const siteConfig: SiteConfig = {
  language: "id",
  siteTitle: "evhub.id - Platform EV Charging Indonesia",
  siteDescription: "Platform terpercaya untuk pemilik kendaraan listrik di Indonesia. Kalkulator charging, peta SPKLU, trip planner, dan komunitas EV dalam satu tempat.",
};

// Hero Section
export interface HeroConfig {
  backgroundText: string;
  heroImage: string;
  heroImageAlt: string;
  overlayText: string;
  brandName: string;
  navLinks: { label: string; href: string }[];
}

export const heroConfig: HeroConfig = {
  backgroundText: "CHARGE ON",
  heroImage: "/hero-ev.png",
  heroImageAlt: "Mobil listrik modern sedang charging",
  overlayText: "Masa depan mobilitas Indonesia",
  brandName: "evhub.id",
  navLinks: [
    { label: "Kalkulator", href: "#kalkulator" },
    { label: "Peta SPKLU", href: "#peta" },
    { label: "Trip Planner", href: "#trip" },
    { label: "Fitur", href: "#fitur" },
    { label: "FAQ", href: "#faq" },
  ],
};

// Intro Grid Section
export interface PortfolioImage {
  src: string;
  alt: string;
}

export interface IntroGridConfig {
  titleLine1: string;
  titleLine2: string;
  description: string;
  portfolioImages: PortfolioImage[];
  accentText: string;
}

export const introGridConfig: IntroGridConfig = {
  titleLine1: "Ekosistem Charging",
  titleLine2: "untuk Indonesia",
  description: "evhub.id hadir sebagai solusi lengkap bagi pemilik kendaraan listrik di Indonesia. Dari kalkulator charging yang akurat, peta SPKLU real-time, hingga trip planner untuk perjalanan lintas kota — semua dalam satu platform yang dirancang khusus untuk kondisi Indonesia.",
  portfolioImages: [
    { src: "/grid-1.jpg", alt: "Stasiun charging modern di malam hari" },
    { src: "/grid-2.jpg", alt: "Close-up port charging EV" },
    { src: "/grid-3.jpg", alt: "Mobil listrik di jalan tol Indonesia" },
    { src: "/grid-4.jpg", alt: "Keluarga melihat mobil listrik di dealer" },
    { src: "/grid-5.jpg", alt: "Jaringan charging station dari udara" },
  ],
  accentText: "73 Model EV • 18 Merek • Seluruh Indonesia",
};

// Featured Projects Section - Repurposed as Platform Features
export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
}

export interface FeaturedProjectsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  viewAllText: string;
  viewAllHref: string;
  viewProjectText: string;
  projects: Project[];
}

export const featuredProjectsConfig: FeaturedProjectsConfig = {
  subtitle: "Fitur Platform",
  titleRegular: "Solusi",
  titleItalic: "Lengkap",
  viewAllText: "Lihat Semua Fitur",
  viewAllHref: "#fitur",
  viewProjectText: "Pelajari",
  projects: [
    {
      id: 1,
      title: "Kalkulator Charging",
      category: "Phase 1 - Live",
      year: "2024",
      image: "/feature-calculator.jpg",
      description: "Hitung waktu charging, biaya, dan jarak tempuh untuk 73 model EV di pasar Indonesia. Mendukung tarif PLN R1, R2, R3, dan stasiun umum."
    },
    {
      id: 2,
      title: "Peta SPKLU",
      category: "Phase 2 - In Planning",
      year: "2025",
      image: "/feature-map.jpg",
      description: "Peta interaktif seluruh stasiun pengisian kendaraan listrik umum di Indonesia dengan filter kompatibilitas mobil Anda."
    },
    {
      id: 3,
      title: "Trip Planner",
      category: "Phase 3 - Roadmap",
      year: "2025",
      image: "/feature-trip.jpg",
      description: "Rencanakan perjalanan lintas kota dengan rekomendasi charging stop optimal berdasarkan baterai dan jarak tempuh mobil Anda."
    },
    {
      id: 4,
      title: "TCO Calculator",
      category: "Phase 4 - Vision",
      year: "2026",
      image: "/feature-tco.jpg",
      description: "Bandingkan biaya kepemilikan EV vs mobil bensin selama 3-5 tahun termasuk bahan bakar, listrik, servis, dan depresiasi."
    },
  ],
};

// Services Section - Repurposed as What We Offer
export interface ServiceItem {
  iconName: string;
  title: string;
  description: string;
}

export interface ServicesConfig {
  subtitle: string;
  titleLine1: string;
  titleLine2Italic: string;
  description: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  subtitle: "Apa yang Kami Tawarkan",
  titleLine1: "Dari Pemilik EV",
  titleLine2Italic: "Untuk Pemilik EV",
  description: "evhub.id dibangun oleh tim yang memahami tantangan nyata pemilik kendaraan listrik di Indonesia. Setiap fitur dirancang untuk menjawab pertanyaan: 'Apakah saya bisa sampai?' dan 'Bagaimana cara charging lebih pintar?'",
  services: [
    {
      iconName: "Zap",
      title: "Kalkulator Akurat",
      description: "Perhitungan waktu charging dan biaya berdasarkan spesifikasi 73 model EV dan tarif PLN terkini."
    },
    {
      iconName: "MapPin",
      title: "Peta SPKLU",
      description: "Temukan stasiun charging terdekat dengan informasi real-time tentang ketersediaan dan tipe charger."
    },
    {
      iconName: "Route",
      title: "Trip Planner",
      description: "Rencanakan perjalanan dengan percaya diri — tahu persis di mana harus berhenti charging."
    },
    {
      iconName: "Wallet",
      title: "Hemat Biaya",
      description: "Bandingkan biaya EV vs mobil bensin dan temukan jadwal charging paling hemat di rumah Anda."
    },
  ],
};

// Why Choose Me Section - Repurposed as Why setrum.id
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface FeatureCard {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface WhyChooseMeConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  statsLabel: string;
  stats: StatItem[];
  featureCards: FeatureCard[];
  wideImage: string;
  wideImageAlt: string;
  wideTitle: string;
  wideDescription: string;
}

export const whyChooseMeConfig: WhyChooseMeConfig = {
  subtitle: "Mengapa evhub.id",
  titleRegular: "Platform",
  titleItalic: "Terpercaya",
  statsLabel: "Dalam Angka",
  stats: [
    { value: 73, suffix: "+", label: "Model EV Tercover" },
    { value: 18, suffix: "", label: "Merek Mobil" },
    { value: 1000, suffix: "+", label: "SPKLU di Indonesia" },
    { value: 98, suffix: "%", label: "Kepuasan Pengguna" },
  ],
  featureCards: [
    {
      image: "/why-1.jpg",
      imageAlt: "Pemilik EV yang puas",
      title: "Dibuat untuk Indonesia",
      description: "Tidak ada lagi kalkulator yang dirancang untuk pasar luar negeri. setrum.id menggunakan tarif PLN nyata dan data SPKLU lokal."
    },
    {
      image: "/why-2.jpg",
      imageAlt: "Professional wanita Indonesia",
      title: "Data yang Akurat",
      description: "Spesifikasi baterai dan kecepatan charging untuk setiap model EV di Indonesia, diperbarui secara berkala."
    },
  ],
  wideImage: "/why-wide.jpg",
  wideImageAlt: "Jaringan charging station di Indonesia",
  wideTitle: "Masa Depan Mobilitas",
  wideDescription: "Bergabunglah dengan ribuan pemilik EV di Indonesia yang telah menggunakan setrum.id untuk perjalanan mereka."
};

// Testimonials Section
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
}

export interface TestimonialsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  testimonials: Testimonial[];
}

export const testimonialsConfig: TestimonialsConfig = {
  subtitle: "Cerita Pengguna",
  titleRegular: "Apa Kata",
  titleItalic: "Mereka",
  testimonials: [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Pemilik Wuling Air EV",
      image: "/testi-1.jpg",
      quote: "evhub.id sangat membantu saya memahami berapa lama waktu charging dan berapa biayanya. Sebelumnya saya selalu bingung dengan perhitungan manual."
    },
    {
      id: 2,
      name: "Dewi Kusuma",
      role: "Pemilik Hyundai Ioniq 5",
      image: "/testi-2.jpg",
      quote: "Trip planner-nya sangat berguna saat saya traveling dari Jakarta ke Bandung. Tahu persis di mana harus berhenti charging."
    },
    {
      id: 3,
      name: "Ahmad Wijaya",
      role: "Fleet Manager",
      image: "/testi-3.jpg",
      quote: "Sebagai fleet manager, evhub.id membantu saya mengoptimalkan biaya charging untuk 15 mobil listrik perusahaan kami."
    },
  ],
};

// FAQ Section
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  ctaText: string;
  ctaButtonText: string;
  ctaHref: string;
  faqs: FAQItem[];
}

export const faqConfig: FAQConfig = {
  subtitle: "Pertanyaan Umum",
  titleRegular: "Yang Sering",
  titleItalic: "Ditanyakan",
  ctaText: "Masih punya pertanyaan?",
  ctaButtonText: "Hubungi Kami",
  ctaHref: "mailto:hello@evhub.id",
  faqs: [
    {
      id: "faq-1",
      question: "Apakah evhub.id gratis digunakan?",
      answer: "Ya, kalkulator charging dan informasi dasar SPKLU dapat diakses secara gratis. Fitur premium seperti trip planner detail dan notifikasi WhatsApp akan tersedia di masa depan."
    },
    {
      id: "faq-2",
      question: "Bagaimana cara kerja kalkulator charging?",
      answer: "Kalkulator kami menggunakan spesifikasi teknis dari 73 model EV di Indonesia. Masukkan level baterai saat ini, target charging, dan tipe charger — kami akan menghitung waktu, biaya, dan jarak tempuh berdasarkan tarif PLN yang berlaku."
    },
    {
      id: "faq-3",
      question: "Apakah data SPKLU di peta selalu up-to-date?",
      answer: "Kami mengintegrasikan data dari berbagai sumber termasuk PLN dan kontribusi komunitas. Namun, kami selalu menyarankan untuk memverifikasi ketersediaan charger langsung dengan operator sebelum berangkat."
    },
    {
      id: "faq-4",
      question: "Mengapa charging di rumah lebih murah?",
      answer: "Tarif listrik PLN untuk rumah tangga (R1/R2) umumnya lebih murah dibandingkan tarif stasiun charging umum yang sudah termasuk margin bisnis. Kalkulator kami memperhitungkan perbedaan ini."
    },
    {
      id: "faq-5",
      question: "Apakah evhub.id tersedia dalam bahasa Inggris?",
      answer: "Saat ini platform kami dalam bahasa Indonesia. Dukungan bahasa Inggris akan segera hadir untuk memudahkan pengguna internasional di Indonesia."
    },
    {
      id: "faq-6",
      question: "Bagaimana saya bisa berkontribusi menambah data SPKLU?",
      answer: "Kami sangat menghargai kontribusi komunitas! Anda dapat mengirimkan informasi SPKLU baru atau koreksi data melalui formulir yang tersedia di aplikasi kami."
    },
  ],
};

// Footer Section
export interface SocialLink {
  iconName: string;
  href: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  logoText: string;
  contactLabel: string;
  email: string;
  locationText: string;
  navigationLabel: string;
  navLinks: FooterLink[];
  socialLabel: string;
  socialLinks: SocialLink[];
  tagline: string;
  copyright: string;
  bottomLinks: FooterLink[];
}

export const footerConfig: FooterConfig = {
  logoText: "EVHUB",
  contactLabel: "Hubungi Kami",
  email: "hello@evhub.id",
  locationText: "Jakarta, Indonesia",
  navigationLabel: "Navigasi",
  navLinks: [
    { label: "Kalkulator", href: "#kalkulator" },
    { label: "Peta SPKLU", href: "#peta" },
    { label: "Trip Planner", href: "#trip" },
    { label: "Fitur", href: "#fitur" },
    { label: "FAQ", href: "#faq" },
  ],
  socialLabel: "Ikuti Kami",
  socialLinks: [
    { iconName: "Instagram", href: "https://instagram.com/evhub.id", label: "Instagram" },
    { iconName: "Twitter", href: "https://twitter.com/evhubid", label: "Twitter" },
    { iconName: "Linkedin", href: "https://linkedin.com/company/evhub", label: "LinkedIn" },
    { iconName: "Mail", href: "mailto:hello@evhub.id", label: "Email" },
  ],
  tagline: "Masa depan mobilitas Indonesia\nDimulai dari sini",
  copyright: "© 2026 evhub.id. All rights reserved.",
  bottomLinks: [
    { label: "Kebijakan Privasi", href: "#privacy" },
    { label: "Syarat Penggunaan", href: "#terms" },
  ],
};
