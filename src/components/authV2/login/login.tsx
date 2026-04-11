"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { harpToast as toast } from "@/lib/toast";
import { Eye, EyeOff, Loader2, TriangleAlert, Search } from "lucide-react";

import { loginSchema, type LoginFormData } from "@/lib/validations";
import { APPLICATIONS } from "@/lib";
import { useHarp } from "@/contexts/harp-context";
import { HarpInput } from "../../harp-ui/input";
import { HarpButton } from "../../harp-ui/harp-button";
import { GoogleIcon, MicrosoftIcon } from "@/lib/logo";
import { OAuthButton } from "@/lib/utils";

// ─── Main Login Component ─────────────────────────────────────────────────────
export default function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [authErr, setAuthErr] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { application, applicationUrl } = useHarp();
  const { data: session }: any = useSession();

  const callbackUrl = searchParams.get("callbackUrl");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // ── Validate application on mount ─────────────────────────────────────────
  useEffect(() => {
    if (application?.trim() && APPLICATIONS.indexOf(application) > -1) {
      setAuthErr(null);
    } else {
      setAuthErr("Application not supported!");
    }
  }, [application]);

  // ── Redirect after successful login ───────────────────────────────────────
  useEffect(() => {
    if (session?.token && isLoggedIn) {
      console.log(session, applicationUrl, callbackUrl);
      if (callbackUrl) {
        router.replace(callbackUrl);
      } else {
        router.replace(`${applicationUrl!}?auth=${session.token}`);
      }
      console.log({ session }, `${applicationUrl!}?auth=${session.token}`);
    }
  }, [session, isLoggedIn, applicationUrl, router]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const loginPayload = {
        ...data,
        product: application,
      };

      const resp = await signIn("credentials", {
        ...loginPayload,
        redirect: false,
      });

      if (resp?.ok) {
        toast.success(
          "Login successful.",
          `Redirecting to ${application ?? "dashboard"}`,
        );
        setIsLoggedIn(true);
      } else if (!resp?.ok || resp?.status > 204) {
        throw new Error("Login failed, email or password is incorrect.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider);
    try {
      await signIn(provider);
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

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
    <div className="flex w-full flex-col items-center gap-[38px] mx-auto">
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-[6px] text-center tracking-[-0.5px] w-full">
        <h1 className="text-[24px] sm:text-[28px] font-bold leading-[30.8px] text-foreground">
          Welcome back!
        </h1>
        <p className="w-full max-w-[411px] text-[14px] sm:text-[16px] font-medium text-harp-grey-31 px-2">
          Login to access your Harp account and manage your customers.
        </p>
      </div>

      {/* ── Form section ────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-[12px] w-full">
        <div className="flex w-full max-w-[384px] flex-col gap-[32px] sm:gap-[38px]">
          {/* ── OAuth buttons ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-[14px]">
            <OAuthButton
              label="Continue with Google"
              icon={<GoogleIcon />}
              onClick={() => handleSocialLogin("google")}
              isLoading={socialLoading === "google"}
            />
            <OAuthButton
              label="Continue with Microsoft"
              icon={<MicrosoftIcon />}
              onClick={() => handleSocialLogin("microsoft")}
              isLoading={socialLoading === "microsoft"}
            />
          </div>

          {/* ── Email & Password form ──────────────────────────────────── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-[18px]"
            noValidate
          >
            <div className="flex flex-col gap-[24px]">
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

              <div className="flex flex-col gap-[18px]">
                <HarpInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  required
                  placeholder="Min. 8 Characters"
                  state={errors.password ? "error" : "default"}
                  errorMessage={errors.password?.message}
                  {...register("password")}
                  disabled={isLoading}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  }
                />

                <Link
                  href="/authV2/forgot-password"
                  className="text-[14px] sm:text-[16px] font-medium tracking-[-0.5px] text-foreground hover:underline"
                >
                  Forget password?
                </Link>
              </div>
            </div>

            <HarpButton
              type="submit"
              variant="primary"
              size="md"
              isFullWidth
              isLoading={isLoading}
              disabled={!!authErr}
            >
              Login
            </HarpButton>
          </form>
        </div>

        {/* ── Legal copy ──────────────────────────────────────────────── */}
        <p className="w-full max-w-[335px] text-center text-[12px] font-normal leading-[18px] text-harp-grey-31 px-4">
          By signing in, you agree to our{" "}
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
