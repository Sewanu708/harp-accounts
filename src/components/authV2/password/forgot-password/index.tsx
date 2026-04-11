'use client'

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import ForgotPasswordContent from "./forgot-password";

export function ForgotPasswordFormV2() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-[8px] text-[16px] text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading...</span>
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
