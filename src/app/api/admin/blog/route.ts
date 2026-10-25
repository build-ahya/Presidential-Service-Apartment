import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { postSchema } from '@/lib/schemas';
import { BlogService } from '@/services/blog.service';
import type { Post } from '@/models/post';

export const GET = handler(async () => {
  await requireStaff();
  return json({ posts: await BlogService.listAll() });
});

export const POST = handler(async (request: Request) => {
  const user = await requireStaff();
  const input = await parseBody(request, postSchema);
  try {
    const post = await BlogService.create(input as Partial<Post> & { title: string; content: string }, user.name || 'Admin', user.id);
    return json(post, 201);
  } catch (e) {
    return json({ error: (e as Error).message }, 409);
  }
});
