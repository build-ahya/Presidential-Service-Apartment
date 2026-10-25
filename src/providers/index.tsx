'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

/** The public site is always light; the admin follows the user's theme. */
export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='light'
      enableSystem={false}
      forcedTheme={isAdmin ? undefined : 'light'}
      disableTransitionOnChange
    >
      {children}
      <Toaster richColors position='top-right' />
    </NextThemesProvider>
  );
}
