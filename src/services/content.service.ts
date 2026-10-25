import 'server-only';
import { collections } from '@/lib/firebase-admin';
import { bust, cached, TAGS } from '@/lib/cache';
import defaults from '@/content/defaults';
import type { Content, PageContent, SiteContent } from '@/models/content';
import type { SystemSettings } from '@/models/settings';

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** Saved values win; anything missing falls back to the defaults. Arrays are replaced, not merged. */
function merge<T>(base: T, saved: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(saved)) {
    return (saved === undefined || saved === null ? base : saved) as T;
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(saved)) {
    out[key] = merge((base as Record<string, unknown>)[key], saved[key]);
  }
  return out as T;
}

async function readRaw() {
  const [siteSnap, settingsSnap] = await Promise.all([
    collections.content().doc('siteContent').get(),
    collections.content().doc('systemSettings').get(),
  ]);
  return {
    siteContent: (siteSnap.data() ?? {}) as SiteContent,
    systemSettings: (settingsSnap.data() ?? {}) as Partial<SystemSettings>,
  };
}

async function readContent(): Promise<Content> {
  try {
    const raw = await readRaw();
    return {
      siteContent: merge(defaults.siteContent, raw.siteContent),
      systemSettings: merge(defaults.systemSettings, raw.systemSettings),
    };
  } catch (error) {
    console.error('Error fetching content, using defaults:', error);
    return defaults;
  }
}

const cachedContent = cached(readContent, 'content', TAGS.content);

export class ContentService {
  /** Site content with defaults filled in (cached until the admin saves). */
  static getContent() {
    return cachedContent();
  }

  /** Uncached, merged content for the admin editors. */
  static getFreshContent() {
    return readContent();
  }

  static async updatePage(page: string, sections: PageContent) {
    const ref = collections.content().doc('siteContent');
    await ref.set({}, { merge: true });
    // update() with a field path replaces the whole page map (removed sections go away).
    await ref.update({ [page]: sections });
    bust(TAGS.content);
  }

  static async updateSystemSettings(settings: SystemSettings) {
    await collections.content().doc('systemSettings').set(settings);
    bust(TAGS.content);
  }
}
