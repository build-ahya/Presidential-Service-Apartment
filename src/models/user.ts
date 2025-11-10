export interface UserSession {
  deviceId: string; // Unique identifier for the device
  deviceType: 'iOS' | 'Android' | 'Web'; // Platform type
  deviceModel?: string; // Model of the device
  pushNotificationToken?: string; // Unique push token for the device
  lastActive: string; // Last time the user was active on this device
  lastLogin?: string; // Last time the user logged in on this device
  ipAddress?: string; // IP address of the device
}

export interface User {
  uid: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'customer';
  provider: 'password' | 'google';
  avatarUrl?: string;
  password?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
  sessions?: UserSession[]; // Tracks multiple device sessions
  createdAt: string;
  updatedAt: string;
}
export interface UserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'member' | 'manager' | 'customer';
}

export interface UserPasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

export type UserUpdateInput = Partial<User>;