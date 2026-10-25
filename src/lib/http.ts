import 'server-only';
import { NextResponse } from 'next/server';
import type { ZodType } from 'zod';
import { badRequest } from '@/lib/api';

/** Parse + validate a JSON body, throwing a 400 with the first issue. */
export async function parseBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw badRequest('Invalid JSON body');
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path.join('.');
    throw badRequest(field ? `${field}: ${issue.message}` : issue.message);
  }
  return result.data;
}

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
