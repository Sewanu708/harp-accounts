"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { harpToast as toast } from "@/lib/toast";
import { Eye, EyeOff } from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { HarpInput } from "@/components/harp-ui/input";
import { HarpButton } from "@/components/harp-ui/harp-button";
import { setPasswordSchema } from "@/lib/validations";
import PasswordUpdatedView from "./success";

type FormValues = z.infer<typeof setPasswordSchema>;

interface ResetPasswordFormV2Props {
  token: string;
}

export function ResetPasswordFormV2({ token }: ResetPasswordFormV2Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(setPasswordSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await apiClient.setNewPassword(data.password, token);

      if (response.success) {
        setIsSuccess(true);
      } else {
        toast.error(response.error || "Something went wrong. Try again.");
      }
    } catch {
      toast.error("Failed to update password. Please try again.");
    }
  };

  if (isSuccess) {
    return <PasswordUpdatedView />;
  }

  return (
    <div className="flex w-full max-w-[477px] flex-col items-center gap-[38px]">
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-[6px] text-center tracking-[-0.5px]">
        <h1 className="text-[28px] font-bold leading-[30.8px] text-foreground-strong">
          Create New Password
        </h1>
        <p className="w-full max-w-[411px] text-[16px] font-medium text-foreground-subtle">
          Login to access your Harp account and manage your customers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-[384px] flex-col gap-[18px]"
        noValidate
      >
        <div className="flex flex-col gap-[24px]">
          {/* New password */}
          <HarpInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="New Password"
            required
            placeholder="Min. 8 Characters"
            state={errors.password ? "error" : "default"}
            errorMessage={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-icon-disabled transition-colors hover:text-foreground"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-[18px]" />
                ) : (
                  <Eye className="size-[18px]" />
                )}
              </button>
            }
            {...register("password")}
          />

          {/* Confirm password */}
          <HarpInput
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            required
            placeholder="Confirm Password"
            state={errors.confirmPassword ? "error" : "default"}
            errorMessage={errors.confirmPassword?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="text-icon-disabled transition-colors hover:text-foreground"
                tabIndex={-1}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-[18px]" />
                ) : (
                  <Eye className="size-[18px]" />
                )}
              </button>
            }
            {...register("confirmPassword")}
          />
        </div>

        <HarpButton
          type="submit"
          variant="primary"
          size="md"
          isFullWidth
          isLoading={isSubmitting}
        >
          Update Password
        </HarpButton>
      </form>
    </div>
  );
}
