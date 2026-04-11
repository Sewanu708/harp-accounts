"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeaderV2 from "@/components/layout/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center relative">
        <Skeleton className="h-[400px] w-full max-w-[400px]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-white">
      <HeaderV2 />
      <main className="flex flex-1 items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-[477px]">
          {children}
        </div>
      </main>
    </div>
  );
}
