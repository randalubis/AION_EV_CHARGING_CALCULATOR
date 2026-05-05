import { ExternalLink, Facebook, FileText, Globe, MapPin, Users } from 'lucide-react';
import { BRANDS } from '../../calculator/data/carData';
import { accentColorFor } from '../data/brandColors';
import { INTEREST_LABELS, REGION_LABELS } from '../data/categories';
import type { Community } from '../types';

interface CommunityCardProps {
  community: Community;
}

const PLATFORM_META: Record<
  Community['platform'],
  { label: string; icon: typeof Facebook; cta: string }
> = {
  facebook: { label: 'Facebook Group', icon: Facebook, cta: 'Buka Grup' },
  google_form: { label: 'Google Form', icon: FileText, cta: 'Daftar' },
  website: { label: 'Website', icon: Globe, cta: 'Buka Website' },
};

export function CommunityCard({ community }: CommunityCardProps) {
  const platform = PLATFORM_META[community.platform];
  const PlatformIcon = platform.icon;
  const accent = accentColorFor(community.brands, community.id);
  const brandNames = community.brands
    .map((id) => BRANDS.find((b) => b.id === id)?.short ?? id)
    .filter(Boolean);
  const reportSubject = encodeURIComponent(`Lapor link rusak: ${community.name}`);
  const reportBody = encodeURIComponent(
    `Hai admin evhub.id,\n\nLink komunitas berikut tidak bisa dibuka:\n\nNama: ${community.name}\nID: ${community.id}\nLink: ${community.url}\n\nTerima kasih!`,
  );

  return (
    <article className="bg-forest-mid/40 border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-white/20 transition-colors">
      {/* Decorative cover — accent gradient + watermarked platform icon */}
      <div
        aria-hidden
        className="relative h-16 sm:h-20 flex items-center justify-end px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${accent}66 50%, transparent 100%)`,
        }}
      >
        <PlatformIcon
          className="absolute -right-2 -bottom-3 w-20 h-20 text-white/15"
          strokeWidth={1.5}
        />
        {typeof community.memberCount === 'number' && (
          <span className="relative bg-black/40 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Users className="w-3 h-3" />
            {community.memberCount.toLocaleString('id-ID')}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold leading-snug">{community.name}</h3>
          <span className="flex items-center gap-1.5 text-white/50 text-xs flex-shrink-0">
            <PlatformIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{platform.label}</span>
          </span>
        </div>

        <p className="text-white/60 text-sm leading-relaxed">{community.description}</p>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {community.region !== 'national' && (
            <span className="inline-flex items-center gap-1 bg-white/5 text-white/60 px-2 py-0.5 rounded">
              <MapPin className="w-3 h-3" />
              {REGION_LABELS[community.region]}
            </span>
          )}
          {brandNames.slice(0, 3).map((label, i) => (
            <span key={i} className="bg-[#FFC300]/10 text-[#FFC300] px-2 py-0.5 rounded">
              {label}
            </span>
          ))}
          {brandNames.length > 3 && (
            <span className="bg-white/5 text-white/40 px-2 py-0.5 rounded">+{brandNames.length - 3}</span>
          )}
          {community.interests.map((tag) => (
            <span key={tag} className="bg-white/5 text-white/40 px-2 py-0.5 rounded">
              {INTEREST_LABELS[tag]}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between gap-3 mt-auto pt-2">
          <div className="text-[11px] text-white/40 leading-relaxed">
            {community.lastVerifiedAt && (
              <span className="block">Diperbarui {community.lastVerifiedAt}</span>
            )}
            <a
              href={`mailto:hello@evhub.id?subject=${reportSubject}&body=${reportBody}`}
              className="block text-white/40 hover:text-white/70 underline-offset-2 hover:underline mt-0.5"
            >
              Lapor link rusak
            </a>
          </div>
          <a
            href={community.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#FFC300] text-forest-dark text-sm font-semibold px-3 py-2 rounded-lg hover:bg-[#FFD60A] transition-colors flex-shrink-0"
          >
            {platform.cta}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
