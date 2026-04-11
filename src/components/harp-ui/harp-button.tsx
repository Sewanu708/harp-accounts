"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Harp Button Variants based on Figma Component Specs
 * Maps Figma-specific variants and sizes to Tailwind classes defined in globals.css
 */
const harpButtonVariants = cva(
  // FIX 2: active:scale-95 → active:scale-[0.97] (matches Figma motion spec exactly)
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-semibold tracking-tight transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-[3px] hover:cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover focus-visible:ring-ring-primary",
        // FIX 1: border-border → border-primary
        // Figma shows #00403D (brand teal) border on secondary, not grey
        secondary:
          "border border-primary bg-secondary text-secondary-foreground shadow-xs hover:bg-muted focus-visible:ring-ring-primary",
        ghost: "bg-transparent border-transparent text-foreground hover:bg-[var(--ghost-hover)] shadow-[var(--shadow-btn-secondary-default)] hover:shadow-[var(--shadow-btn-secondary-hover)] active:bg-[var(--ghost-active)] disabled:text-[#ADB5BD] focus-visible:ring-ring-primary",
        danger:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover focus-visible:ring-ring-danger",
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover focus-visible:ring-ring-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-2.5 text-[12px] rounded-xs",
        sm: "h-8 px-3.5 text-[13px] rounded-xs",
        md: "h-10 px-4.5 text-[14px] rounded-md",
        lg: "h-12 px-5.5 text-[15px] rounded-lg",
        xl: "h-14 px-7 text-[16px] rounded-lg",
      },
      pill: {
        true: "rounded-pill",
      },
      isFullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      pill: false,
      isFullWidth: false,
    },
  },
);

export interface HarpButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof harpButtonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const HarpButton = React.forwardRef<HTMLButtonElement, HarpButtonProps>(
  (
    {
      className,
      variant,
      size,
      pill,
      isFullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        asChild={asChild}
        disabled={disabled}
        aria-busy={isLoading}
        className={cn(
          harpButtonVariants({ variant, size, pill, isFullWidth }),
          isLoading && "pointer-events-none", 
          className,
        )}
        {...props}
      >
        {leftIcon && !isLoading && (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span
          className={cn("relative inline-flex items-center justify-center")}
        >
          {isLoading && (
            <Loader2
              className="animate-spinner size-4 absolute"
              aria-hidden="true"
            />
          )}
          <span className={cn(isLoading && "opacity-60")}>{children}</span>
        </span>
        {rightIcon && !isLoading && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </Button>
    );
  },
);

HarpButton.displayName = "HarpButton";

export { HarpButton, harpButtonVariants };
