/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/validations";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/forms/auth-input";
import { useHarp } from "@/contexts/harp-context";
import { APPLICATIONS } from "@/lib";

function SignupFormContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authErr, setAuthErr] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { application, applicationUrl } = useHarp()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      setIsVerifying(true);
      try {
        const response = await apiClient.verifyEmail(token);
        if (response.success) {
          router.push(`/auth/set-password?token=${token}`);
        } else {
          toast.error(
            response.error || "Invalid or expired verification link."
          );
        }
      } catch (error) {
        toast.error("Verification failed. Try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, router]);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.signup({
        email: data.email,
        product: application!,
        redirect: `${window.location.origin}`,
        applicationUrl:applicationUrl!
      });

      if (response.success) {
        toast.success("Verification link sent. Check your email.");
      } else {
        toast.error(response.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to send verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (application &&
      application.trim() != "" &&
      APPLICATIONS.indexOf(application) > -1
    ) {
    } else {
      setAuthErr("Application not supported!")
    }
  }, [application])

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center">
        <h2 className="text-lg font-bold">Let&apos;s get started!</h2>
      </CardHeader>
      <CardContent>
        {isVerifying ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Verifying your email...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {authErr && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {authErr}
              </div>
            )}
            
            <AuthInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !!authErr}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending verification...
                </>
              ) : (
                "Send verification email"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function SignupForm() {
  return (
    <Suspense fallback={
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center">
          <h2 className="text-lg font-bold">Let&apos;s get started!</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    }>
      <SignupFormContent />
    </Suspense>
  );
}
