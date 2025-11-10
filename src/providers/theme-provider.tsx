'use client';

import { useEffect } from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { fetchSiteContent } from '@/store/slices/content-slice';
import { useAppDispatch } from '@/store/hooks';
import { fetchPosts } from '@/store/slices/blog-slice';
import { fetchApartments } from '@/store/slices/apartment-slice';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const dispatch = useAppDispatch();

  // 🔹 Trigger data fetching on mount
  useEffect(() => {
    dispatch(fetchSiteContent());
    dispatch(fetchApartments())
    dispatch(fetchPosts({ page: 1, limit: 10 }));
  }, []);

  const userSettings = { theme: 'light' };

  return (
    <NextThemesProvider defaultTheme={userSettings.theme} {...props}>
      <AnimatePresence>
        <motion.div
          key='app'
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='h-screen w-screen relative z-10'
        >
          {children}
          <Sonner />
        </motion.div>
      </AnimatePresence>
    </NextThemesProvider>
  );
}
