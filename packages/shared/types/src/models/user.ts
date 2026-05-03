export interface User {
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  isVerified: boolean;
  verificationCode?: string;
  verificationExpiry?: Date;
  resetCode?: string;
  resetExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}