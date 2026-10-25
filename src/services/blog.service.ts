import 'server-only';
import { collections } from '@/lib/firebase-admin';
import { bust, cached, TAGS } from '@/lib/cache';
import { slugify } from '@/lib/api';
import type { Post, PostCategory } from '@/models/post';

const readAll = async (): Promise<Post[]> => {
  const snap = await collections.blog().get();
  return snap.docs.map((d) => ({ ...(d.data() as Post), id: d.id }));
};

const cachedAll = cached(readAll, 'blog-posts', TAGS.blog);

const isPublic = (p: Post) => p.status === 'published' && p.visibility !== 'private';

const byDate = (a: Post, b: Post) =>
  (b.publishedAt || b.createdAt || '').localeCompare(a.publishedAt || a.createdAt || '');

const stripPrivate = (p: Post): Post => ({ ...p, password: undefined });

export class BlogService {
  static async listPublished(
    params: { page?: number; limit?: number; q?: string; categoryId?: string } = {}
  ) {
    const { page = 1, limit = 9, q, categoryId } = params;
    let posts = (await cachedAll()).filter(isPublic).sort(byDate);
    if (categoryId) posts = posts.filter((p) => p.category?.id === categoryId);
    if (q) {
      const term = q.toLowerCase();
      posts = posts.filter((p) =>
        [p.title, p.excerpt, p.subtitle].some((v) => v?.toLowerCase().includes(term))
      );
    }
    const total = posts.length;
    return {
      posts: posts.slice((page - 1) * limit, page * limit).map(stripPrivate),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), hasMore: page * limit < total },
    };
  }

  static async getPublishedBySlug(slug: string) {
    const post = (await cachedAll()).find((p) => p.slug === slug && isPublic(p));
    return post ? stripPrivate(post) : null;
  }

  static async related(post: Post, limit = 3) {
    return (await cachedAll())
      .filter(isPublic)
      .filter((p) => p.id !== post.id)
      .filter(
        (p) =>
          (p.category?.id && p.category.id === post.category?.id) ||
          (p.tags || []).some((t) => (post.tags || []).some((c) => c.name === t.name))
      )
      .sort(byDate)
      .slice(0, limit)
      .map(stripPrivate);
  }

  // ---- admin ---------------------------------------------------------------

  static async listAll() {
    return (await readAll()).sort(byDate);
  }

  static async getById(id: string) {
    const snap = await collections.blog().doc(id).get();
    return snap.exists ? ({ ...(snap.data() as Post), id: snap.id }) : null;
  }

  static async create(input: Partial<Post> & { title: string; content: string }, authorName: string, authorId: string) {
    const slug = slugify(input.slug || input.title);
    const clash = await collections.blog().where('slug', '==', slug).limit(1).get();
    if (!clash.empty) throw new Error('A post with this slug already exists');

    const now = new Date().toISOString();
    const ref = collections.blog().doc();
    const status = input.status || 'draft';
    const post: Post = {
      id: ref.id,
      title: input.title,
      slug,
      subtitle: input.subtitle || '',
      content: input.content,
      excerpt: input.excerpt || input.content.replace(/<[^>]+>/g, ' ').trim().slice(0, 200),
      author: input.author || { id: authorId, name: authorName },
      category: input.category || { id: 'general', name: 'General', slug: 'general' },
      tags: input.tags || [],
      featuredMedia:
        input.featuredMedia || { url: '', type: 'image', alt: input.title, width: 0, height: 0 },
      gallery: input.gallery || [],
      status,
      visibility: input.visibility || 'public',
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'published' ? now : '',
      meta: input.meta || { title: input.title, description: input.excerpt || '', keywords: [] },
      stats: {
        views: 0,
        likes: 0,
        shares: 0,
        readingTime: Math.max(1, Math.ceil(input.content.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200)),
        commentCount: 0,
      },
      isFeatured: !!input.isFeatured,
      isPromoted: !!input.isPromoted,
      isPremium: false,
      allowComments: false,
      version: 1,
      lastModifiedBy: authorName,
    };
    await ref.set(post);
    bust(TAGS.blog);
    return post;
  }

  static async update(id: string, patch: Partial<Post>, editor: string) {
    const existing = await this.getById(id);
    if (!existing) return null;
    if (patch.slug) {
      patch.slug = slugify(patch.slug);
      const clash = await collections.blog().where('slug', '==', patch.slug).get();
      if (clash.docs.some((d) => d.id !== id)) throw new Error('A post with this slug already exists');
    }
    const { id: _id, createdAt: _c, stats: _s, ...safe } = patch;
    const next: Partial<Post> = {
      ...safe,
      updatedAt: new Date().toISOString(),
      version: (existing.version || 1) + 1,
      lastModifiedBy: editor,
    };
    if (safe.status === 'published' && !existing.publishedAt) next.publishedAt = new Date().toISOString();
    await collections.blog().doc(id).update(next);
    bust(TAGS.blog);
    return this.getById(id);
  }

  static async delete(id: string) {
    await collections.blog().doc(id).delete();
    bust(TAGS.blog);
  }

  static async categories(): Promise<PostCategory[]> {
    const snap = await collections.blogCategories().get();
    return snap.docs.map((d) => ({ ...(d.data() as PostCategory), id: d.id }));
  }

  static async createCategory(name: string, description = '') {
    const slug = slugify(name);
    const clash = await collections.blogCategories().where('slug', '==', slug).limit(1).get();
    if (!clash.empty) throw new Error('A category with this name already exists');
    const ref = collections.blogCategories().doc();
    const category: PostCategory = { id: ref.id, name: name.trim(), slug, description };
    await ref.set(category);
    return category;
  }
}
