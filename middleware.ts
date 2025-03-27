import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Get the session token from cookies
  const token = req.cookies.get("token")?.value;

  // Define protected routes
  const protectedRoutes = ["/journal", "/dashboard", "/settings"];

  // Check if the current request URL is a protected route
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/journal/:path*", "/dashboard/:path*", "/settings/:path*"],
};