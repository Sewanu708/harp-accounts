"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { harpToast as toast } from "@/lib/toast";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations";
import { apiClient } from "@/lib/api-client";
import { HarpInput } from "../../../harp-ui/input";
import { HarpButton } from "../../../harp-ui/harp-button";
import { EmailSentIcon } from "@/lib/logo";

export default function ForgotPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setEmail(data.email);
    try {
      const response = await apiClient.resetPassword(data.email);

      if (response.success) {
        setIsSuccess(true);
        toast.success("Reset link sent. Check your email.");
      } else {
        toast.error(response.error || "Something went wrong.");
      }
    } catch {
      toast.error("Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      const response = await apiClient.resetPassword(email);
      if (response.success) {
        toast.success("Reset link resent successfully.");
      } else {
        toast.error(response.error || "Failed to resend reset link.");
      }
    } catch {
      toast.error("Failed to resend reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex w-full max-w-[477px] flex-col items-center gap-[38px]">
        {/* ── Icon and Heading ───────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-[24px] w-full">
          <EmailSentIcon className="w-[91px] h-[91px]" />
          <div className="flex flex-col items-center gap-[6px] text-center tracking-[-0.5px]">
            <h1 className="text-[28px] font-bold leading-[30.8px] text-foreground-strong">
              Check your email
            </h1>
            <p className="w-full max-w-[393px] text-[16px] font-medium text-harp-grey-31">
              We've sent a password reset link to{" "}
              <span className="text-foreground">{email}</span>
            </p>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex w-full max-w-[384px] flex-col items-center">
          <HarpButton
            variant="secondary"
            size="md"
            isFullWidth
            onClick={handleResend}
            isLoading={isLoading}
          >
            Resend email
          </HarpButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[477px] flex-col items-center gap-[38px]">
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-[6px] text-center tracking-[-0.5px]">
        <h1 className="text-[28px] font-bold leading-[30.8px] text-foreground">
          Reset your password
        </h1>
        <p className="w-full max-w-[411px] text-[16px] font-medium text-harp-grey-31">
          Enter the email associated with your account and we'll send you a
          password reset link.
        </p>
      </div>

      {/* ── Form section ────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center relative w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-[384px] flex-col gap-[18px]"
          noValidate
        >
          <HarpInput
            id="email"
            type="email"
            label="Email Address"
            required
            placeholder="Enter your email address"
            state={errors.email ? "error" : "default"}
            errorMessage={errors.email?.message}
            {...register("email")}
            disabled={isLoading}
          />

          <HarpButton
            type="submit"
            variant="primary"
            size="md"
            isFullWidth
            isLoading={isLoading}
          >
            Send Reset Link
          </HarpButton>
        </form>
      </div>
    </div>
  );
}
