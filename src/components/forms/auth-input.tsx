import type React from "react"
import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  showLabel?: boolean
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, showLabel = false, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {showLabel && (
          <Label htmlFor={props.id} className="text-sm font-medium text-gray-700">
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          className={cn("auth-input", "p-2 px-3 h-[50px]", error && "border-red-500 focus:ring-red-500", className)}
          aria-label={!showLabel ? label : undefined}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    )
  },
)

AuthInput.displayName = "AuthInput"
