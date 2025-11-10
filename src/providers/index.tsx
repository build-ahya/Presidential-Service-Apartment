'use client';

import { ReduxProvider } from './redux-provider';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute='class' disableTransitionOnChange>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
