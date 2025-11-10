import type { Viewport } from 'next'

import PublicLayout from '@/components/layouts/public-layout';

export const viewport: Viewport = {
  themeColor: 'black',
}
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}