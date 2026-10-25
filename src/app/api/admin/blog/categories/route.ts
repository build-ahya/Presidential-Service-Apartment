import { z } from 'zod';
import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { BlogService } from '@/services/blog.service';

export const GET = handler(async () => {
  await requireStaff();
  return json({ categories: await BlogService.categories() });
});

export const POST = handler(async (request: Request) => {
  await requireStaff();
  const { name, description } = await parseBody(
    request,
    z.object({ name: z.string().trim().min(2), description: z.string().optional() })
  );
  try {
    return json(await BlogService.createCategory(name, description), 201);
  } catch (e) {
    return json({ error: (e as Error).message }, 409);
  }
});
