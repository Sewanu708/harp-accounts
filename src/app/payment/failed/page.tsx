"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { HarpButton } from "@/components/harp-ui/harp-button";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const application = searchParams.get("i");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
    }
  }, [sessionId, router]);

  const retryUrl = application
    ? `/authV2/pricing?i=${application}`
    : "/authV2/pricing";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
            <XCircle
              className="relative w-24 h-24 text-destructive"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Payment Failed</h1>
          <p className="text-lg text-muted-foreground">
            We couldn&apos;t process your payment. No charges were made.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <HarpButton
            type="button"
            variant="primary"
            size="md"
            isFullWidth
            onClick={() => router.push(retryUrl)}
          >
            Try Again
          </HarpButton>
          <HarpButton
            type="button"
            variant="ghost"
            size="md"
            isFullWidth
            onClick={() => router.push("/")}
          >
            Back to Home
          </HarpButton>
        </div>
      </div>
    </div>
  );
}
