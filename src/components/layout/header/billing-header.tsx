"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { HarpLogoDark } from "@/lib/logo";
import { useHarp } from "@/contexts/harp-context";

import { ArrowLeft } from "lucide-react";

interface BillingHeaderProps {
  className?: string;
}

const APP_NAMES: Record<string, string> = {
  "harp-messaging": "Harp Messaging",
  "harp-engage": "Harp Engage",
};

export default function BillingHeader({ className }: BillingHeaderProps) {
  const { data: session } = useSession();
  const { application, applicationUrl } = useHarp();

  const appName = application ? (APP_NAMES[application] || application) : null;

  return (
    <header
      className={cn(
        "flex w-full items-center justify-between bg-primary px-4 sm:px-[40px] py-[14px]",
        className
      )}
    >
      <div className="flex items-center gap-4 sm:gap-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <HarpLogoDark className="w-[71px] h-[27px]" />
        </Link>

        {/* Back to App Link */}
        {applicationUrl && (
          <Link
            href={applicationUrl}
            className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Back to {appName || "Application"}</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-[40px]">
        {/* Support link */}
        <Link
          href="/support"
          className="flex items-center gap-[6px] text-[14px] sm:text-[16px] font-medium tracking-[-0.5px] text-white transition-opacity hover:opacity-80"
        >
          <Image src={'/question_fill.svg'} alt="question mark" width={20} height={20}/>
          <span className="hidden xs:inline sm:inline">Support</span>
        </Link>

        {/* User Info / Identity */}
        {session?.user && (
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-medium text-white/70">Logged in as</span>
                <span className="text-sm font-semibold text-white truncate max-w-[150px]">
                  {session.user.email}
                </span>
             </div>
             {/* Simple Avatar placeholder if needed, or just email */}
          </div>
        )}
      </div>
    </header>
  );
}
