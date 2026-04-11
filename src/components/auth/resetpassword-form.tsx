"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { AuthInput } from "../forms/auth-input";
import { useForm } from "react-hook-form";

type ResetPasswordFormProps = {
  title?: string;
  onSubmit: (data: { password: string; confirmPassword: string }) => void;
  isLoading?: boolean;
};

export default function ResetPasswordForm({
  onSubmit,
  isLoading = false,
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pb-6">
        <h2 className="text-lg font-medium text-gray">Reset your password</h2>
        <p className="text-sm font-light text-gray">
          Enter a new password to secure your account
        </p>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            {...register("password")}
            id="password"
            type="password"
            label="New Password"
            placeholder="New Password"
            className="mb-6"
            error={errors.password?.message}
            disabled={isLoading}
          />
          <AuthInput
            {...register("confirmPassword")}
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            className="mb-6"
            error={errors.confirmPassword?.message}
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="w-full auth-button auth-button-primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
