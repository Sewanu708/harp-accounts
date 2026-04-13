import { LoginFormV2 } from "@/components/authV2/login";
import { authOptions } from "@/lib/auth-config";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login - Harp",
  description: "Sign in to your account",
};

const BASE_URL = process.env.HARP_BASE;

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  let tokenValidity = false;

  if (session) {
    const resp = await fetch(`${BASE_URL}/auth/me`, {
      method: "POST",
      headers: {
        Authorization: session?.token,
      },
    });

    const data = await resp.json();

    if (!data?.account) {
      tokenValidity = false;
    } else {
      tokenValidity = true;
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormV2 isAvailableTokenValid={tokenValidity} token={session?.token}/>
    </Suspense>
  );
}
