"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft } from "lucide-react";

import BillingToggle from "./billing";
import PlanCard from "./plan-card";
import { useHarp } from "@/contexts/harp-context";
import { HarpButton } from "@/components/harp-ui/harp-button";
import { usePlans, usePayment } from "@/hooks/queries/use-pricing";

export default function PlanPage() {
  const router = useRouter();
  const { applicationUrl, application } = useHarp();
  const { data: session } = useSession() as { data: { token?: string; user?: { id?: string } } | null };
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null);

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { mutateAsync: checkout } = usePayment();

  const filteredPlans = plans?.filter((plan) => plan.status === "active");

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    setSelectingPlanId(plan.id);

    try {
      // Free plan — skip payment, go straight to app
      if (plan.priceAmount === 0) {
        if (session?.token && applicationUrl) {
          window.location.href = `${applicationUrl}?auth=${session.token}`;
        } else {
          router.push("/");
        }
        return;
      }

      // Paid plan — initiate Stripe checkout
      const origin = window.location.origin;
      const successUrl = `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&r=${encodeURIComponent(applicationUrl ?? "")}&i=${application ?? ""}`;
      const cancelUrl = `${origin}/payment/failed?session_id={CHECKOUT_SESSION_ID}&i=${application ?? ""}`;

      const result = await checkout({
        customerId: session?.user?.id ?? "",
        planId: plan.id,
        successUrl,
        cancelUrl,
      });

      window.location.href = result.checkoutUrl;
    } catch {
      setSelectingPlanId(null);
    }
  };

  return (
    <div className="flex flex-col gap-[32px] sm:gap-[50px] w-full max-w-[1200px] mx-auto">
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-[6px]">
        <p className="font-mono text-[10px] sm:text-[12px] font-medium uppercase tracking-[0.5px] text-harp-grey-31">
          Step 2 of 2 — Choose your plan
        </p>
        <h1 className="text-[22px] sm:text-[28px] font-bold leading-[30.8px] tracking-[-1px] text-foreground">
          Simple, transparent pricing
        </h1>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-[24px]">
        {/* Billing toggle */}
        <div className="flex justify-start">
          <BillingToggle value={billingCycle} onChange={setBillingCycle} />
        </div>

        {/* Plan cards grid */}
        {plansLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-[20px] bg-muted border border-border animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] items-stretch w-full">
            {filteredPlans?.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                onSelect={handleSelectPlan}
                isLoading={selectingPlanId === plan.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Actions ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-[16px] border-t border-harp-azure-89 pt-[32px]">
        <HarpButton
          type="button"
          variant="ghost"
          size="md"
          leftIcon={<ChevronLeft className="size-4" />}
          onClick={() => router.push("/authV2/kyc")}
          className="text-icon-disabled"
        >
          Back
        </HarpButton>
      </div>
    </div>
  );
}
