import { useMemo } from 'react';
import { Users } from 'lucide-react';
import { BRANDS } from '../../calculator/data/carData';
import { INTEREST_LABELS, INTEREST_ORDER, REGION_LABELS, REGION_ORDER } from '../data/categories';
import type { Community, CommunityInterest, CommunityRegion } from '../types';
import { CommunityCard } from './CommunityCard';

interface GroupsProps {
  communities: Community[];
}

/**
 * Pick the most-specific interest tag for grouping in the Per Minat tab.
 * `general` is treated as a fallback — communities with both `general` and
 * a more specific tag (e.g. `chinese`, `women`, `roadtrip`) are grouped under
 * the specific one. This keeps each card in exactly one section per tab.
 */
function primaryInterest(interests: Community['interests']): Community['interests'][number] | null {
  if (interests.length === 0) return null;
  const specific = interests.find((i) => i !== 'general');
  return specific ?? interests[0];
}

/** Empty state for any of the three tabs. */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 px-6 bg-forest-mid/30 border border-white/10 rounded-xl">
      <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
      <p className="text-white/60">{message}</p>
      <p className="text-white/40 text-sm mt-1">
        Tahu komunitas yang harus masuk daftar?{' '}
        <a
          href="mailto:hello@evhub.id?subject=Usulan%20komunitas%20EV"
          className="text-volt hover:underline"
        >
          Kirim usulan
        </a>
        .
      </p>
    </div>
  );
}

/**
 * Renders the per-brand view: one section per calculator brand that has at
 * least one community. Each community is placed in exactly one section
 * (its primary brand = `brands[0]`); cards spanning multiple brands keep
 * their other brands as visible badges on the card itself.
 */
export function CommunitiesByBrand({ communities }: GroupsProps) {
  const byBrand = useMemo(() => {
    const map = new Map<string, Community[]>();
    for (const c of communities) {
      const primary = c.brands[0];
      if (!primary) continue;
      const arr = map.get(primary);
      if (arr) arr.push(c);
      else map.set(primary, [c]);
    }
    return map;
  }, [communities]);

  // Brand-agnostic communities (empty `brands`) get their own bucket at the bottom.
  const crossBrand = useMemo(() => communities.filter((c) => c.brands.length === 0), [communities]);

  if (communities.length === 0) {
    return <EmptyState message="Belum ada komunitas terdaftar." />;
  }

  // Iterate brands in the order they appear in the calculator's BRANDS list
  // so the page stays consistent with /kalkulator.
  const brandSections = BRANDS.filter((b) => byBrand.has(b.id));

  return (
    <div className="space-y-10">
      {brandSections.map((brand) => {
        const items = byBrand.get(brand.id)!;
        return (
          <section key={brand.id}>
            <header className="flex items-center gap-3 mb-4">
              <img
                src={`/brands/${brand.id}.svg`}
                alt=""
                aria-hidden
                className="w-7 h-7 rounded-md bg-white/95 p-0.5 object-contain flex-shrink-0"
              />
              <h2 className="text-white font-semibold text-lg">{brand.name}</h2>
              <span className="text-white/40 text-xs">
                {items.length} komunitas
              </span>
            </header>
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((c) => (
                <CommunityCard key={c.id} community={c} />
              ))}
            </div>
          </section>
        );
      })}

      {crossBrand.length > 0 && (
        <section>
          <header className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-md bg-volt/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-volt" />
            </div>
            <h2 className="text-white font-semibold text-lg">Lintas Merek</h2>
            <span className="text-white/40 text-xs">{crossBrand.length} komunitas</span>
          </header>
          <div className="grid sm:grid-cols-2 gap-4">
            {crossBrand.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** Renders the per-region view. */
export function CommunitiesByRegion({ communities }: GroupsProps) {
  const byRegion = useMemo(() => {
    const map = new Map<CommunityRegion, Community[]>();
    for (const c of communities) {
      const arr = map.get(c.region);
      if (arr) arr.push(c);
      else map.set(c.region, [c]);
    }
    return map;
  }, [communities]);

  if (communities.length === 0) {
    return <EmptyState message="Belum ada komunitas terdaftar." />;
  }

  const regionSections = REGION_ORDER.filter((r) => byRegion.has(r));

  return (
    <div className="space-y-10">
      {regionSections.map((region) => {
        const items = byRegion.get(region)!;
        return (
          <section key={region}>
            <header className="flex items-baseline gap-3 mb-4">
              <h2 className="text-white font-semibold text-lg">{REGION_LABELS[region]}</h2>
              <span className="text-white/40 text-xs">{items.length} komunitas</span>
            </header>
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((c) => (
                <CommunityCard key={c.id} community={c} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/**
 * Renders the per-interest view. Each community is placed in exactly one
 * interest section, chosen via `primaryInterest()` so a card with both
 * `general` and `chinese` lands under "EV Cina" (not duplicated). The
 * other tags stay visible as chips on the card.
 */
export function CommunitiesByInterest({ communities }: GroupsProps) {
  const byInterest = useMemo(() => {
    const map = new Map<CommunityInterest, Community[]>();
    for (const c of communities) {
      const tag = primaryInterest(c.interests);
      if (!tag) continue;
      const arr = map.get(tag);
      if (arr) arr.push(c);
      else map.set(tag, [c]);
    }
    return map;
  }, [communities]);

  if (communities.length === 0) {
    return <EmptyState message="Belum ada komunitas terdaftar." />;
  }

  const interestSections = INTEREST_ORDER.filter((i) => byInterest.has(i));

  return (
    <div className="space-y-10">
      {interestSections.map((interest) => {
        const items = byInterest.get(interest)!;
        return (
          <section key={interest}>
            <header className="flex items-baseline gap-3 mb-4">
              <h2 className="text-white font-semibold text-lg">{INTEREST_LABELS[interest]}</h2>
              <span className="text-white/40 text-xs">{items.length} komunitas</span>
            </header>
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((c) => (
                <CommunityCard key={c.id} community={c} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
