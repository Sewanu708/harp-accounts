
// import { KycForm } from "@/components/auth/kyc-form";
import KycFormV2 from "@/components/authV2/onboarding/kyc";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Harp",
  description: "Add a company and complete your KYC",
};

export default function SignupPage() {
  return <KycFormV2 />;
}
