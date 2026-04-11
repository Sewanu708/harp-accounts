"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface HarpToastProps {
  id: string | number
  title: string
  description?: string
  variant?: "success" | "error" | "info" | "warning"
}

/**
 * HarpToast Component
 * 
 * Implements the Figma spec for toasts:
 * - 4px left border matching the variant color
 * - 1px border on other sides
 * - DM Sans 13px SemiBold for titles
 * - DM Sans 12px Regular for descriptions
 * - Custom shadows and spacing
 */
export const HarpToast = ({ id, title, description, variant = "success" }: HarpToastProps) => {
  const variants = {
    success: {
      icon: <CheckCircle2 className="size-5 text-success" />,
      border: "border-l-success",
    },
    error: {
      icon: <AlertCircle className="size-5 text-destructive" />,
      border: "border-l-destructive",
    },
    warning: {
      icon: <AlertTriangle className="size-5 text-accent" />,
      border: "border-l-accent",
    },
    info: {
      icon: <Info className="size-5 text-info" />,
      border: "border-l-info",
    },
  }

  const { icon, border } = variants[variant]

  return (
    <div 
      className={cn(
        "flex w-full min-w-[320px] max-w-[420px] gap-3 rounded-lg border border-border bg-background p-4 shadow-lg transition-all duration-300",
        border,
        "border-l-4"
      )}
      role="alert"
    >
      <div className="mt-0.5 shrink-0" aria-hidden="true">
        {icon}
      </div>
      
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-[13px] font-semibold leading-tight text-foreground-strong">
          {title}
        </h3>
        {description && (
          <p className="text-[12px] leading-normal text-foreground-subtle">
            {description}
          </p>
        )}
      </div>

      <button 
        onClick={() => toast.dismiss(id)}
        className="ml-1 shrink-0 text-muted-foreground transition-colors hover:text-foreground-strong focus:outline-none"
        aria-label="Close notification"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
