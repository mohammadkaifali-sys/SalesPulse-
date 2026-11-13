import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (request.auth) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/((?!api/auth|login|signup|_next/static|_next/image|favicon.ico).*)",
  ],
};
