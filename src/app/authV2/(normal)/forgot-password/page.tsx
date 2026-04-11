import { ForgotPasswordFormV2 } from "@/components/authV2/password/forgot-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Harp",
  description: "Reset your account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordFormV2 />;
}
