import { handler, requireStaff, badRequest } from '@/lib/api';
import { json } from '@/lib/http';
import { MediaService } from '@/services/media.service';

export const GET = handler(async (request: Request) => {
  await requireStaff();
  const p = new URL(request.url).searchParams;
  const media = await MediaService.list({
    folder: p.get('folder') || undefined,
    q: p.get('q') || undefined,
  });
  const folders = [...new Set((await MediaService.list()).map((m) => m.folder))].sort();
  return json({ media, folders });
});

export const POST = handler(async (request: Request) => {
  const user = await requireStaff();
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) throw badRequest('Choose a file to upload');

  try {
    const asset = await MediaService.upload({
      buffer: Buffer.from(await file.arrayBuffer()),
      filename: file.name,
      contentType: file.type,
      folder: String(form.get('folder') || 'uploads'),
      width: Number(form.get('width')) || 0,
      height: Number(form.get('height')) || 0,
      createdBy: user.email ?? undefined,
    });
    return json(asset, 201);
  } catch (e) {
    return json({ error: (e as Error).message }, 400);
  }
});
