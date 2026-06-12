import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "gametrade_session";
const USER_PROTECTED = ["/sell", "/orders"];
const ADMIN_PREFIX = "/admin";

async function getSession(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const token = request.cookies.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return { userId: payload.sub as string, role: (payload.role as string) ?? "USER" };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);

  const withPath = (res: NextResponse) => {
    res.headers.set("x-pathname", pathname);
    return res;
  };

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (pathname === "/admin/login") {
      if (session?.role === "ADMIN") {
        return withPath(NextResponse.redirect(new URL("/admin", request.url)));
      }
      return withPath(NextResponse.next());
    }

    if (!session) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("redirect", pathname);
      return withPath(NextResponse.redirect(login));
    }
    if (session.role !== "ADMIN") {
      return withPath(NextResponse.redirect(new URL("/", request.url)));
    }
    return withPath(NextResponse.next());
  }

  if (USER_PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (session) return withPath(NextResponse.next());
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", pathname);
    return withPath(NextResponse.redirect(login));
  }

  return withPath(NextResponse.next());
}

export const config = {
  matcher: ["/sell", "/orders", "/admin/:path*"],
};
