import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
