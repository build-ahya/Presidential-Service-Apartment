import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { userCreateSchema } from '@/lib/schemas';
import { UserService } from '@/services/user.service';

export const GET = handler(async () => {
  await requireStaff(['admin']);
  return json({ users: await UserService.list() });
});

export const POST = handler(async (request: Request) => {
  await requireStaff(['admin']);
  const input = await parseBody(request, userCreateSchema);
  try {
    return json(await UserService.create(input), 201);
  } catch (e) {
    return json({ error: (e as Error).message }, 409);
  }
});
