
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "annual";


interface BillingToggleProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
}

function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="relative w-fit">
      <div className="flex items-center gap-[0px] rounded-[50px] bg-surface-teal-soft p-[6px]">
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className={cn(
            "rounded-[60px] px-[10px] py-[6px] text-[16px] font-semibold tracking-[-0.5px] transition-colors",
            value === "monthly"
              ? "bg-muted text-foreground"
              : "text-harp-grey-31",
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onChange("annual")}
          className={cn(
            "rounded-[60px] px-[10px] py-[6px] text-[16px] font-semibold tracking-[-0.5px] transition-colors",
            value === "annual"
              ? "bg-muted text-foreground"
              : "text-harp-grey-31",
          )}
        >
          Annual
        </button>
      </div>
      {/* -20% badge on Annual */}
      <div className="absolute -top-[6px] right-0 rounded-[30px] bg-success px-[6px] py-[3px]">
        <span className="text-[10px] font-medium tracking-[-0.5px] text-white">
          -20%
        </span>
      </div>
    </div>
  );
}

export default BillingToggle;

