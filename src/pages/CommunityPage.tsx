import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowLeft, HelpCircle, MessageSquare, Sparkles, Users } from 'lucide-react';
import { COMMUNITIES } from '../features/community/data/communities';
import { AboutDialog } from '../features/community/components/AboutDialog';
import {
  CommunitiesByBrand,
  CommunitiesByInterest,
  CommunitiesByRegion,
} from '../features/community/components/CommunityGroups';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type TabKey = 'brand' | 'region' | 'interest';

const TAB_LABELS: Record<TabKey, string> = {
  brand: 'Per Merek',
  region: 'Per Wilayah',
  interest: 'Per Minat',
};

export default function CommunityPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [tab, setTab] = useState<TabKey>('brand');

  useEffect(() => {
    document.title = 'Komunitas EV Indonesia | evhub.id';
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const els = containerRef.current?.querySelectorAll('.animate-in');
      if (els && els.length > 0) {
        gsap.fromTo(
          els,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
        );
      }
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-carbon-950">
      {/* Compact header */}
      <div className="pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="animate-in flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link to="/" className="hover:text-volt transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-volt">Komunitas</span>
          </div>

          <div className="animate-in flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-volt/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-volt" />
              </div>
              <div className="min-w-0">
                <h1 className="text-white font-bold text-xl md:text-2xl leading-tight">
                  Komunitas EV Indonesia
                </h1>
                <p className="text-white/50 text-xs md:text-sm">
                  Direktori grup pemilik EV — per merek, wilayah, dan minat
                </p>
              </div>
            </div>
            <AboutDialog
              trigger={
                <button className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-colors flex-shrink-0">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Tentang</span>
                </button>
              }
            />
          </div>

          <p className="animate-in text-white/40 text-xs mt-4 italic max-w-2xl">
            evhub.id bukan pengurus komunitas di bawah — kami hanya kurator daftar.
            Setiap kartu membuka link asli ke Facebook atau formulir pendaftaran.
          </p>
        </div>
      </div>

      {/* Decorative banner */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-6">
        <div
          className="animate-in relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8"
          style={{
            background:
              'radial-gradient(120% 100% at 0% 0%, rgba(198, 255, 77, 0.18) 0%, transparent 60%), radial-gradient(120% 100% at 100% 100%, rgba(39, 174, 96, 0.14) 0%, transparent 60%), #161C17',
          }}
        >
          {/* Soft decorative icons in the background */}
          <Users
            aria-hidden
            className="absolute -right-6 -top-6 w-40 h-40 sm:w-48 sm:h-48 text-volt/10"
            strokeWidth={1.25}
          />
          <MessageSquare
            aria-hidden
            className="absolute -right-20 -bottom-12 w-44 h-44 text-[#27AE60]/10 hidden sm:block"
            strokeWidth={1.25}
          />

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-volt/10 border border-volt/30 rounded-full px-3 py-1 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-volt" />
              <span className="text-volt text-xs font-medium">Direktori Komunitas</span>
            </div>
            <h2 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-2">
              Cari komunitasmu — per merek, wilayah, atau minat.
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              Punya mobil baru dan belum tahu mau gabung grup mana? Jelajahi tab di bawah dan
              langsung buka link ke Facebook group atau formulir pendaftaran komunitas.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <Tabs.Root
          value={tab}
          onValueChange={(v) => setTab(v as TabKey)}
          className="animate-in"
        >
          <Tabs.List
            aria-label="Pilih cara menelusuri komunitas"
            className="inline-flex p-1 bg-carbon-900/40 border border-white/10 rounded-lg gap-1 mb-8"
          >
            {(Object.keys(TAB_LABELS) as TabKey[]).map((k) => (
              <Tabs.Trigger
                key={k}
                value={k}
                className="px-3 sm:px-4 py-2 text-sm rounded-md text-white/60 hover:text-white data-[state=active]:bg-volt data-[state=active]:text-carbon-950 data-[state=active]:font-semibold transition-colors"
              >
                {TAB_LABELS[k]}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="brand" className="focus-visible:outline-none">
            <CommunitiesByBrand communities={COMMUNITIES} />
          </Tabs.Content>
          <Tabs.Content value="region" className="focus-visible:outline-none">
            <CommunitiesByRegion communities={COMMUNITIES} />
          </Tabs.Content>
          <Tabs.Content value="interest" className="focus-visible:outline-none">
            <CommunitiesByInterest communities={COMMUNITIES} />
          </Tabs.Content>
        </Tabs.Root>

        {/* Submit CTA — anchors the bottom of the page */}
        <div className="animate-in mt-16 bg-gradient-to-r from-volt/10 to-transparent border border-volt/30 rounded-2xl p-6 text-center">
          <h3 className="text-white font-semibold text-lg mb-2">
            Komunitas yang kamu ikut belum terdaftar?
          </h3>
          <p className="text-white/60 text-sm mb-4 max-w-xl mx-auto">
            Kirim usulan ke{' '}
            <a href="mailto:hello@evhub.id?subject=Usulan%20komunitas%20EV" className="text-volt hover:underline">
              hello@evhub.id
            </a>{' '}
            dengan nama komunitas, link grup atau formulir, dan info brand / wilayah / minat. Kami
            akan verifikasi dan tambahkan ke daftar.
          </p>
        </div>
      </div>

      {/* Back to Home */}
      <div className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-volt transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
