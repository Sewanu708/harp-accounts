import { LoginFormV2 } from "@/components/authV2/login";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login - Harp",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
      <LoginFormV2 />
    </Suspense>
  );
}
