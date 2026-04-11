"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2 } from "lucide-react";
import { HarpButton } from "@/components/harp-ui/harp-button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const redirectUrl = searchParams.get("r"); // applicationUrl passed through checkout
  const { data: session }: any = useSession();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    if (countdown === 0) {
      if (redirectUrl && session?.token) {
        let finalUrl = decodeURIComponent(redirectUrl);
        if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
          finalUrl = `http://${finalUrl}`;
        }
        window.location.href = `${finalUrl}?auth=${session.token}`;
      } else {
        router.push("/");
      }
      return;
    }

    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, router, redirectUrl, session, sessionId]);

  const handleContinue = () => {
    if (redirectUrl && session?.token) {
      console.log('redirectUrl', redirectUrl)
      console.log('session.token')
      let finalUrl = decodeURIComponent(redirectUrl);
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = `http://${finalUrl}`;
      }
      window.location.href = `${finalUrl}?auth=${session.token}`;
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <CheckCircle2
              className="relative w-24 h-24 text-primary"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Payment Successful
          </h1>
          <p className="text-lg text-muted-foreground">
            Your plan is now active. Happy building!
          </p>
          {countdown > 0 && (
            <p className="text-sm text-muted-foreground">
              Redirecting in {countdown} seconds...
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="pt-4">
          <HarpButton
            type="button"
            variant="primary"
            size="md"
            isFullWidth
            onClick={handleContinue}
          >
            Continue to Dashboard
          </HarpButton>
        </div>
      </div>
    </div>
  );
}
