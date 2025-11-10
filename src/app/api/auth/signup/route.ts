import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUser } from '@/services/firebase.service';
import type { User } from '@/models/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const role = (body?.role || 'customer') as User['role'];

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user exists
    const existing = await getUser(email);
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const name = `${firstName} ${lastName}`.trim();

    await createUser({
      uid: email, // using email as uid per existing convention
      name,
      firstName,
      lastName,
      email,
      role,
      provider: 'password',
      avatarUrl: '/images/default-avatar.png',
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/auth/signup:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}