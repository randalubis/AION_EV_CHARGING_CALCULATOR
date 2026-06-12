import { ExternalLink, Facebook, FileText, Globe, MapPin, Users } from 'lucide-react';
import { BRANDS } from '../../calculator/data/carData';
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
  const primaryBrandId = community.brands[0] ?? null;
  const brandNames = community.brands
    .map((id) => BRANDS.find((b) => b.id === id)?.short ?? id)
    .filter(Boolean);
  const reportSubject = encodeURIComponent(`Lapor link rusak: ${community.name}`);
  const reportBody = encodeURIComponent(
    `Hai admin evhub.id,\n\nLink komunitas berikut tidak bisa dibuka:\n\nNama: ${community.name}\nID: ${community.id}\nLink: ${community.url}\n\nTerima kasih!`,
  );

  return (
    <article className="bg-forest-mid/40 border border-white/10 rounded-xl p-4 sm:p-5 flex gap-4 hover:border-white/20 transition-colors">
      {/* Identity badge — brand logo if available, generic Users icon otherwise */}
      <div className="flex-shrink-0">
        {primaryBrandId ? (
          <img
            src={`/brands/${primaryBrandId}.svg`}
            alt=""
            aria-hidden
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/95 p-1.5 object-contain shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-volt" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold leading-snug truncate">{community.name}</h3>
          <PlatformIcon
            className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5"
            aria-label={platform.label}
          />
        </div>

        <p className="text-white/60 text-sm leading-relaxed line-clamp-2">{community.description}</p>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {community.region !== 'national' && (
            <span className="inline-flex items-center gap-1 bg-white/5 text-white/60 px-2 py-0.5 rounded">
              <MapPin className="w-3 h-3" />
              {REGION_LABELS[community.region]}
            </span>
          )}
          {brandNames.slice(0, 2).map((label, i) => (
            <span key={i} className="bg-volt/10 text-volt px-2 py-0.5 rounded">
              {label}
            </span>
          ))}
          {brandNames.length > 2 && (
            <span className="bg-white/5 text-white/40 px-2 py-0.5 rounded">+{brandNames.length - 2}</span>
          )}
          {community.interests.slice(0, 2).map((tag) => (
            <span key={tag} className="bg-white/5 text-white/40 px-2 py-0.5 rounded">
              {INTEREST_LABELS[tag]}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 mt-1 pt-2 border-t border-white/5">
          <div className="text-[11px] text-white/40 flex items-center gap-2 flex-wrap">
            {typeof community.memberCount === 'number' && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {community.memberCount.toLocaleString('id-ID')}
              </span>
            )}
            {typeof community.memberCount === 'number' && community.lastVerifiedAt && (
              <span aria-hidden>·</span>
            )}
            {community.lastVerifiedAt && <span>{community.lastVerifiedAt}</span>}
            <a
              href={`mailto:hello@evhub.id?subject=${reportSubject}&body=${reportBody}`}
              className="text-white/30 hover:text-white/60 underline-offset-2 hover:underline"
            >
              · Lapor
            </a>
          </div>
          <a
            href={community.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-volt text-forest-dark text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-volt-bright transition-colors flex-shrink-0"
          >
            {platform.cta}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
