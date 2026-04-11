"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export type SelectState = "default" | "error" | "disabled";

export interface HarpSelectOption {
  label: string;
  value: string;
}

export interface HarpSelectProps {
  label?: string;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
  state?: SelectState;
  placeholder?: string;
  options: HarpSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
const HarpSelect = React.forwardRef<HTMLButtonElement, HarpSelectProps>(
  (
    {
      label,
      required,
      hint,
      errorMessage,
      state = "default",
      placeholder = "Select an option...",
      options,
      value,
      onValueChange,
      defaultValue,
      className,
    },
    ref,
  ) => {
    const isDisabled = state === "disabled";
    const isError = state === "error";

    const hintText = isError ? (errorMessage ?? hint) : hint;
    const hintColor = isError ? "text-destructive" : "text-muted-foreground";

    // ── Trigger styles per state ─────────────────────────────────────────────
    // Default:  border-harp-azure-89, hover → border-icon-disabled
    // Open:     border-primary + ring-input shadow, bottom corners flat
    // Error:    border-destructive
    // Disabled: bg-muted, border-border, opacity-70
    const triggerClass = cn(
      "h-10 w-full px-[13px] text-[14px] font-normal text-foreground",
      "transition-colors duration-200",
      // Default
      !isError && !isDisabled && [
        "border-harp-azure-89",
        "hover:border-icon-disabled",
        "data-[state=open]:border-primary",
        "data-[state=open]:shadow-[0px_0px_0px_3px_var(--ring-input)]",
        "data-[state=open]:rounded-b-none",
      ],
      // Error
      isError && "border-destructive",
      // Disabled
      isDisabled && "bg-muted border-border opacity-70 cursor-not-allowed",
      className,
    );

    // ── Content styles ───────────────────────────────────────────────────────
    // Border continues from trigger — teal on left/right/bottom, no top border
    // Shadow from Figma: 0px 4px 6px rgba(0,0,0,0.07), 0px 2px 4px rgba(0,0,0,0.05)
    const contentClass = cn(
      "rounded-t-none border-t-0 border-primary p-0",
      "shadow-[0px_4px_6px_0px_rgba(0,0,0,0.07),0px_2px_4px_0px_rgba(0,0,0,0.05)]",
    );

    // ── Item styles ──────────────────────────────────────────────────────────
    // Unselected: #495057, 13px regular, hover teal-tinted bg
    // Selected:   #00403D, semibold, #E6EFEF bg, checkmark via shadcn
    const itemClass = cn(
      "px-[12px] py-[8px] text-[13px] font-normal leading-[19.5px] text-[#495057]",
      "cursor-pointer rounded-none",
      "focus:bg-surface-teal-soft focus:text-primary",
      "data-[state=checked]:bg-surface-teal-soft data-[state=checked]:text-primary data-[state=checked]:font-semibold",
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

        {/* ── Select ────────────────────────────────────────────────────── */}
        <Select
          value={value}
          onValueChange={onValueChange}
          defaultValue={defaultValue}
          disabled={isDisabled}
        >
          <SelectTrigger ref={ref} className={triggerClass}>
            <SelectValue
              placeholder={
                <span className="text-icon-disabled">{placeholder}</span>
              }
            />
          </SelectTrigger>

          <SelectContent className={contentClass}>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className={itemClass}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ── Hint / error text ─────────────────────────────────────────── */}
        {hintText && (
          <p className={cn("text-[12px] font-normal leading-[18px]", hintColor)}>
            {hintText}
          </p>
        )}
      </div>
    );
  },
);

HarpSelect.displayName = "HarpSelect";

export { HarpSelect };