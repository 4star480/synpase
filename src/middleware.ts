import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getSessionSecret } from "@/lib/env";

const COOKIE = "gametrade_session";
const USER_PROTECTED = ["/sell", "/orders"];
const ADMIN_PREFIX = "/admin";

async function getSession(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    return { userId: payload.sub as string, role: (payload.role as string) ?? "USER" };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);

  const continueWithPath = () => {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  };

  const redirectWithPath = (url: URL) => NextResponse.redirect(url);

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (pathname === "/admin/login") {
      if (session?.role === "ADMIN") {
        return redirectWithPath(new URL("/admin", request.url));
      }
      return continueWithPath();
    }

    if (!session) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("redirect", pathname);
      return redirectWithPath(login);
    }
    if (session.role !== "ADMIN") {
      return redirectWithPath(new URL("/", request.url));
    }
    return continueWithPath();
  }

  if (USER_PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (session) return continueWithPath();
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", pathname);
    return redirectWithPath(login);
  }

  return continueWithPath();
}

export const config = {
  matcher: ["/sell", "/orders", "/admin", "/admin/:path*"],
};
