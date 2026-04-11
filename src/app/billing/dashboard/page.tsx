"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HarpButton } from "@/components/harp-ui/harp-button";
import { useMultiServiceUsage, useCurrentPlan } from "@/hooks/queries/use-pricing";
import { CancelSubscriptionModal } from "@/components/billing/cancel-sub";
import BillingHistory from "./billing-history";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function BillingDashboard() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useMultiServiceUsage();
  const { data: currentPlan } = useCurrentPlan();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quotaData, setQuotaData] = useState<{ name: string; used: string; quota: string; percentage: number }[]>([]);

  // Redirect to login on 401
  useEffect(() => {
    if (isError && (error as { status?: number })?.status === 401) {
      router.push("/auth/login?callbackUrl=/billing/dashboard");
    }
  }, [isError, error, router]);

  useEffect(() => {
    if (data?.services) {
      const mapped = (Object.entries(data.services) as [string, { sent?: number; quota?: number; usagePercentage?: number }][]).map(
        ([key, value]) => ({
          name: key === "emails" ? "emails sent" : key,
          used: value.sent?.toLocaleString() ?? "0",
          quota: value.quota?.toLocaleString() ?? "0",
          percentage: value.usagePercentage ?? 0,
        })
      );
      setQuotaData(mapped);
    }
  }, [data]);

  if (isError && (error as { status?: number })?.status !== 401) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium text-foreground-strong">Failed to load usage data</span>
        </div>
        <HarpButton variant="secondary" onClick={() => window.location.reload()}>
          Try again
        </HarpButton>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground-strong">Usage Analytics</h1>
        <p className="mt-2 text-base text-foreground-subtle">
          Monitor your usage and track spending across billing periods
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Current Plan + Usage Card */}
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <Badge className="bg-success/10 text-success border-success/20 font-medium capitalize">
                {currentPlan?.status || "Active"}
              </Badge>
              <div className="text-3xl font-bold text-foreground-strong">
                ${currentPlan?.plan?.priceAmount || 0}
                <span className="ml-1 text-sm font-medium text-foreground-subtle">
                  /{currentPlan?.plan?.interval === "monthly" ? "mo" : "yr"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground-strong">
                  {currentPlan?.plan?.name || "No active plan"}
                </h2>
                {currentPlan?.plan?.interval && (
                   <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                    {currentPlan.plan.interval}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-foreground-subtle leading-relaxed">
                Our most popular plan for growing teams. Includes all core features and basic support.
              </p>
            </div>

            {/* Progress Sections */}
            <div className="space-y-6 pt-2">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
                  </div>
                ))
              ) : quotaData.length > 0 ? (
                quotaData.map((q) => (
                  <div key={q.name} className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground-strong capitalize">
                        {q.name}
                      </span>
                      <span className="text-foreground-subtle">
                        {q.used} / {q.quota}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          q.percentage > 90 ? "bg-destructive" : "bg-primary"
                        )}
                        style={{ width: `${Math.min(q.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground-subtle italic">No usage data available for this period.</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-8 py-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-medium text-destructive hover:underline transition-colors"
            >
              Cancel Subscription
            </button>
            <Link
              href="/billing/plans"
              className="inline-flex items-center text-sm font-bold text-primary hover:gap-2 transition-all"
            >
              Upgrade plan <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <BillingHistory />
      </div>

      <CancelSubscriptionModal
        currentPlan={currentPlan ?? ({} as CurrentSubscription)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
