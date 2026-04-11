import SetPasswordPageV2 from "@/components/authV2/password/set-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Password - Harp",
  description: "Set your account password",
};

export default function SetPasswordPage() {
  return <SetPasswordPageV2 />;
}
