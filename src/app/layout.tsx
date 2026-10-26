import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ContentService } from '@/services/content.service';
import { Providers } from '@/providers';
import './globals.css';

// Self-hosted variable fonts (no build-time call to Google Fonts).
const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-inter',
  display: 'swap',
});
const playfair = localFont({
  src: '../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2',
  weight: '400 900',
  variable: '--font-playfair',
  display: 'swap',
});
const robotoMono = localFont({
  src: [{ path: '../../public/fonts/RobotoMono-Regular.ttf', weight: '400', style: 'normal' }],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { systemSettings: s } = await ContentService.getContent();
  const image = (url: string, alt?: string) => (url ? [{ url, alt }] : undefined);

  return {
    title: { template: `%s | ${s.siteName}`, default: `${s.siteName} — ${s.siteSlogan}` },
    description: s.siteDescription,
    metadataBase: new URL(s.siteUrl || 'http://localhost:3000'),
    keywords: s.siteKeywords,
    authors: [{ name: s.siteAuthor }],
    icons: s.siteIcon ? { icon: s.siteIcon } : undefined,
    openGraph: {
      title: s.ogTitle,
      description: s.ogDescription,
      url: s.siteUrl,
      siteName: s.siteName,
      images: image(s.ogImage, s.ogImageAlt),
      locale: s.siteLocale,
      type: s.siteType as 'website',
    },
    twitter: {
      card: s.twitterCard as 'summary_large_image',
      title: s.twitterTitle,
      description: s.twitterDescription,
      site: s.twitterSite,
      creator: s.twitterCreator,
      images: s.twitterImage ? [s.twitterImage] : undefined,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
