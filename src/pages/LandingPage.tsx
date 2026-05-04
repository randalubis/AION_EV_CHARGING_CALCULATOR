import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Zap, 
  MapPin, 
  Route, 
  Wallet, 
  Users, 
  ArrowRight, 
  Battery, 
  TrendingDown,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { whyChooseMeConfig, faqConfig, footerConfig } from '../config';

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Kalkulator', href: '/kalkulator' },
  { label: 'Peta SPKLU', href: '/peta-spklu' },
  { label: 'Trip Planner', href: '/trip-planner' },
];

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    id: 'kalkulator',
    title: 'Kalkulator Charging',
    description: 'Hitung waktu pengisian, biaya listrik, dan jarak tempuh untuk 73+ model EV di Indonesia. Mendukung tarif PLN R1, R2, R3, dan stasiun umum.',
    icon: Zap,
    status: 'live',
    statusText: 'Tersedia Sekarang',
    href: '/kalkulator',
    features: ['73+ Model EV', 'Tarif PLN Real-time', 'Estimasi Biaya Akurat'],
    image: '/feature-calculator.jpg',
  },
  {
    id: 'peta',
    title: 'Peta SPKLU',
    description: 'Temukan stasiun pengisian kendaraan listrik umum di seluruh Indonesia. Tipe charger, kecepatan, dan lokasi PLN SPKLU dalam satu peta.',
    icon: MapPin,
    status: 'live',
    statusText: 'Tersedia Sekarang',
    href: '/peta-spklu',
    features: ['3.000+ Stasiun PLN', 'Filter Konektor & Daya', 'Cari per Wilayah'],
    image: '/feature-map.jpg',
  },
  {
    id: 'trip',
    title: 'Trip Planner',
    description: 'Rencanakan perjalanan lintas kota dengan rekomendasi charging stop optimal berdasarkan baterai dan jarak tempuh mobil Anda.',
    icon: Route,
    status: 'coming-soon',
    statusText: 'Segera Hadir',
    href: '/trip-planner',
    features: ['Rute Optimal', 'Charging Stops', 'Estimasi Waktu'],
    image: '/feature-trip.jpg',
  },
  {
    id: 'tco',
    title: 'TCO Calculator',
    description: 'Bandingkan biaya kepemilikan EV vs mobil bensin selama 3-5 tahun termasuk bahan bakar, listrik, servis, dan depresiasi.',
    icon: Wallet,
    status: 'live',
    statusText: 'Tersedia Sekarang',
    href: '/tco-calculator',
    features: ['Perbandingan 5 Tahun', 'Biaya Lengkap', 'Analisis Hemat'],
    image: '/feature-tco.jpg',
  },
  {
    id: 'komunitas',
    title: 'Komunitas EV',
    description: 'Bergabung dengan komunitas pemilik EV Indonesia. Bagikan pengalaman, review SPKLU, dan dapatkan tips dari sesama pengguna.',
    icon: Users,
    status: 'coming-soon',
    statusText: 'Segera Hadir',
    href: '/komunitas',
    features: ['Review SPKLU', 'Tips & Trik', 'Forum Diskusi'],
    image: '/grid-4.jpg',
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const capsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      const heroElements = heroRef.current?.querySelectorAll('.hero-animate');
      if (heroElements && heroElements.length > 0) {
        gsap.fromTo(
          heroElements,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
        );
      }

      // Capabilities animation
      const capCards = capsRef.current?.querySelectorAll('.cap-card');
      if (capCards && capCards.length > 0) {
        ScrollTrigger.create({
          trigger: capsRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              capCards,
              { y: 60, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
            );
          },
          once: true,
        });
      }

      // Stats animation
      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems && statItems.length > 0) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              statItems,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            );
          },
          once: true,
        });
      }

      // FAQ animation
      ScrollTrigger.create({
        trigger: faqRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            faqRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
          );
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark via-forest-mid to-forest-dark" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFC300]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFC300]/3 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <div className="hero-animate inline-flex items-center gap-2 bg-[#FFC300]/10 border border-[#FFC300]/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-[#FFC300] rounded-full animate-pulse" />
                <span className="text-[#FFC300] text-sm font-medium">
                  Platform EV Indonesia
                </span>
              </div>

              <h1 className="hero-animate text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight mb-6">
                Platform Lengkap untuk
                <span className="block text-[#FFC300]">Pemilik EV Indonesia</span>
              </h1>

              <p className="hero-animate text-white/60 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Kalkulator charging akurat, peta SPKLU real-time, trip planner, 
                dan komunitas EV — semua dalam satu platform yang dirancang 
                khusus untuk kondisi Indonesia.
              </p>

              <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/kalkulator"
                  className="inline-flex items-center justify-center gap-2 bg-[#FFC300] hover:bg-[#FFD60A] text-forest-dark font-sans font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
                >
                  <Zap className="w-5 h-5" />
                  Coba Kalkulator
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="#capabilities"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-sans font-semibold py-4 px-8 rounded-xl transition-all border border-white/20"
                >
                  Jelajahi Fitur
                </Link>
              </div>

              {/* Quick stats */}
              <div className="hero-animate flex flex-wrap gap-6 mt-10 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-white/50">
                  <CheckCircle2 className="w-5 h-5 text-[#FFC300]" />
                  <span className="text-sm">73+ Model EV</span>
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <CheckCircle2 className="w-5 h-5 text-[#FFC300]" />
                  <span className="text-sm">18 Merek</span>
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <CheckCircle2 className="w-5 h-5 text-[#FFC300]" />
                  <span className="text-sm">Tarif PLN Real-time</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="hero-animate relative hidden lg:block">
              <div className="relative">
                <img
                  src="/hero-ev.png"
                  alt="Electric Vehicle Charging"
                  className="w-full max-w-lg mx-auto drop-shadow-2xl"
                />
                {/* Floating cards — link to the actual tools */}
                <Link
                  to="/kalkulator"
                  className="absolute -bottom-4 -left-4 bg-forest-mid/90 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl hover:border-[#FFC300]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFC300]/20 rounded-lg flex items-center justify-center">
                      <Battery className="w-5 h-5 text-[#FFC300]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Cek waktu cas</div>
                      <div className="text-white/50 text-xs">untuk EV-mu</div>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/tco-calculator"
                  className="absolute -top-4 -right-4 bg-forest-mid/90 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl hover:border-[#27AE60]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#27AE60]/20 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-[#27AE60]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Bandingkan biaya</div>
                      <div className="text-white/50 text-xs">EV vs Bensin</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-[#FFC300] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-forest-mid/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {whyChooseMeConfig.stats.map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div className="text-4xl md:text-5xl font-sans font-bold text-[#FFC300] mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" ref={capsRef} className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#FFC300] text-sm font-body uppercase tracking-widest mb-4">
              Fitur Platform
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white mb-6">
              Semua yang Kamu Butuhkan
              <span className="block font-serif italic font-normal text-white/80">
                dalam Satu Tempat
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              evhub.id menyediakan tools lengkap untuk membantu kamu 
              mengoptimalkan pengalaman memiliki kendaraan listrik di Indonesia.
            </p>
          </div>

          {/* Capability Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              const isLive = cap.status === 'live';
              
              return (
                <Link
                  key={cap.id}
                  to={cap.href}
                  className={`cap-card group relative bg-forest-mid/50 rounded-2xl border border-white/10 overflow-hidden transition-all hover:border-[#FFC300]/50 hover:shadow-2xl hover:shadow-[#FFC300]/10 ${
                    isLive ? '' : 'opacity-80'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cap.image}
                      alt={cap.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-mid via-forest-mid/50 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      isLive 
                        ? 'bg-[#27AE60] text-white' 
                        : 'bg-white/20 backdrop-blur-md text-white'
                    }`}>
                      {cap.statusText}
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-[#FFC300] rounded-xl flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6 text-forest-dark" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-sans font-bold text-white mb-3 group-hover:text-[#FFC300] transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {cap.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cap.features.map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className={`flex items-center gap-2 text-sm font-semibold ${
                      isLive ? 'text-[#FFC300]' : 'text-white/50'
                    }`}>
                      {isLive ? 'Coba Sekarang' : 'Lihat Detail'}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 md:py-32 bg-forest-mid/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <p className="text-[#FFC300] text-sm font-body uppercase tracking-widest mb-4">
                Mengapa evhub.id
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white mb-6">
                Platform
                <span className="font-serif italic font-normal text-white/80"> Terpercaya</span>
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                evhub.id dibangun oleh tim yang memahami tantangan nyata pemilik 
                kendaraan listrik di Indonesia. Setiap fitur dirancang untuk menjawab 
                pertanyaan: "Apakah saya bisa sampai?" dan "Bagaimana cara charging lebih pintar?"
              </p>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle2, text: 'Data 73+ model EV dengan spesifikasi akurat' },
                  { icon: CheckCircle2, text: 'Tarif PLN real-time (R1, R2, R3, Umum)' },
                  { icon: CheckCircle2, text: 'Dirancang khusus untuk kondisi Indonesia' },
                  { icon: CheckCircle2, text: 'Gratis digunakan tanpa registrasi' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#FFC300] flex-shrink-0" />
                    <span className="text-white/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/grid-1.jpg"
                alt="EV Charging Station"
                className="rounded-2xl w-full h-48 object-cover"
              />
              <img
                src="/grid-2.jpg"
                alt="EV Charging Port"
                className="rounded-2xl w-full h-48 object-cover mt-8"
              />
              <img
                src="/grid-3.jpg"
                alt="EV on Highway"
                className="rounded-2xl w-full h-48 object-cover -mt-8"
              />
              <img
                src="/grid-5.jpg"
                alt="Charging Network"
                className="rounded-2xl w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <p className="text-[#FFC300] text-sm font-body uppercase tracking-widest mb-4">
              Pertanyaan Umum
            </p>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-white">
              Yang Sering
              <span className="font-serif italic font-normal text-white/80"> Ditanyakan</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqConfig.faqs.map((faq) => (
              <details
                key={faq.id}
                className="group bg-forest-mid/50 rounded-xl border border-white/10 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="text-white font-semibold pr-4">{faq.question}</span>
                  <ChevronRight className="w-5 h-5 text-[#FFC300] transition-transform group-open:rotate-90 flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-white/60 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-forest-mid/30 to-forest-dark">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white mb-6">
            Siap Mengoptimalkan
            <span className="block text-[#FFC300]">Pengalaman EV Kamu?</span>
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Mulai dengan kalkulator charging kami dan lihat berapa banyak 
            yang bisa kamu hemat dengan beralih ke kendaraan listrik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kalkulator"
              className="inline-flex items-center justify-center gap-2 bg-[#FFC300] hover:bg-[#FFD60A] text-forest-dark font-sans font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Coba Kalkulator Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FFC300] rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-forest-dark" />
                </div>
                <span className="text-white font-sans font-bold text-xl">
                  evhub<span className="text-[#FFC300]">.id</span>
                </span>
              </Link>
              <p className="text-white/50 max-w-sm mb-6">
                Platform lengkap untuk pemilik kendaraan listrik di Indonesia. 
                Kalkulator, peta SPKLU, trip planner, dan komunitas dalam satu tempat.
              </p>
              <div className="flex gap-4">
                {footerConfig.socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-[#FFC300] rounded-lg flex items-center justify-center text-white hover:text-forest-dark transition-all"
                  >
                    <span className="text-sm font-semibold">{social.label[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-semibold mb-4">Navigasi</h4>
              <ul className="space-y-2">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-white/50 hover:text-[#FFC300] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-white/50">
                <li>{footerConfig.email}</li>
                <li>{footerConfig.locationText}</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">{footerConfig.copyright}</p>
            <div className="flex gap-6">
              {footerConfig.bottomLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-white/30 hover:text-white/60 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
