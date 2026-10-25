import { ApiError, handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { userPatchSchema } from '@/lib/schemas';
import { UserService } from '@/services/user.service';

type Ctx = { params: Promise<{ email: string }> };

export const PUT = handler(async (request: Request, { params }: Ctx) => {
  const me = await requireStaff(['admin']);
  const email = decodeURIComponent((await params).email);
  const patch = await parseBody(request, userPatchSchema);
  if (email === me.id && (patch.active === false || (patch.role && patch.role !== 'admin'))) {
    throw new ApiError(400, 'You cannot demote or deactivate your own account');
  }
  const user = await UserService.update(email, patch);
  return user ? json(user) : json({ error: 'User not found' }, 404);
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  const me = await requireStaff(['admin']);
  const email = decodeURIComponent((await params).email);
  if (email === me.id) throw new ApiError(400, 'You cannot delete your own account');
  await UserService.delete(email);
  return json({ deleted: true });
});
