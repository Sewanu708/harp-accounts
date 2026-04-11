"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────
export type InputState = "default" | "error" | "success" | "disabled";

export interface HarpInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  /** Field label shown above the input */
  label?: string;
  /** Shows red asterisk next to label */
  required?: boolean;
  /** Helper text below the input — grey by default */
  hint?: string;
  /** Overrides hint with red text when state="error" */
  errorMessage?: string;
  /** Overrides hint with green text when state="success" */
  successMessage?: string;
  /** Explicit state — drives border, icon, and hint color */
  state?: InputState;
  /** Icon shown on the left side of the input */
  leftIcon?: React.ReactNode;
  /** Icon shown on the right side of the input */
  rightIcon?: React.ReactNode;
  /** Prefix slot — renders a grey pill on the left e.g "https://" */
  prefix?: string;
  /** Suffix slot — renders a grey pill on the right e.g ".com" */
  suffix?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
const HarpInput = React.forwardRef<HTMLInputElement, HarpInputProps>(
  (
    {
      label,
      required,
      hint,
      errorMessage,
      successMessage,
      state = "default",
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const resolvedState: InputState = disabled ? "disabled" : state;

    // ── Hint text and color ──────────────────────────────────────────────────
    const hintText =
      resolvedState === "error"
        ? (errorMessage ?? hint)
        : resolvedState === "success"
          ? (successMessage ?? hint)
          : hint;

    const hintColor =
      resolvedState === "error"
        ? "text-destructive" // --destructive: #DC2626
        : resolvedState === "success"
          ? "text-success" // --success: #16A34A
          : "text-muted-foreground"; // --muted-foreground: #868E96

    // ── Shadcn Input overrides ───────────────────────────────────────────────
    const inputStyle = cn(
      "h-full flex-1 border-0 bg-transparent py-[11px]",
      leftIcon ? "pl-[8px]" : "pl-[13px]",
      rightIcon || resolvedState === "error" || resolvedState === "success"
        ? "pr-[8px]"
        : "pr-[13px]",
      "text-[14px] font-normal text-foreground", // --foreground: #121416
      "placeholder:text-icon-disabled", // --icon-disabled: #ADB5BD
      "focus-visible:ring-0 focus-visible:outline-none",
      resolvedState === "disabled" && "cursor-not-allowed text-icon-disabled",
      className,
    );

    return (
      <div className="flex w-full flex-col gap-[5px]">
        {/* ── Label ─────────────────────────────────────────────────────── */}
        {label && (
          <div className="flex items-center gap-[2px]">
            <label className="text-[13px] font-semibold leading-[19.5px] text-foreground">
              {label}
            </label>
            {required && (
              <span className="text-[13px] font-semibold leading-[19.5px] text-destructive">
                *
              </span>
            )}
          </div>
        )}

        {/* ── Input box ─────────────────────────────────────────────────── */}
        <div className="flex h-10 w-full">
          {/* Prefix pill */}
          {prefix && (
            <div className="flex shrink-0 items-center rounded-l-md border border-r-0 border-harp-azure-89 bg-muted px-[13px]">
              <span className="text-[13px] font-normal text-muted-foreground whitespace-nowrap">
                {prefix}
              </span>
            </div>
          )}

          {/* Main Input Wrapper */}
          <div
            className={cn(
              "relative flex flex-1 items-center border border-solid overflow-hidden transition-colors",
              !prefix && "rounded-l-md",
              !suffix && "rounded-r-md",
              resolvedState === "default" &&
                "bg-background border-harp-azure-89 hover:border-icon-disabled",
              resolvedState === "error" && "bg-background border-destructive",
              resolvedState === "success" && "bg-background border-success",
              resolvedState === "disabled" && "bg-muted border-border",
              "focus-within:border-primary focus-within:shadow-[0px_0px_0px_3px_var(--ring-input)]",
            )}
          >
            {/* Left Icon */}
            {leftIcon && (
              <span
                className={cn(
                  "ml-[13px] shrink-0",
                  resolvedState === "disabled"
                    ? "text-icon-disabled"
                    : "text-muted-foreground",
                )}
              >
                {leftIcon}
              </span>
            )}

            <Input
              ref={ref}
              disabled={resolvedState === "disabled"}
              className={cn(inputStyle, "rounded-none")}
              {...props}
            />

            {/* Right icon slot */}
            {resolvedState === "error" && (
              <span className="mr-[13px] shrink-0 text-destructive">
                {rightIcon ?? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                  >
                    <path
                      d="M6.25 0C9.70187 0 12.5 2.79813 12.5 6.25C12.5 9.70187 9.70187 12.5 6.25 12.5C2.79813 12.5 0 9.70187 0 6.25C0 2.79813 2.79813 0 6.25 0ZM6.25 8.125C6.08424 8.125 5.92527 8.19085 5.80806 8.30806C5.69085 8.42527 5.625 8.58424 5.625 8.75C5.625 8.91576 5.69085 9.07473 5.80806 9.19194C5.92527 9.30915 6.08424 9.375 6.25 9.375C6.41576 9.375 6.57473 9.30915 6.69194 9.19194C6.80915 9.07473 6.875 8.91576 6.875 8.75C6.875 8.58424 6.80915 8.42527 6.69194 8.30806C6.57473 8.19085 6.41576 8.125 6.25 8.125ZM6.25 2.5C6.09692 2.50002 5.94916 2.55622 5.83477 2.65795C5.72037 2.75967 5.64729 2.89984 5.62937 3.05187L5.625 3.125V6.875C5.62518 7.0343 5.68617 7.18752 5.79553 7.30336C5.90489 7.41919 6.05435 7.4889 6.21337 7.49823C6.3724 7.50757 6.52899 7.45583 6.65115 7.35358C6.7733 7.25134 6.85181 7.10631 6.87063 6.94812L6.875 6.875V3.125C6.875 2.95924 6.80915 2.80027 6.69194 2.68306C6.57473 2.56585 6.41576 2.5 6.25 2.5Z"
                      fill="#DC2626"
                    />
                  </svg>
                )}
              </span>
            )}
            {resolvedState === "success" && (
              <span className="mr-[13px] shrink-0 text-success">
                {rightIcon ?? <CheckCircle2 className="size-[15px]" />}
              </span>
            )}
            {(resolvedState === "default" || resolvedState === "disabled") &&
              rightIcon && (
                <span className="mr-[13px] shrink-0 text-icon-disabled">
                  {rightIcon}
                </span>
              )}
          </div>

          {/* Suffix pill */}
          {suffix && (
            <div className="flex shrink-0 items-center rounded-r-md border border-l-0 border-harp-azure-89 bg-muted px-[13px]">
              <span className="text-[13px] font-normal text-muted-foreground whitespace-nowrap">
                {suffix}
              </span>
            </div>
          )}
        </div>

        {/* ── Hint / helper text ────────────────────────────────────────── */}
        {hintText && (
          <p
            className={cn("text-[12px] font-normal leading-[18px]", hintColor)}
          >
            {hintText}
          </p>
        )}
      </div>
    );
  },
);

HarpInput.displayName = "HarpInput";

export { HarpInput };
