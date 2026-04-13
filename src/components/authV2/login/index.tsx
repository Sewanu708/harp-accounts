"use client";

import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import LoginContent from "./login";
import { useHarp } from "@/contexts/harp-context";
import { APPLICATIONS } from "@/lib";
import { useRouter } from "next/navigation";

export function LoginFormV2({
  isAvailableTokenValid,
  token,
}: {
  isAvailableTokenValid: boolean;
  token?: string;
}) {
  const { application, applicationUrl } = useHarp();
  const router = useRouter();

  useEffect(() => {
    if (
      application?.trim() &&
      APPLICATIONS.indexOf(application) > -1 &&
      isAvailableTokenValid
    ) {
      if (!applicationUrl) return;
      router.replace(`${applicationUrl!}?auth=${token}`);
    }
  }, [application, applicationUrl, token, isAvailableTokenValid]);

  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-[8px] text-[16px] text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading...</span>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
