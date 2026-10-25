import type { LightboxItem } from '@/components/ui/lightbox';
import type { Media } from '@/models/media';

export function toLightboxItems(featured?: Media, gallery: Media[] = []): LightboxItem[] {
  const all = [featured, ...gallery].filter((m): m is Media => !!m?.url);
  const seen = new Set<string>();
  return all
    .filter((m) => (seen.has(m.url) ? false : (seen.add(m.url), true)))
    .map((m) => ({ url: m.url, alt: m.alt, caption: m.caption, type: m.type }));
}
