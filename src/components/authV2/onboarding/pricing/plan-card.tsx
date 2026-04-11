import { HarpButton } from "@/components/harp-ui/harp-button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type BillingCycle = "monthly" | "annual";

function formatPrice(amount: number, currency: string): string {
  if (currency?.toUpperCase() === "NGN") return `₦${amount.toLocaleString()}`;
  if (currency?.toUpperCase() === "USD") return `$${amount}`;
  return `${currency} ${amount}`;
}

function getCTALabel(plan: SubscriptionPlan): string {
  if (plan.priceAmount === 0) return "Start Free";
  if (plan.slug?.toLowerCase() === "enterprise") return "Contact Sales";
  return `Choose ${plan.name}`;
}

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  onSelect: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

function PlanCard({ plan, billingCycle, onSelect, isLoading }: PlanCardProps) {
  const isAnnual = billingCycle === "annual";
  const effectivePrice =
    isAnnual && plan.priceAmount > 0
      ? Math.round(plan.priceAmount * 0.8) * 12
      : plan.priceAmount;

  const priceDisplay =
    plan.priceAmount > 0
      ? isAnnual
        ? `${formatPrice(effectivePrice, plan.currency)}/yr`
        : `${formatPrice(plan.priceAmount, plan.currency)}/mo`
      : plan.slug?.toLowerCase().includes("free")
        ? `Free Plan`
        : "Talk to Sales";

  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-[32px] rounded-[20px] border p-[32px]",
        plan.isPopular
          ? "bg-primary border-primary shadow-[0px_0px_0px_3px_rgba(0,64,61,0.1)] rounded-[12px]"
          : "bg-muted border-border",
      )}
    >
      {/* Plan info */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[4px]">
            <p
              className={cn(
                "text-[14px] font-normal",
                plan.isPopular ? "text-white" : "text-muted-foreground",
              )}
            >
              {plan.name}
            </p>

            {/* Price or "Talk to Sales" */}
            {priceDisplay ? (
              <p
                className={cn(
                  "text-[28px] font-bold tracking-[-0.5px]",
                  plan.isPopular ? "text-white" : "text-foreground",
                )}
              >
                {priceDisplay}
              </p>
            ) : (
              <p className="text-[28px] font-bold tracking-[-0.5px] text-foreground">
                Talk to Sales
              </p>
            )}
          </div>

          <p
            className={cn(
              "text-[12px] font-normal",
              plan.isPopular ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {plan.description}
          </p>
        </div>

        {/* Divider */}
        <hr
          className={cn(
            "border-t",
            plan.isPopular ? "border-white/20" : "border-border",
          )}
        />

        {/* Features */}
        <div className="flex flex-col gap-[8px]">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-center gap-[9px]">
              <div
                className={cn(
                  "flex size-[20px] shrink-0 items-center justify-center rounded-full",
                  plan.isPopular ? "bg-[#99b9b8]" : "bg-surface-teal-soft",
                )}
              >
                <Check
                  className={cn(
                    "size-[12px]",
                    plan.isPopular ? "text-white" : "text-primary",
                  )}
                  strokeWidth={2.5}
                />
              </div>
              <span
                className={cn(
                  "text-[12px] font-normal leading-[18px]",
                  plan.isPopular ? "text-white" : "text-primary",
                )}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA button */}
      <HarpButton
        type="button"
        variant={plan.isPopular ? "ghost" : "secondary"}
        size="md"
        isFullWidth
        isLoading={isLoading}
        onClick={() => onSelect(plan)}
        className={
          plan.isPopular
            ? "bg-[#BFD4D3] border-transparent text-primary hover:bg-[#BFD4D3]/80"
            : ""
        }
      >
        {getCTALabel(plan)}
      </HarpButton>
    </div>
  );
}

export default PlanCard;
