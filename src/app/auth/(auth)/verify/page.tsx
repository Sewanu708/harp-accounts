import VerifyEmailPage from "@/components/auth/link-verification";
import type { Metadata } from "next"; 

export const metadata: Metadata = {
  title: "Verify Account - Harp",
  description: "Verify your email or phone number",
};

export default function VerifyPage() {
  return <VerifyEmailPage />;
}
