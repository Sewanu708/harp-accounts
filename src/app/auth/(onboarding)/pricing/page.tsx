import PlanPage from "@/components/authV2/onboarding/pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Harp",
  description: "Add a company and complete your KYC",
};

export default function SignupPage() {
  return <PlanPage />;
}
