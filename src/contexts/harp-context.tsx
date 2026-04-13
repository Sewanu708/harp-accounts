"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  Suspense,
  SetStateAction,
  Dispatch,
} from "react";

interface BillingContext {
  planId: string | null;
  type: "create" | "upgrade";
  currency: "NGN" | "USD";
}
export interface IHarpContext {
  application?: string | null;
  setApplication: (appName: string) => void;
  applicationUrl?: string | null;
  setApplicationUrl: (appName: string) => void;
  billingContext: BillingContext;
  setBillingContext: Dispatch<SetStateAction<BillingContext>>;
}

export const HarpContext = createContext<IHarpContext>({} as any);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function HarpProviderContent({ children }: any) {
  const searchParams = useSearchParams();

  const harpApplication = searchParams.get("i") || getCookie("harp-product");
  const harpRedirect = searchParams.get("r");
  const billingPlanId = searchParams.get("pd");
  const billingType = searchParams.get("bt") as "create" | "upgrade";
  const billingCurrency = searchParams.get("bc") as "NGN" | "USD";

  const [application, setApplication] = useState<string | null>(
    harpApplication,
  );
  const [applicationUrl, setApplicationUrl] = useState<string | null>(
    harpRedirect,
  );

  const [billingContext, setBillingContext] = useState<BillingContext>({
    planId: billingPlanId,
    type: billingType ?? "create",
    currency: billingCurrency ?? "NGN",
  });

  const contextValue: IHarpContext = {
    application,
    setApplication,
    applicationUrl,
    setApplicationUrl,
    billingContext,
    setBillingContext,
  };

  return (
    <HarpContext.Provider value={contextValue}>{children}</HarpContext.Provider>
  );
}

export const HarpProvider = ({ children }: any) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HarpProviderContent>{children}</HarpProviderContent>
    </Suspense>
  );
};

export function useHarp() {
  return useContext(HarpContext);
}
