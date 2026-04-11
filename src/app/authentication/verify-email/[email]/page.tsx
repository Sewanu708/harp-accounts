import VerifyEmailPage from "@/components/auth/link-verification";
import type { Metadata } from "next";
import { Suspense, use } from "react";

export const metadata: Metadata = {
  title: "Verify Account - Harp",
  description: "Verify your email or phone number",
};

export default function VerifyPage({
  params,
}: {
  params: Promise<{ email: string }>
}) {

  const { email } = use(params)
  return <Suspense><VerifyEmailPage  email={email}/></Suspense>;
}
