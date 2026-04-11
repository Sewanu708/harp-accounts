"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ResetPasswordFormV2 } from "./reset-password";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  return <ResetPasswordFormV2 token={token} />;
}

export default function ResetPasswordPageV2() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-[8px] text-[16px] text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading...</span>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
