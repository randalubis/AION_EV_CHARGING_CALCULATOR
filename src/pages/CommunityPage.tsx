import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Users, MessageSquare, Star, Share2, ArrowLeft, Heart, ThumbsUp } from 'lucide-react';

const communityFeatures = [
  {
    icon: MessageSquare,
    title: 'Forum Diskusi',
    description: 'Bertanya dan berbagi pengalaman dengan sesama pemilik EV di Indonesia',
  },
  {
    icon: Star,
    title: 'Review SPKLU',
    description: 'Baca dan tulis review tentang stasiun charging yang pernah kamu kunjungi',
  },
  {
    icon: Share2,
    title: 'Tips & Trik',
    description: 'Pelajari tips mengoptimalkan penggunaan EV dari komunitas',
  },
  {
    icon: Heart,
    title: 'Event & Meetup',
    description: 'Ikuti event dan meetup komunitas EV di kotamu',
  },
];

export default function CommunityPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Komunitas EV | evhub.id';

    const ctx = gsap.context(() => {
      const animateElements = containerRef.current?.querySelectorAll('.animate-in');
      if (animateElements && animateElements.length > 0) {
        gsap.fromTo(
          animateElements,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-forest-dark">
      {/* Header */}
      <div className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="animate-in flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link to="/" className="hover:text-[#FFC300] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#FFC300]">Komunitas</span>
          </div>

          <div className="animate-in text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-[#FFC300]" />
              <span className="text-white/70 text-sm font-medium">Segera Hadir</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white mb-6">
              Komunitas
              <span className="text-[#FFC300]"> EV Indonesia</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Bergabung dengan komunitas pemilik EV Indonesia. Bagikan pengalaman, 
              review SPKLU, dan dapatkan tips dari sesama pengguna.
            </p>

            {/* Notify Form */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12">
              <input
                type="email"
                placeholder="Masukkan email kamu"
                className="flex-1 bg-forest-mid border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
              />
              <button className="bg-[#FFC300] hover:bg-[#FFD60A] text-forest-dark font-semibold px-6 py-3 rounded-xl transition-colors">
                Gabung Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Image */}
      <div className="animate-in relative max-w-6xl mx-auto px-6 md:px-12 mb-20">
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img
            src="/grid-4.jpg"
            alt="Community Preview"
            className="w-full h-64 md:h-96 object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-transparent to-transparent" />
          
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-forest-dark/90 backdrop-blur-md rounded-2xl px-8 py-6 border border-[#FFC300]/30 text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-sans font-bold text-white mb-2">
                COMING SOON
              </h3>
              <p className="text-white/60">
                Estimasi rilis: Q4 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-forest-mid/30">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-sans font-bold text-[#FFC300] mb-2">
                10K+
              </div>
              <div className="text-white/50 text-sm">Pengguna Terdaftar</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-sans font-bold text-[#FFC300] mb-2">
                500+
              </div>
              <div className="text-white/50 text-sm">Review SPKLU</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-sans font-bold text-[#FFC300] mb-2">
                50+
              </div>
              <div className="text-white/50 text-sm">Event per Tahun</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
              Fitur Komunitas
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Berbagai fitur yang akan membantu kamu terhubung dengan sesama 
              pemilik EV di Indonesia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="animate-in bg-forest-mid/50 rounded-xl p-6 border border-white/10 hover:border-[#FFC300]/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFC300]/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#FFC300]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sample Reviews Preview */}
      <div className="py-16 bg-forest-mid/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
              Preview Review SPKLU
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Contoh review yang akan dibagikan oleh anggota komunitas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Budi S.',
                car: 'Wuling Air EV',
                location: 'SPKLU Gandaria City',
                rating: 5,
                review: 'Charger berfungsi dengan baik, lokasi strategis, dan ada restoran di sekitar. Recommended!',
              },
              {
                name: 'Dewi K.',
                car: 'Hyundai Ioniq 5',
                location: 'SPKLU Plaza Indonesia',
                rating: 4,
                review: 'Fast charging 150kW berfungsi optimal. Hanya saja parkir agak mahal.',
              },
              {
                name: 'Ahmad W.',
                car: 'BYD Atto 3',
                location: 'SPKLU Rest Area KM 57',
                rating: 5,
                review: 'Sangat membantu untuk perjalanan ke Bandung. 4 stall DC fast charging.',
              },
            ].map((review, i) => (
              <div
                key={i}
                className="animate-in bg-forest-mid/50 rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFC300]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#FFC300] font-semibold">{review.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{review.name}</div>
                    <div className="text-white/50 text-xs">{review.car}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-4 h-4 ${
                        j < review.rating ? 'text-[#FFC300] fill-[#FFC300]' : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-white/70 text-sm mb-3">{review.review}</div>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <ThumbsUp className="w-3 h-3" />
                  <span>12 orang merasa ini membantu</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-4">
            Jadi Bagian dari Komunitas
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Daftar sekarang untuk menjadi yang pertama tahu saat komunitas kami resmi diluncurkan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan email kamu"
              className="flex-1 bg-forest-mid border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
            />
            <button className="bg-[#FFC300] hover:bg-[#FFD60A] text-forest-dark font-semibold px-6 py-3 rounded-xl transition-colors">
              Gabung Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#FFC300] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
