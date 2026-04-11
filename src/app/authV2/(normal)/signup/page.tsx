import { RegisterFormV2 } from "@/components/authV2/signup";
import type { Metadata } from "next"; 
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up - Harp",
  description: "Create an account",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
      <RegisterFormV2 />
    </Suspense>
  );
}
