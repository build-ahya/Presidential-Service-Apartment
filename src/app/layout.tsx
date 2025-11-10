import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ContentService } from '@/services/content.service';
import { SystemSettings } from '@/models/settings';
import { Providers } from '@/providers';
import './globals.css';

const roboto = localFont({
  src: [
    {
      path: '../../public/fonts/Roboto-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Roboto-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Roboto-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-roboto',
  display: 'swap',
});

const robotoMono = localFont({
  src: [
    {
      path: '../../public/fonts/RobotoMono-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/RobotoMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/RobotoMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export async function generateMetadata() {
  const content = await ContentService.getContent();

  if (!content) {
    return null;
  }
  const systemSettings = content.systemSettings || ({} as SystemSettings);

  return {
    title: {
      template: `%s | ${systemSettings?.siteName}`,
      default: systemSettings?.siteSlogan,
    },
    description: systemSettings?.siteDescription,
    metadataBase: new URL(systemSettings?.siteUrl || 'http://localhost:3000'),
    keywords: systemSettings?.siteKeywords,
    authors: [{ name: systemSettings?.siteAuthor }],
    openGraph: {
      title: systemSettings?.ogTitle,
      description: systemSettings?.ogDescription,
      url: systemSettings?.siteUrl,
      siteName: systemSettings?.siteName,
      images: [
        {
          url: systemSettings?.ogImage || '',
          alt: systemSettings?.ogImageAlt,
        },
      ],
      locale: systemSettings?.siteLocale,
      type: systemSettings?.siteType as any,
    },
    twitter: {
      card: systemSettings?.twitterCard as any,
      title: systemSettings?.twitterTitle,
      description: systemSettings?.twitterDescription,
      site: systemSettings?.twitterSite,
      creator: systemSettings?.twitterCreator,
      images: [systemSettings?.twitterImage || ''],
    },
  } as Metadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
