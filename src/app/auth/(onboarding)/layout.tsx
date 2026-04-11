"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarV2 } from "@/components/layout/sidebar";

export default function OnboardingLayoutV2({
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
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row relative bg-white">
      {/* Fixed Sidebar */}
      <div className="hidden md:block">
        <SidebarV2 />
      </div>

      {/* Main Content Area */}
      <div className="md:ml-[265px] flex flex-1 flex-col h-full overflow-y-auto w-full">
        <main className="flex flex-1 flex-col px-6 sm:px-12 md:px-[48px] py-10 md:py-[74px] max-w-[1000px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
