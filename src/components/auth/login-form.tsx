/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuthInput } from "@/components/forms/auth-input";
import { loginSchema, type LoginFormData } from "@/lib/validations";
// import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { APPLICATIONS, CONSTANTS } from "@/lib";
import { useHarp } from "@/contexts/harp-context";
import { HarpButton } from "../harp-ui/harp-button";

function LoginFormContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  // const [harpApplication, setApplication] = useState<string | null>();
  const [authErr, setAuthErr] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { application, applicationUrl } = useHarp()

    const { data: session, status }: any = useSession();  

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const loginPayload = {
        ...data,
        product: application
      }
      // console.log({loginPayload})
      // const loginResp = await authClient.login(loginPayload);
      const resp = await signIn("credentials", {
        ...loginPayload,
        redirect: false,
      });
 
      if (resp?.ok) {
        // const token = session?.token;
        toast.success("Login successful.");
        // console.log({resp, token})
        setIsLoggedIn(true)
        // router.replace(`${applicationUrl!}?auth=${token}`);
      } else  if(!resp?.ok || resp?.status > 204){
        throw new Error("Login failed, email or password is incorrect.")
      }
    } catch (error: any) {
      console.log({error})
      toast.error(error?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  useEffect(() => {
    if (session?.token && isLoggedIn){
      console.log({session}, `${applicationUrl!}?auth=${session.token}`)
       router.replace(`${applicationUrl!}?auth=${session.token}`);
    }
  }, [session, isLoggedIn, applicationUrl, router])

  useEffect(() => {
    if (application &&
      application.trim() != "" &&
      APPLICATIONS.indexOf(application) > -1
    ) {

    } else {
      setAuthErr("Application not supported!")
    }
  }, [application])

  return (<>
    {authErr ? <CardContent className="space-y-6 px-8 pb-8 text-center flex-col flex justify-center items-center">
      <TriangleAlert className="h-[50px] w-[50px] text-gray-600" />
      <p className="text-2xl text-center">{authErr}</p>
      <button
      className="text-[14px] rounded-lg cursor-pointer bg-primary shadow p-3 hover:shadow-lg text-gray-100 transition-colors mt-1 flex-row flex px-5"
      aria-label="Learn more"
      onClick={()=>router.push('https://getharp.io')}
    >
     Find applications &nbsp; <Search size={"20px"}/>
    </button>
    </CardContent>
      :
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center pb-6">
          <h2 className="text-lg font-medium text-gray">
            Welcome back!
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
              {...register("email")}
              id="email"
              type="email"
              label="Email"
              placeholder="Email"
              error={errors.email?.message}
              disabled={isLoading}
            />
            <AuthInput
              {...register("password")}
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              error={errors.password?.message}
              disabled={isLoading}
            />
            {/* <Button className="w-full p-6 cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button> */}

            <HarpButton variant="primary" type="submit" isFullWidth isLoading={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </HarpButton>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading === "google"}
            >
              {socialLoading === "google" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("microsoft")}
              disabled={socialLoading === "microsoft"}
            >
              {socialLoading === "microsoft" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M11.5 2.75l-8.5 4.5v9.5c0 .55.45 1 1 1h7.5v-15z"
                    fill="#f25022"
                  />
                  <path
                    d="M20.5 2.75l-8.5 4.5v15h7.5c.55 0 1-.45 1-1v-14.5z"
                    fill="#7fba00"
                  />
                  <path
                    d="M11.5 7.25l-8.5 4.5v9.5c0 .55.45 1 1 1h7.5v-15z"
                    fill="#00a4ef"
                  />
                  <path
                    d="M20.5 7.25l-8.5 4.5v15h7.5c.55 0 1-.45 1-1v-14.5z"
                    fill="#ffb900"
                  />
                </svg>
              )}
              Microsoft
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link
              href="/auth/signup"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    }
  </>);
}

export function LoginForm() {
  return (
    <Suspense fallback={
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center pb-6">
          <h2 className="text-lg font-medium text-gray">
            Welcome back!
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
