"use client";

import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HarpButton } from "@/components/harp-ui/harp-button";
import { currencyFormatters, CurrencyFormatters, cn } from "@/lib/utils";

export const currencyRates: Record<string, number> = {
  USD: 1,
  GHS: 15.5,
  EUR: 0.92,
  GBP: 0.78,
  NGN: 1550,
};

interface BillingPlanCardProps {
  plan: SubscriptionPlanComparison;
  isRecommended?: boolean;
  currency: string;
  billingCycle: string;
  onSelect?: (plan: SubscriptionPlanComparison) => void;
  isLoading?: boolean;
}

export function BillingPlanCard({
  plan,
  isRecommended,
  currency,
  billingCycle,
  onSelect,
  isLoading,
}: BillingPlanCardProps) {
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num);

  const convertPrice = (priceUSD: number, targetCurrency: string): string => {
    const multiplier = billingCycle === "annual" ? 10 : 1;
    const converted = priceUSD * multiplier * (currencyRates[targetCurrency] ?? 1);
    return currencyFormatters[targetCurrency as keyof CurrencyFormatters]?.(converted) ?? `$${converted}`;
  };

  // Featured plans (usually "Scale" or "Recommended") get the special border
  const isFeatured = isRecommended || plan.isPopular;

  return (
    <Card
      className={cn(
        "relative flex flex-col transition-all duration-300 border-border",
        isFeatured && "border-primary shadow-btn-primary-hover ring-1 ring-primary/10"
      )}
    >
      {/* Badges */}
      <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
        {plan.isCurrentPlan && (
          <Badge className="bg-success/10 text-success border-success/20 font-medium">
            Active
          </Badge>
        )}
        {isRecommended && (
          <Badge className="bg-primary text-white border-transparent font-medium">
            Best Value
          </Badge>
        )}
      </div>

      <CardHeader className="pb-6 pt-8 px-8">
        <h3 className="text-xl font-bold tracking-tight text-foreground-strong">
          {plan.name}
        </h3>
        <p className="mt-2 text-sm text-foreground-subtle leading-relaxed">
          {plan.description}
        </p>
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-foreground-strong">
            {plan.slug === "free" || plan.priceAmount === 0
              ? "Free"
              : convertPrice(plan.priceAmount, currency)}
          </span>
          {plan.priceAmount > 0 && (
            <span className="text-foreground-subtle font-medium">
              /{billingCycle === "monthly" ? "mo" : "yr"}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-8 px-8 pt-2">
        {/* Quota breakdown (Simplified for V2) */}
        <div className="space-y-3 py-4 border-y border-border/50">
            <div className="flex items-center justify-between text-[13px]">
                <span className="text-foreground-subtle">Email Quota</span>
                <span className="font-semibold text-foreground-strong">
                {formatNumber(plan.emailQuota)}
                </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
                <span className="text-foreground-subtle">Domains</span>
                <span className="font-semibold text-foreground-strong">
                {plan.maxDomains}
                </span>
            </div>
        </div>

        {/* Features List */}
        <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground-subtle/70">
                What's included
            </p>
            <ul className="space-y-3">
            {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                    <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                </div>
                <span className="text-sm text-foreground-subtle">{feature}</span>
                </li>
            ))}
            </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-6 pb-8 px-8">
        <HarpButton
          variant={isRecommended ? "primary" : "secondary"}
          size="lg"
          isFullWidth
          disabled={plan.isCurrentPlan || isLoading}
          isLoading={isLoading}
          onClick={() => onSelect?.(plan)}
        >
          {plan.isCurrentPlan
            ? "Current Plan"
            : plan.priceAmount === 0
              ? "Get Started"
              : isRecommended
                ? "Upgrade to " + plan.name
                : "Choose " + plan.name}
        </HarpButton>
      </CardFooter>
    </Card>
  );
}
