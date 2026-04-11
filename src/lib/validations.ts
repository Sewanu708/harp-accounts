import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string(),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const kycSchema = z.object({
  country: z.string().min(2, "First name must be at least 2 characters"),
  business_name: z.string().min(2, "Last name must be at least 2 characters"),
  website: z.string().optional(),
  phone: z.string().optional(),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

export const kycSchemav2 = z.object({
  businessName: z.string().min(1, "Business name is required"),
  website: z.string().optional(),
  address: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  industry: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.string().optional(),
  phone: z.string().optional(),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type KycFormData = z.infer<typeof kycSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
