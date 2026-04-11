"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SetPasswordFormV2 } from "./set-password";

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("u") as string;

  if (!token) return <div>Invalid or expired token.</div>;

  return <SetPasswordFormV2 email={email} token={token} />;
}

export default function SetPasswordPageV2() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-[8px] text-[16px] text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading...</span>
        </div>
      }
    >
      <SetPasswordContent />
    </Suspense>
  );
}
