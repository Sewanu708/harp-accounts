import { LoginFormV2 } from "@/components/authV2/login"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Login - Harp",
  description: "Sign in to your account",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormV2 />
    </Suspense>
  )
}
