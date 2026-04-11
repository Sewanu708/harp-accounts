/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  emailVerified?: boolean
  phoneVerified?: boolean
  profileStage: "basic" | "preferences" | "kyc" | "complete"
  kycStatus: "pending" | "verified" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: User
    token?: string
    refreshToken?: string
  }
  error?: string
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface OTPRequest {
  identifier: string
  otp: string
  type: "email" | "phone"
}

export interface ResetPasswordRequest {
  email: string
}

export interface SetPasswordRequest {
  token: string
  password: string
}

export interface ProfileUpdateRequest {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  preferences?: Record<string, any>
}

export interface KYCData {
  documentType: "passport" | "drivers_license" | "national_id"
  documentNumber: string
  documentImage: File | string
  selfieImage: File | string
  address: string
  dateOfBirth: string
  nationality: string
}

export interface KYBData {
  businessName: string
  rcNumber: string
  businessAddress: string
  businessType: string
  directorName: string
  directorEmail: string
  businessDocument: File | string
}
