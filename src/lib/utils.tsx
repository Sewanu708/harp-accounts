import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Mail } from "lucide-react";
import { GmailIcon, GoogleIcon, OutlookIcon } from "@/lib/logo";
import { HarpButton } from "@/components/harp-ui/harp-button";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type SetPasswordMode = "setup" | "reset";
export const MODE_CONFIG: Record<
  SetPasswordMode,
  {
    heading: string;
    subtitle: string;
    buttonLabel: string;
    redirectTo: string;
  }
> = {
  setup: {
    heading: "Create New Password",
    subtitle: "You're almost there. Set a password to secure your account.",
    buttonLabel: "Continue",
    redirectTo: "/onboarding/company",
  },
  reset: {
    heading: "Create New Password",
    subtitle: "Login to access your Harp account and manage your customers.",
    buttonLabel: "Update Password",
    redirectTo: "/auth/login",
  },
};


interface EmailProvider {
  label: string;
  url: string;
  icon: React.ReactNode;
}

const EMAIL_PROVIDERS: Record<string, EmailProvider> = {
  // Gmail
  "gmail.com": {
    label: "Open Gmail",
    url: "https://mail.google.com",
    icon: <GmailIcon />,
  },
  // Outlook / Microsoft
  "outlook.com": {
    label: "Open Outlook",
    url: "https://outlook.live.com",
    icon: <OutlookIcon />,
  },
  "hotmail.com": {
    label: "Open Outlook",
    url: "https://outlook.live.com",
    icon: <OutlookIcon />,
  },
  "live.com": {
    label: "Open Outlook",
    url: "https://outlook.live.com",
    icon: <OutlookIcon />,
  },
  "msn.com": {
    label: "Open Outlook",
    url: "https://outlook.live.com",
    icon: <OutlookIcon />,
  },
};

// Fallback — no recognised provider, show a generic "Open inbox" button
const FALLBACK_PROVIDER: EmailProvider = {
  label: "Open Inbox",
  url: "https://mail.google.com",
  icon: <Mail className="size-[24px]" />,
};

export function getEmailProvider(email: string): EmailProvider {
  const domain = email.split("@")[1]?.toLowerCase();
  return EMAIL_PROVIDERS[domain] ?? FALLBACK_PROVIDER;
}


interface OAuthButtonProps {
  icon: React.ReactNode;
  label: string;
  isLoading?:boolean,
  onClick?: () => void;
}

export  function OAuthButton({ icon, label, onClick , isLoading}: OAuthButtonProps) {
  return (
    <HarpButton
      type="button"
      variant="secondary"
      size="md"
      isFullWidth
      leftIcon={icon}
      onClick={onClick}
      isLoading={isLoading}
    >
      {label}
    </HarpButton>
  );
}



export function formatDate(dateString: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const currencyFormatters: CurrencyFormatters = {
  USD: (value: number) => `$${value.toLocaleString("en-US")}`,
  GHS: (value: number) => `GHS${value.toLocaleString("en-US")}`,
  EUR: (value: number) => `€${value.toLocaleString("en-US")}`,
  GBP: (value: number) => `£${value.toLocaleString("en-US")}`,
  NGN: (value: number) => `₦${value.toLocaleString("en-US")}`,
};

export type CurrencyFormatters = {
  USD: (value: number) => string;
  GHS: (value: number) => string;
  EUR: (value: number) => string;
  GBP: (value: number) => string;
  NGN: (value: number) => string;
};

export const handleQueryParams = (
  params: Record<string, string | boolean | string[]>,
) => {
  const b = Object.entries(params).map((entry) => {
    if (Array.isArray(entry[1])) {
      const a = entry[1].map((element) => {
        return `${entry[0]}=${element}`;
      });
      return a;
    }
    return `${entry[0]}=${entry[1]}`;
  });

  return b.join("&");
};