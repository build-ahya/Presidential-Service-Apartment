'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

/**
 * The public website is always light. The admin offers Light / Dark / System and remembers the choice
 * under its own storage key, so it can never leak into the public pages (which ignore it via forcedTheme).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <NextThemesProvider
      attribute='class'
      storageKey='psa-admin-theme'
      defaultTheme='system'
      enableSystem
      forcedTheme={isAdmin ? undefined : 'light'}
      disableTransitionOnChange
    >
      {children}
      <Toaster richColors position='top-right' />
    </NextThemesProvider>
  );
}
