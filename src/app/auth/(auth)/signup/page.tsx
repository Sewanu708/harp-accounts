// import SignupForm from "@/components/auth/signup-form";
import { RegisterFormV2 } from "@/components/authV2/signup";
import type { Metadata } from "next"; 

export const metadata: Metadata = {
  title: "Sign Up - Harp",
  description: "Create an account",
};

export default function SignupPage() {
  return  <RegisterFormV2 />;
}
