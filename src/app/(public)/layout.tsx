import type { Viewport } from 'next';
import PublicLayout from '@/components/layouts/public-layout';
import { SiteProvider } from '@/providers/site-provider';
import { CatalogService } from '@/services/catalog.service';
import { ContentService } from '@/services/content.service';

export const viewport: Viewport = {
  themeColor: '#0f3a6b',
};

async function loadCatalog() {
  try {
    return await Promise.all([CatalogService.getProperties(), CatalogService.getApartments()]);
  } catch (error) {
    console.error('Failed to load catalog:', error);
    return [[], []] as const;
  }
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [content, [properties, apartments]] = await Promise.all([
    ContentService.getContent(),
    loadCatalog(),
  ]);

  return (
    <SiteProvider value={{ content, properties: [...properties], apartments: [...apartments] }}>
      <PublicLayout>{children}</PublicLayout>
    </SiteProvider>
  );
}
