import 'server-only';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserService } from '@/services/user.service';
import type { UserRole } from '@/models/user';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole | '';
    checkedAt?: number;
  }
}

/** Re-validate the user (still exists / still active / role) at most this often. */
const REVALIDATE_MS = 5 * 60 * 1000;

export const authSecret =
  process.env.NEXTAUTH_SECRET || process.env.JWT_ACCESS_SECRET;

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 12 },
  pages: { signIn: '/admin/login' },
  providers: [
    CredentialsProvider({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await UserService.authenticate(
            credentials.email,
            credentials.password
          );
          if (!user) return null;
          void UserService.touchLogin(user.email).catch(() => undefined);
          return {
            id: user.email,
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
            role: user.role,
          };
        } catch (error) {
          console.error('Sign in error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.checkedAt = Date.now();
        return token;
      }

      if (token.id && Date.now() - (token.checkedAt ?? 0) > REVALIDATE_MS) {
        try {
          const current = await UserService.getByEmail(token.id);
          if (!current || current.active === false) {
            token.id = '';
            token.role = '';
          } else {
            token.role = current.role;
          }
          token.checkedAt = Date.now();
        } catch (error) {
          console.error('Failed to refresh session user:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        role: token.role as UserRole,
      };
      return session;
    },
  },
};
