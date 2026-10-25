import 'server-only';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { UserRole } from '@/models/user';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export const badRequest = (message: string) => new ApiError(400, message);

/** Returns the signed-in staff user or throws 401/403. */
export async function requireStaff(roles: UserRole[] = ['admin', 'manager']) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.id) throw new ApiError(401, 'Authentication required');
  if (!roles.includes(user.role as UserRole))
    throw new ApiError(403, 'You do not have permission to do this');
  return user;
}

/** Wraps a route handler so thrown ApiErrors / unexpected errors become JSON responses. */
export function handler<A extends unknown[]>(
  fn: (...args: A) => Promise<Response>
) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      console.error('API error:', error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
