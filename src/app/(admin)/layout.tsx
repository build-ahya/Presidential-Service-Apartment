import type { Metadata } from 'next';
import { AdminSessionProvider } from '@/components/admin/session-provider';

export const metadata: Metadata = {
  title: { template: '%s | Admin', default: 'Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminSessionProvider>{children}</AdminSessionProvider>;
}
