import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Chặn admin fake
  if (pathname.startsWith("/admin")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Chỉ cho phép admin thật
  if (!pathname.startsWith("/cms-91xka-admin")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cms-91xka-admin/:path*"
  ],
};