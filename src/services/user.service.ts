import 'server-only';
import bcrypt from 'bcryptjs';
import { collections } from '@/lib/firebase-admin';
import type { PublicUser, User, UserCreate, UserRole } from '@/models/user';

const normalize = (email: string) => email.trim().toLowerCase();

const toPublic = (data: User): PublicUser => {
  const { password: _password, ...rest } = data;
  return rest;
};

export class UserService {
  /** Users are keyed by their lowercase email address. */
  static async getByEmail(email: string): Promise<User | null> {
    const snap = await collections.users().doc(normalize(email)).get();
    return snap.exists ? ({ ...(snap.data() as User), uid: snap.id }) : null;
  }

  static async list(): Promise<PublicUser[]> {
    const snap = await collections.users().get();
    return snap.docs
      .map((d) => toPublic({ ...(d.data() as User), uid: d.id }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  static async create(input: UserCreate): Promise<PublicUser> {
    const email = normalize(input.email);
    if (await this.getByEmail(email)) throw new Error('A user with this email already exists');

    const now = new Date().toISOString();
    const user: User = {
      uid: email,
      email,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      name: `${input.firstName} ${input.lastName}`.trim(),
      role: input.role,
      provider: 'password',
      active: true,
      password: await bcrypt.hash(input.password, 10),
      createdAt: now,
      updatedAt: now,
    };
    await collections.users().doc(email).set(user);
    return toPublic(user);
  }

  static async update(
    email: string,
    patch: Partial<Pick<User, 'firstName' | 'lastName' | 'role' | 'active'>> & {
      password?: string;
    }
  ): Promise<PublicUser | null> {
    const existing = await this.getByEmail(email);
    if (!existing) return null;

    const next: Partial<User> = { updatedAt: new Date().toISOString() };
    if (patch.firstName !== undefined) next.firstName = patch.firstName.trim();
    if (patch.lastName !== undefined) next.lastName = patch.lastName.trim();
    if (patch.role) next.role = patch.role as UserRole;
    if (patch.active !== undefined) next.active = patch.active;
    if (patch.password) next.password = await bcrypt.hash(patch.password, 10);
    if (next.firstName !== undefined || next.lastName !== undefined) {
      next.name = `${next.firstName ?? existing.firstName} ${next.lastName ?? existing.lastName}`.trim();
    }

    await collections.users().doc(existing.uid).update(next);
    return toPublic({ ...existing, ...next });
  }

  static async delete(email: string) {
    await collections.users().doc(normalize(email)).delete();
  }

  static async touchLogin(email: string) {
    await collections.users().doc(normalize(email)).update({
      lastLoginAt: new Date().toISOString(),
    });
  }

  /**
   * Verifies credentials. The very first admin is bootstrapped from
   * ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD: signing in with those creates
   * the account if it does not exist yet.
   */
  static async authenticate(email: string, password: string): Promise<User | null> {
    const normalized = normalize(email);
    let user = await this.getByEmail(normalized);

    const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
    const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    if (
      !user &&
      bootstrapEmail &&
      bootstrapPassword &&
      normalized === bootstrapEmail &&
      password === bootstrapPassword
    ) {
      await this.create({
        firstName: 'Site',
        lastName: 'Admin',
        email: normalized,
        password,
        role: 'admin',
      });
      user = await this.getByEmail(normalized);
    }

    if (!user?.password || user.active === false) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }
}
