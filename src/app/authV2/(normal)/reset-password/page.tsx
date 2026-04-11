import ResetPasswordPageV2 from "@/components/authV2/password/reset-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Harp",
  description: "Reset your account password",
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageV2 />;
}
