/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { AuthInput } from "../forms/auth-input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useHarp } from "@/contexts/harp-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = {
  password: string;
  confirmPassword: string;
};

type SetPasswordFormProps = {
  token: string;
  email: string;
};

export default function SetPasswordForm({ token, email }: SetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
    const { application, applicationUrl } = useHarp()

  const onSubmit = async ({ password, confirmPassword }: FormData) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.setPassword({ token, password });
      console.log({ response, email })
      if (response?.success == true) {
        toast.success("Password set successfully. Just one more step.");
        router.push(`/auth/kyc?i=${application}&r=${applicationUrl}`);
        const loginPayload = {
          email: atob(email as string),
          password,
          product: application
        }
        // console.log({loginPayload})
        // const loginResp = await authClient.login(loginPayload);
        const resp = await signIn("credentials", {
          ...loginPayload,
          redirect: false,
        });
        console.log(resp)
      } else {
        throw new Error("No token returned");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to set password");
      router.push("/auth/signup");
    } finally {
      setIsLoading(false);
      // Navigate to the next page
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pb-6">
        <h2 className="text-lg font-medium text-gray">Set your password</h2>
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
