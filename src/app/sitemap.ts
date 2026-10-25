import type { MetadataRoute } from 'next';
import { BlogService } from '@/services/blog.service';
import { CatalogService } from '@/services/catalog.service';
import { ContentService } from '@/services/content.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { systemSettings } = await ContentService.getContent();
  const baseUrl = systemSettings.siteUrl.replace(/\/$/, '');

  const [apartments, blog] = await Promise.all([
    CatalogService.getApartments().catch(() => []),
    BlogService.listPublished({ limit: 500 }).catch(() => ({ posts: [] })),
  ]);

  const staticPages: MetadataRoute.Sitemap = ([
    { url: baseUrl, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/apartments`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly' as const, priority: 0.6 },
  ]).map((p) => ({ ...p, lastModified: new Date() }));

  return [
    ...staticPages,
    ...apartments.map((a) => ({
      url: `${baseUrl}/apartments/${a.slug}`,
      lastModified: new Date(a.updatedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...blog.posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
