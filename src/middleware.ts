import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const product = searchParams.get("i");

  const response = NextResponse.next();

  if (product) {
    // Persist product context in a cookie so billing pages don't need ?i= in every URL
    // response.cookies.set("harp-product", product, {
    //   path: "/",
    //   httpOnly: false, // must be readable client-side by HarpContext
    //   sameSite: "lax",
    //   maxAge: 60 * 60 * 24, // 24 hours
    // });
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
