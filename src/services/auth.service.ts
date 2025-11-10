import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';
import { createUser, getUser } from './firebase.service';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

// Extend the User type from our models
interface UserWithPassword {
  uid: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  provider: 'password' | 'google';
  avatarUrl?: string;
  password?: string;
  createdAt: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Get user from Firestore
          const userData = (await getUser(
            credentials.email
          )) as UserWithPassword | null;

          if (!userData || !userData.password) {
            return null;
          }

          // Verify password using bcrypt
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            userData.password
          );
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: userData.uid,
            email: userData.email,
            name: userData.name,
            image: userData.avatarUrl,
            role: userData.role,
          };
        } catch (error) {
          console.error('Sign in error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in our database
          const existingUser = await getUser(user.email!);

          if (!existingUser) {
            // Create new user in Firestore
            await createUser({
              uid: user.email!,
              name: user.name!,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              email: user.email!,
              role: 'customer',
              provider: 'google',
              avatarUrl: user.image || undefined,
            });
          }
        } catch (error) {
          console.error('Error creating user:', error);
          // Still allow sign in even if database operation fails
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.id || token.sub) {
        const userId = (token.id || token.sub) as string;
        try {
          // Get user data from Firestore using the correct user ID
          const userData = await getUser(userId);

          session.user = {
            id: userId,
            role: userData?.role || 'customer',
            name: userData?.name || session.user?.name || 'User',
            email: userData?.email || session.user?.email || '',
            image: userData?.avatarUrl || session.user?.image || '',
          };
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic session data
          session.user = {
            id: userId,
            role: 'customer',
            name: session.user?.name || 'User',
            email: session.user?.email || '',
            image: session.user?.image || '',
          };
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // For Google users, use email as ID to match the uid in Firestore
        const userData = await getUser(user?.email || '');
        token.id = user?.email || '';
        token.role = userData?.role || 'customer';
      } else if (token?.id) {
        // Ensure role stays fresh on subsequent requests
        const userData = await getUser(token.id);
        if (userData?.role) {
          token.role = userData.role;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
