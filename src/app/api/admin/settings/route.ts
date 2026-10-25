import { z } from 'zod';
import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { ContentService } from '@/services/content.service';
import type { SystemSettings } from '@/models/settings';

const link = z.object({
  label: z.string(),
  href: z.string(),
  icon: z.string().optional(),
  target: z.string().optional(),
  isButton: z.boolean().optional(),
});

const settingsSchema = z.object({
  siteName: z.string().min(1),
  siteLogo: z.string().default(''),
  siteIcon: z.string().default(''),
  siteUrl: z.string().min(1),
  siteSlogan: z.string().default(''),
  siteGraphImage: z.string().default(''),
  siteKeywords: z.array(z.string()).default([]),
  siteDescription: z.string().default(''),
  siteAuthor: z.string().default(''),
  siteLocale: z.string().default('en_NG'),
  siteType: z.string().default('website'),
  ogTitle: z.string().default(''),
  ogDescription: z.string().default(''),
  ogImage: z.string().default(''),
  ogImageAlt: z.string().default(''),
  twitterCard: z.string().default('summary_large_image'),
  twitterSite: z.string().default(''),
  twitterCreator: z.string().default(''),
  twitterTitle: z.string().default(''),
  twitterDescription: z.string().default(''),
  twitterImage: z.string().default(''),
  maintenanceMode: z.boolean().default(false),
  headerLinks: z.array(link).default([]),
  footerLinks: z.array(z.object({ section: z.string(), links: z.array(link) })).default([]),
  socialLinks: z.array(link).default([]),
  contact: z.object({
    email: z.string().default(''),
    phones: z.array(z.string()).default([]),
    whatsappPhone: z.string().default(''),
    addresses: z
      .array(z.object({ country: z.string(), phone: z.string(), address: z.string() }))
      .default([]),
    map: z.string().default(''),
  }),
});

export const PUT = handler(async (request: Request) => {
  await requireStaff();
  const settings = await parseBody(request, settingsSchema);
  await ContentService.updateSystemSettings(settings as SystemSettings);
  return json({ saved: true });
});
