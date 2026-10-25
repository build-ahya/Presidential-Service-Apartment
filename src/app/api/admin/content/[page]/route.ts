import { z } from 'zod';
import { handler, requireStaff, badRequest } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { CONTENT_SCHEMA } from '@/content/schema';
import { ContentService } from '@/services/content.service';
import type { PageContent } from '@/models/content';

const sectionSchema = z.object({
  title: z.string().default(''),
  subtitle: z.string().optional(),
  overline: z.string().optional(),
  body: z.string().default(''),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  video: z.string().optional(),
  videos: z.array(z.string()).optional(),
  background: z.string().optional(),
  button: z.any().optional(),
  buttons: z
    .array(z.object({ title: z.string(), href: z.string(), icon: z.string().optional(), target: z.string().optional() }))
    .optional(),
  items: z
    .array(
      z.object({
        title: z.string().default(''),
        subtitle: z.string().optional(),
        body: z.string().default(''),
        icon: z.string().optional(),
        image: z.string().optional(),
        href: z.string().optional(),
      })
    )
    .optional(),
});

export const PUT = handler(async (request: Request, { params }: { params: Promise<{ page: string }> }) => {
  await requireStaff();
  const { page } = await params;
  if (!CONTENT_SCHEMA.some((p) => p.key === page)) throw badRequest('Unknown page');
  const sections = await parseBody(request, z.record(z.string(), sectionSchema));
  await ContentService.updatePage(page, sections as PageContent);
  return json({ saved: true });
});
