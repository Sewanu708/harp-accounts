"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useComparison, usePayment } from "@/hooks/queries/use-pricing";
import { BillingPlanCard } from "@/components/billing/plan-card";
import { useHarp } from "@/contexts/harp-context";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const currencies = [
  { code: "USD", name: "US Dollar ($)" },
  { code: "GHS", name: "Ghanaian Cedi (GHS)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "NGN", name: "Nigerian Naira (₦)" },
];

export default function PlansPage() {
  const router = useRouter();
  const { application, applicationUrl, billingContext } = useHarp();
  const { data: session, status } = useSession();
  const { data, isLoading } = useComparison();
  const { mutateAsync: checkout } = usePayment();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const saved = localStorage.getItem("preferredCurrency");
    if (saved && currencies.some((c) => c.code === saved)) {
      setCurrency(saved);
    }

    const callback = `billing/plans?i=${application}&r=${applicationUrl}&bt=${billingContext.type}&bc=${billingContext.currency}&pd=${billingContext.planId}`;

    if (status === "unauthenticated" && billingContext.planId) {
      router.push(`/auth/login?callback=${encodeURIComponent(callback)}`);
      return;
    }

    if (
      status === "authenticated" &&
      billingContext.planId &&
      !isAutoRedirecting
    ) {
      setIsAutoRedirecting(true);
      startCheckout(billingContext.planId);
    }
  }, [status, billingContext.planId]);

  const handleCurrencyChange = (code: string) => {
    setCurrency(code);
    localStorage.setItem("preferredCurrency", code);
  };

  const handleSelectPlan = async (plan: SubscriptionPlanComparison) => {
    if (plan.isCurrentPlan || plan.priceAmount === 0) return;
    setSelectingPlanId(plan.id);

    try {
      const origin = window.location.origin;
      console.log("session", session);
      const result = await checkout({
        customerId:
          (session?.user as { business_id?: string })?.business_id ?? "",
        planId: plan.id,
        successUrl: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&r=${encodeURIComponent(applicationUrl ?? "")}&i=${application ?? ""}`,
        cancelUrl: `${origin}/payment/failed?session_id={CHECKOUT_SESSION_ID}&i=${application ?? ""}`,
      });
      window.location.href = result.checkoutUrl;
    } catch {
      setSelectingPlanId(null);
      setIsAutoRedirecting(false);
    }
  };

  const startCheckout = async (id: string) => {
    try {
      const origin = window.location.origin;
      const result = await checkout({
        customerId:
          (session?.user as { business_id?: string })?.business_id ?? "",
        planId: id,
        successUrl: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&r=${encodeURIComponent(applicationUrl ?? "")}&i=${application ?? ""}`,
        cancelUrl: `${origin}/payment/failed?session_id={CHECKOUT_SESSION_ID}&i=${application ?? ""}`,
      });
      window.location.href = result.checkoutUrl;
    } catch {
      setSelectingPlanId(null);
      setIsAutoRedirecting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Auto-redirect Overlay */}
      {isAutoRedirecting && (
        <Dialog open>
          <DialogContent
            className="!bg-transparent !border-0 !shadow-none !ring-0 !outline-none p-0 flex items-center justify-center"
            showCloseButton={false}
            onEscapeKeyDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-foreground" />

              <p className="text-sm text-white">Redirecting to checkout...</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-foreground-strong sm:text-5xl">
          Plans and Pricing
        </h1>
        <p className="mt-4 text-lg text-foreground-subtle leading-relaxed">
          Select the best plan for your business. You can upgrade, downgrade, or
          cancel your subscription at any time.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Tabs defaultValue="monthly" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger
              value="monthly"
              onClick={() => setBillingCycle("monthly")}
              className="px-8"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              onClick={() => setBillingCycle("annual")}
              className="px-8"
            >
              Annual{" "}
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                Save 15%
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              {currencies.find((c) => c.code === currency)?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {currencies.map((c) => (
              <DropdownMenuItem
                key={c.code}
                onClick={() => handleCurrencyChange(c.code)}
                className={currency === c.code ? "bg-muted" : ""}
              >
                {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Plan Cards */}
      {isLoading ? (
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[480px] animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {data?.plans.map((plan) => (
            <BillingPlanCard
              key={plan.id}
              plan={plan}
              isLoading={selectingPlanId === plan.id}
              isRecommended={
                plan.id ===
                (data?.recommendations as { suggestedPlanId?: string })
                  ?.suggestedPlanId
              }
              currency={currency}
              billingCycle={billingCycle}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
      )}

      {/* Back to dashboard */}
      <div className="pt-4 text-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/billing/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
