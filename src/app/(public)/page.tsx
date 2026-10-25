import HomePage from '@/components/home/home-page';
import { BlogService } from '@/services/blog.service';
import { CatalogService } from '@/services/catalog.service';
import { ContentService } from '@/services/content.service';

export default async function Home() {
  const [content, properties, apartments, blog] = await Promise.all([
    ContentService.getContent(),
    CatalogService.getProperties(),
    CatalogService.getApartments(),
    BlogService.listPublished({ limit: 3 }).catch(() => ({ posts: [] })),
  ]);

  return (
    <HomePage
      content={content.siteContent.home}
      apartments={apartments}
      properties={properties}
      posts={blog.posts}
    />
  );
}
