/* eslint-disable react-hooks/exhaustive-deps */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Card, CardHeader } from "../ui/card";
import { useHarp } from "@/contexts/harp-context";

function VerifyEmailPageContent({ email }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(".");
  const [showResendButton, setShowResendButton] = useState(false);
  const [resending, setResending] = useState(false);

   const { application, applicationUrl } = useHarp()

  const verifyEmail = async () => {
    try {
     
      await apiClient.verifyEmail(token!);
      toast.success("Email verified successfully");
      router.push(`/auth/set-password?token=${token}&u=${email}&i=${application}&r=${applicationUrl}`);
    } catch (error: any) {
      toast.error(error.message || "Verification failed or expired.");
      setShowResendButton(true);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { 
    if ( hasRun && hasRun.length > 2){
      verifyEmail();
    }
    
    setLoading(true);
    if (token) { 
      console.log("Verify")
      setHasRun("true");
    }
  }, [token, hasRun, verifyEmail]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email for resending verification.");
      return;
    }

    setResending(true);
    try {
      await apiClient.resendVerification({ identifier: email, type: "email" });
      toast.success("Verification email resent successfully!");
      setShowResendButton(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="border-0 shadow-none text-center">
       {loading && (
        <div className="flex w-full flex-col items-center space-x-2">
          <Loader2 className="w-20 h-20 animate-spin color-brand" />
          {/* <p className="text-sm">Verifying your email...</p> */}
        </div>
      )}

      <CardHeader className="text-center pb-6">
        <h2 className="text-lg font-medium text-gray">Verify your Email</h2>
      </CardHeader>
     

      {showResendButton && (
        <button
          onClick={handleResend}
          disabled={resending}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {resending ? "Resending..." : "Resend Verification Link"}
        </button>
      )}
    </Card>
  );
}

export default function VerifyEmailPage({ email }: any) {
  return (
    <Suspense fallback={
      <Card className="border-0 shadow-none text-center">
        <CardHeader className="text-center pb-6">
          <h2 className="text-lg font-medium text-gray">Verify your Email</h2>
        </CardHeader>
        <div className="flex w-full flex-col items-center space-x-2">
          <Loader2 className="w-20 h-20 animate-spin color-brand" />
        </div>
      </Card>
    }>
      <VerifyEmailPageContent email={email} />
    </Suspense>
  );
}
