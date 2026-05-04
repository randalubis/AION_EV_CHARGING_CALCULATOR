import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ExternalLink } from 'lucide-react';

export interface MapsTarget {
  label: string;
  href: string;
}

interface MapsPickerProps {
  trigger: React.ReactNode;
  targets: MapsTarget[];
  align?: 'start' | 'center' | 'end';
}

/**
 * Small popover that lets the user pick which maps app to open in.
 * Shared between station-detail "Navigasi" and the calculator "Cari SPKLU".
 */
export function MapsPicker({ trigger, targets, align = 'end' }: MapsPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align={align}
          sideOffset={6}
          className="z-[10000] bg-forest-dark border border-white/10 rounded-lg shadow-2xl p-1 min-w-[200px]"
        >
          {targets.map((t) => (
            <a
              key={t.label}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              <span>{t.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/30" />
            </a>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** Direct-navigate URLs for a specific destination. */
export function navigateTargets(lat: number, lng: number, name: string): MapsTarget[] {
  const q = encodeURIComponent(name);
  return [
    { label: 'Google Maps', href: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${q}` },
    { label: 'Waze', href: `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes` },
    { label: 'Apple Maps', href: `https://maps.apple.com/?daddr=${lat},${lng}&q=${q}` },
  ];
}

/** Search-nearby URLs for a free-text query. Each app handles "near me" via the user's current device location. */
export function searchTargets(query: string): MapsTarget[] {
  const q = encodeURIComponent(query);
  return [
    { label: 'Google Maps', href: `https://www.google.com/maps/search/?api=1&query=${q}` },
    { label: 'Waze', href: `https://www.waze.com/ul?q=${q}` },
    { label: 'Apple Maps', href: `https://maps.apple.com/?q=${q}` },
  ];
}
