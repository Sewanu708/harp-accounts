'use client'
import { Loader2 } from "lucide-react";
import { Suspense, useState } from "react";
import RegisterFormContent from "./register";
import { VerifyEmailV2 } from "./verify";

export function RegisterFormV2() {
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  if (verifyEmail) {
    return <VerifyEmailV2 email={verifyEmail} />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-[8px] text-[16px] text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading...</span>
        </div>
      }
    >
      <RegisterFormContent onSuccess={(email) => setVerifyEmail(email)} />
    </Suspense>
  );
}
