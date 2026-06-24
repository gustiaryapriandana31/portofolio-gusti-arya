import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("session_token");
  const isAuthenticated = tokenCookie?.value === "authenticated_porto_admin_session_2026";

  // 1. Protect dashboard pages
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      // Redirect to login page
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // 2. Prevent accessing login page if already authenticated
  if (pathname === "/login") {
    if (isAuthenticated) {
      // Redirect to dashboard page
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Config to specify matching routes
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
