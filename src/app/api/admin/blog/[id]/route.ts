import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { BlogService } from '@/services/blog.service';
import { postSchema } from '@/lib/schemas';
import type { Post } from '@/models/post';

type Ctx = { params: Promise<{ id: string }> };

export const GET = handler(async (_req: Request, { params }: Ctx) => {
  await requireStaff();
  const post = await BlogService.getById((await params).id);
  return post ? json(post) : json({ error: 'Post not found' }, 404);
});

export const PUT = handler(async (request: Request, { params }: Ctx) => {
  const user = await requireStaff();
  const patch = await parseBody(request, postSchema.partial());
  try {
    const post = await BlogService.update((await params).id, patch as Partial<Post>, user.name || 'Admin');
    return post ? json(post) : json({ error: 'Post not found' }, 404);
  } catch (e) {
    return json({ error: (e as Error).message }, 409);
  }
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  await requireStaff(['admin']);
  await BlogService.delete((await params).id);
  return json({ deleted: true });
});
