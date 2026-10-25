'use client';

import { createContext, useContext } from 'react';
import type { Content } from '@/models/content';
import type { Apartment } from '@/models/apartment';
import type { Property } from '@/models/property';

export interface SiteData {
  content: Content;
  properties: Property[];
  apartments: Apartment[];
}

const SiteContext = createContext<SiteData | null>(null);

export function SiteProvider({
  value,
  children,
}: {
  value: SiteData;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>');
  return ctx;
}

export const useSettings = () => useSite().content.systemSettings;
