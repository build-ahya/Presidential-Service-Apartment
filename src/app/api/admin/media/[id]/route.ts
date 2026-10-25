import { z } from 'zod';
import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { MediaService } from '@/services/media.service';

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  alt: z.string().optional(),
  caption: z.string().optional(),
  name: z.string().min(1).optional(),
});

export const PUT = handler(async (request: Request, { params }: Ctx) => {
  await requireStaff();
  const asset = await MediaService.update((await params).id, await parseBody(request, patchSchema));
  return asset ? json(asset) : json({ error: 'File not found' }, 404);
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  await requireStaff();
  await MediaService.delete((await params).id);
  return json({ deleted: true });
});
