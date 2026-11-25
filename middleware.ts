import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/libs/supabase/middleware";

export async function middleware(request: NextRequest) {
  // A sign-in link (magic link or Google) that lands anywhere other than
  // /auth/callback, e.g. the homepage when Supabase falls back to its Site
  // URL, still carries the login code. Hand it to the callback so the user
  // gets signed in and sent to the dashboard instead of staying on that page.
  const { pathname, searchParams } = request.nextUrl;
  if (searchParams.get("code") && !pathname.startsWith("/auth/callback")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    url.search = `?code=${encodeURIComponent(searchParams.get("code")!)}`;
    return NextResponse.redirect(url);
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
