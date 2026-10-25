export type UserRole = 'admin' | 'manager';

export interface User {
  uid: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  provider: 'password';
  active?: boolean;
  avatarUrl?: string;
  /** bcrypt hash — never sent to the client. */
  password?: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export type PublicUser = Omit<User, 'password'>;

export interface UserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}
