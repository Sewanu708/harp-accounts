"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { harpToast as toast } from "@/lib/toast";
import { Loader2, TriangleAlert, Search } from "lucide-react";

import { signupSchema, type SignupFormData } from "@/lib/validations";
import { apiClient } from "@/lib/api-client";
import { APPLICATIONS } from "@/lib";
import { useHarp } from "@/contexts/harp-context";
import { HarpInput } from "../../harp-ui/input";
import { HarpButton } from "../../harp-ui/harp-button";
import { GoogleIcon, MicrosoftIcon } from "@/lib/logo";
import { OAuthButton } from "@/lib/utils";


function RegisterFormContent({
  onSuccess,
}: {
  onSuccess?: (email: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authErr, setAuthErr] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { application, applicationUrl } = useHarp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (application?.trim() && APPLICATIONS.indexOf(application) > -1) {
      setAuthErr(null);
    } else {
      setAuthErr("Application not supported!");
    }
  }, [application]);

  // ── Auto-verify if ?token= param is present ───────────────────────────────
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
            response.error || "Invalid or expired verification link.",
          );
        }
      } catch {
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
        applicationUrl: applicationUrl!,
      });

      if (response.success) {
        onSuccess?.(data.email);
        toast.success("Verification link sent. Check your email.");
      } else {
        toast.error(response.error || "Something went wrong.");
      }
    } catch {
      toast.error("Failed to send verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center gap-[38px] w-full max-w-[477px]">
        <div className="flex items-center gap-[8px] text-[16px] text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Verifying your email...</span>
        </div>
      </div>
    );
  }

  if (authErr) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-[24px] mx-auto py-12">
        <TriangleAlert className="size-[50px] text-destructive" />
        <h1 className="text-[24px] sm:text-[28px] font-bold leading-[30.8px] text-foreground text-center">
          {authErr}
        </h1>
        <p className="w-full max-w-[411px] text-[14px] sm:text-[16px] font-medium text-harp-grey-31 px-2 text-center">
          The application you are trying to access is not supported. Please
          check the URL or discover our applications.
        </p>
        <HarpButton
          variant="primary"
          onClick={() => router.push("https://getharp.io")}
          className="mt-2"
          rightIcon={<Search className="ml-2 size-[20px]" />}
        >
          Find applications
        </HarpButton>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[477px] flex-col items-center gap-[38px]">
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-[6px] text-center tracking-[-0.5px]">
        <h1 className="text-[28px] font-bold leading-[30.8px] text-foreground">
          Create your free account
        </h1>
        <p className="w-full max-w-[411px] text-[16px] font-medium text-harp-grey-31">
          Give your team only tool they'll need to keep your customers happy.
        </p>
      </div>

      <div className="flex flex-col items-center gap-[12px] w-full">
        <div className="flex w-full max-w-[384px] flex-col gap-[38px]">
          <div className="flex flex-col gap-[14px]">
            <OAuthButton
              label="Continue with Google"
              icon={<GoogleIcon />}
              onClick={() => {
                /* TODO: Google OAuth */
              }}
            />
            <OAuthButton
              label="Continue with Microsoft"
              icon={<MicrosoftIcon />}
              onClick={() => {
                /* TODO: Microsoft OAuth */
              }}
            />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-[24px]"
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
            />

            <HarpButton
              type="submit"
              variant="primary"
              size="md"
              isFullWidth
              isLoading={isLoading}
              disabled={!!authErr}
            >
              Verify Email
            </HarpButton>
          </form>
        </div>

        <p className="w-full max-w-[335px] text-center text-[12px] font-normal leading-[18px] text-harp-grey-31">
          By creating an account, you agree to our{" "}
          <Link
            href="/legal/terms"
            className="underline underline-offset-2 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy"
            className="underline underline-offset-2 hover:text-primary"
          >
            Privacy Policy.
          </Link>
        </p>
      </div>
    </div>
  );
}
export default RegisterFormContent;
