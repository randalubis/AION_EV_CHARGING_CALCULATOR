// Site Configuration
// evhub.id — Platform EV Charging Indonesia

export interface SiteConfig {
  language: string;
  siteTitle: string;
  siteDescription: string;
}

export const siteConfig: SiteConfig = {
  language: 'id',
  siteTitle: 'evhub.id - Platform EV Charging Indonesia',
  siteDescription:
    'Platform terpercaya untuk pemilik kendaraan listrik di Indonesia. Kalkulator charging, peta SPKLU, trip planner, dan komunitas EV dalam satu tempat.',
};

// "Why evhub.id" stats — rendered on the landing page stats strip.
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface WhyChooseMeConfig {
  stats: StatItem[];
}

export const whyChooseMeConfig: WhyChooseMeConfig = {
  stats: [
    { value: 73, suffix: '+', label: 'Model EV Tercover' },
    { value: 18, suffix: '', label: 'Merek Mobil' },
    { value: 3000, suffix: '+', label: 'SPKLU di Peta' },
    { value: 100, suffix: '%', label: 'Gratis Digunakan' },
  ],
};

// FAQ Section
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQConfig {
  faqs: FAQItem[];
}

export const faqConfig: FAQConfig = {
  faqs: [
    {
      id: 'faq-1',
      question: 'Apakah evhub.id gratis digunakan?',
      answer:
        'Ya, kalkulator charging, peta SPKLU, dan TCO calculator dapat diakses secara gratis. Tidak ada akun yang perlu dibuat untuk fitur dasar.',
    },
    {
      id: 'faq-2',
      question: 'Bagaimana cara kerja kalkulator charging?',
      answer:
        'Kalkulator kami menggunakan spesifikasi teknis dari 73+ model EV di Indonesia. Masukkan level baterai saat ini, target pengisian, dan tipe charger — kami akan menghitung waktu, biaya, dan jarak tempuh berdasarkan tarif PLN yang berlaku, dengan kurva taper untuk DC fast charging.',
    },
    {
      id: 'faq-3',
      question: 'Apakah data SPKLU di peta selalu up-to-date?',
      answer:
        'Kami mengintegrasikan data dari PLN SPKLU dan kontribusi komunitas. Namun, kami selalu menyarankan untuk memverifikasi ketersediaan charger langsung dengan operator sebelum berangkat.',
    },
    {
      id: 'faq-4',
      question: 'Mengapa charging di rumah lebih murah?',
      answer:
        'Tarif listrik PLN untuk rumah tangga (R1/R2/R3) umumnya lebih murah dibandingkan tarif stasiun charging umum yang sudah termasuk margin bisnis. Kalkulator kami memperhitungkan perbedaan ini, termasuk rugi onboard charger ~10% untuk AC home.',
    },
    {
      id: 'faq-5',
      question: 'Apakah evhub.id tersedia dalam bahasa Inggris?',
      answer:
        'Saat ini platform kami dalam bahasa Indonesia. Dukungan bahasa Inggris akan menyusul.',
    },
    {
      id: 'faq-6',
      question: 'Bagaimana saya bisa berkontribusi menambah data SPKLU?',
      answer:
        'Tekan tombol + di pojok kanan bawah halaman Peta SPKLU untuk mengirim data stasiun baru. Kontribusi akan ditinjau sebelum tampil di peta.',
    },
  ],
};

// Footer
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
  email: string;
  locationText: string;
  socialLinks: SocialLink[];
  copyright: string;
  bottomLinks: FooterLink[];
}

export const footerConfig: FooterConfig = {
  email: 'hello@evhub.id',
  locationText: 'Jakarta, Indonesia',
  socialLinks: [
    { iconName: 'Instagram', href: 'https://instagram.com/evhub.id', label: 'Instagram' },
    { iconName: 'Twitter', href: 'https://twitter.com/evhubid', label: 'Twitter' },
    { iconName: 'Linkedin', href: 'https://linkedin.com/company/evhub', label: 'LinkedIn' },
    { iconName: 'Mail', href: 'mailto:hello@evhub.id', label: 'Email' },
  ],
  copyright: `© ${new Date().getFullYear()} evhub.id. All rights reserved.`,
  bottomLinks: [
    { label: 'Kebijakan Privasi', href: '#privacy' },
    { label: 'Syarat Penggunaan', href: '#terms' },
  ],
};
