"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHarp } from "@/contexts/harp-context";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/billing-client";

export function FromProduct() {
  const router = useRouter();
  const { application, applicationUrl, billingContext } = useHarp();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callback = `billing/plans?i=${application}&r=${applicationUrl}&bt=${billingContext.type}&bc=${billingContext.currency}&pd=${billingContext.planId}`;

  const startCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const origin = window.location.origin;

      const result = await apiClient.subscriptions.checkout({
        customerId: (session?.user as { business_id?: string })?.business_id ?? "",
        planId: billingContext.planId ?? "",
        successUrl: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&r=${encodeURIComponent(applicationUrl ?? "")}&i=${application ?? ""}`,
        cancelUrl: `${origin}/payment/failed?session_id={CHECKOUT_SESSION_ID}&i=${application ?? ""}`,
      });

      window.location.href = result.checkoutUrl;
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        router.push(`auth/login?callback=${callback}`);
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during checkout",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      startCheckout();
    }

    router.push(`auth/login?callback=${callback}`);
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Redirecting to checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 text-center space-y-4">
          <h2 className="text-lg font-semibold">Checkout Failed</h2>

          <p className="text-sm text-gray-600">{error}</p>

          <button
            onClick={startCheckout}
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            Retry
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full border py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return null;
}
