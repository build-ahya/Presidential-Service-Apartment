import 'server-only';
import { revalidateTag, unstable_cache } from 'next/cache';

export const TAGS = {
  content: 'content',
  catalog: 'catalog',
  blog: 'blog',
} as const;

/** Memoise a Firestore read until one of its tags is busted by an admin save. */
export function cached<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  key: string,
  tag: string
) {
  return unstable_cache(fn, [key], { tags: [tag], revalidate: 3600 });
}

export function bust(...tags: string[]) {
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
}
