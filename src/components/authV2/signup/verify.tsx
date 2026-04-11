"use client";

import { useState } from "react";
import { harpToast as toast } from "@/lib/toast";
import { apiClient } from "@/lib/api-client";
import { useHarp } from "@/contexts/harp-context";
import { HarpButton } from "@/components/harp-ui/harp-button";
import { getEmailProvider } from "@/lib/utils";

export function VerifyEmailV2({ email }: { email: string;}) {
  const [isResending, setIsResending] = useState(false);
  const { application, applicationUrl } = useHarp();

  const provider = getEmailProvider(email);

  const handleOpenInbox = () => {
    window.open(provider.url, "_blank", "noopener,noreferrer");
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const response = await apiClient.signup({
        email,
        product: application!,
        redirect: `${window.location.origin}`,
        applicationUrl: applicationUrl!,
      });

      if (response.success) {
        toast.success("Verification link resent. Check your email.");
      } else {
        toast.error(response.error || "Failed to resend. Try again.");
      }
    } catch {
      toast.error("Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex w-full max-w-[477px] flex-col items-center gap-[38px]">

      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-[6px] text-center tracking-[-0.5px]">
        <h1 className="text-[28px] font-bold leading-[30.8px] text-foreground">
          Verify your email address
        </h1>
        <p className="w-full max-w-[463px] text-[16px] font-medium text-harp-grey-31">
          We've sent a verification link to{" "}
          <span className="font-semibold text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex w-full max-w-[384px] flex-col items-center gap-[15px]">

        <HarpButton
          type="button"
          variant="secondary"
          size="lg"
          isFullWidth
          leftIcon={provider.icon}
          onClick={handleOpenInbox}
        >
          {provider.label}
        </HarpButton>

        <p className="w-full max-w-[335px] text-center text-[12px] font-normal leading-[18px] text-harp-grey-31">
          Don't see the email? Check your spam or{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="underline underline-offset-2 transition-opacity hover:opacity-70 disabled:opacity-50"
          >
            {isResending ? "resending..." : "request a new verification link."}
          </button>
        </p>

      </div>
    </div>
  );
}