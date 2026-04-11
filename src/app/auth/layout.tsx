"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { HarpLogoLight, HarpLogoDark } from "@/lib/logo";

function ThemeSwitchButton() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className="rounded-full bg-gray-100 shadow p-2 hover:bg-gray-200 transition-colors"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    // <div className="h-screen w-screen flex flex-col justify-center items-center relative">
    //   {/* Centered Card */}
    //   {isClient ? (
    //     <div className="w-full max-w-md rounded-xl shadow-lg p-8 flex flex-col items-center bg-card">
    //       {/* Logo */}
    //       {/* <div className="mb-6" >
    //       <span className="block mx-auto mb-2"> */}
    //       {/* Inline SVG logo */}
    //       {/* {theme === "light" ? <HarpLogoLight /> : <HarpLogoDark />}
    //       </span>
    //     </div>  */}
    //       {/* Slot for form content */}
    //       <div className="w-full"> {children}</div>
    //     </div>
    //   ) : (
    //     <Skeleton />
    //   )}
    //   {/* Floating Theme Switcher */}
    //   {/* <div className="fixed bottom-6 right-6 z-50" >
    //     <ThemeSwitchButton />
    //   </div> */}
    //   {children}
    // </div>
    <div>{children}</div>
  );
}
