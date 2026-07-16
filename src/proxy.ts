import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAdminPath = path.startsWith("/admin");
  const isLoginPath = path === "/admin/login";
  const sessionCookie = request.cookies.get("admin_session")?.value;

  if (isAdminPath && !isLoginPath && !sessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPath && sessionCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
