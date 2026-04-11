"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { HarpLogoDark } from "@/lib/logo";
import { useHarp } from "@/contexts/harp-context";

// ─── App name mapping ─────────────────────────────────────────────────────────
const APP_NAMES: Record<string, string> = {
  "harp-messaging": "Harp Messaging",
  "harp-engage": "Harp Engage",
};

// ─── Route-based CTA config ───────────────────────────────────────────────────
// Each auth route shows a different prompt + link in the header
const AUTH_CTA: Record<
  string,
  { prompt: string; label: string; href: string }
> = {
  "/auth/login": {
    prompt: "Don't have an account?",
    label: "Create account",
    href: "/auth/signup",
  },
  "/auth/signup": {
    prompt: "Already have an account?",
    label: "Login",
    href: "/auth/login",
  },
  "/authV2/login": {
    prompt: "Don't have an account?",
    label: "Create account",
    href: "/authV2/signup",
  },
  "/authV2/signup": {
    prompt: "Already have an account?",
    label: "Login",
    href: "/authV2/login",
  },
  "/authV2/forgot-password": {
    prompt: "Don't have an account?",
    label: "Create account",
    href: "/authV2/signup",
  },
  "/authV2/reset-password": {
    prompt: "Don't have an account?",
    label: "Create account",
    href: "/authV2/signup",
  },
  "/authV2/set-password": {
    prompt: "Already have an account?",
    label: "Login",
    href: "/authV2/login",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface HeaderV2Props {
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
function HeaderV2({ className }: HeaderV2Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { application } = useHarp();

  const appName = application ? (APP_NAMES[application] || application) : null;

  // Match exact route or fall back to register CTA as default
  const cta = AUTH_CTA[pathname] ?? AUTH_CTA["/authV2/signup"];
  
  // Append current search params to the link
  const linkWithParams = `${cta.href}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

  return (
    <header
      className={cn(
        "flex w-full items-center justify-between bg-primary px-4 sm:px-[40px] py-[14px]",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <Link href={`/${searchParams.toString() ? '?' + searchParams.toString() : ''}`} className="shrink-0">
          <HarpLogoDark className="w-[71px] h-[27px]" />
        </Link>
        {appName && (
          <div className="hidden sm:block h-[18px] w-px bg-white/30 mx-2" />
        )}
        {appName && <span className="hidden sm:inline text-white text-[15px] font-medium tracking-[-0.5px]">{appName}</span>}
      </div>

      {/* ── Right section ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 sm:gap-[40px]">
        {/* Support link */}
        <Link
          href="/support"
          className="flex items-center gap-[6px] text-[14px] sm:text-[16px] font-medium tracking-[-0.5px] text-white transition-opacity hover:opacity-80"
        >
          <Image src={'/question_fill.svg'} alt="question mark" width={20} height={20}/>
          <span className="hidden xs:inline sm:inline">Support</span>
        </Link>

        {/* Route-based auth CTA */}
        <div className="flex items-center gap-[6px] text-[14px] sm:text-[16px] font-medium tracking-[-0.5px]">
          <span className="hidden md:inline text-white">{cta.prompt}</span>
          <Link
            href={linkWithParams}
            className="text-[#DC8B1A] transition-opacity hover:opacity-80 whitespace-nowrap"
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default HeaderV2;
