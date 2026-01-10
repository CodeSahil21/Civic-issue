import { UserRole, Department } from "@prisma/client";

// Auth request/response types
export interface RegisterUserData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  department?: Department;
  wardId?: string;
  zoneId?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: Department | null;
  wardId?: string | null;
  zoneId?: string | null;
}

// Request body validation types
export interface RegisterRequestBody {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  department?: Department;
  wardId?: string;
  zoneId?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

// Additional response types used in auth service
export interface ForgotPasswordResponse {
  message: string;
  otp?: string; // Only in development
}

export interface VerifyOtpResponse {
  message: string;
  verified: boolean;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  success: boolean;
}