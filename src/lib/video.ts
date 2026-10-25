export function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, '');
    if (host === 'youtu.be') return u.pathname.slice(1) || null;
    if (host.endsWith('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([A-Za-z0-9_-]+)/);
      if (m) return m[1];
    }
    return null;
  } catch {
    return null;
  }
}

export const youTubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
