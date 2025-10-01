import { NextResponse, type NextRequest } from "next/server";
const PROTECTED = ["/lobby", "/game"];

export function middleware(req: NextRequest) {
  // DEVELOPMENT BYPASS - REMOVE IN PRODUCTION
  console.log("🚀 DEV MODE: Bypassing authentication for testing");
  return NextResponse.next();
  
  // Original auth code (commented out for testing)
  /*
  const { pathname } = req.nextUrl;
  const needs = PROTECTED.some(p => pathname.startsWith(p));
  if (!needs) return NextResponse.next();
  const verified = req.cookies.get("hubba_verified")?.value === "1";
  if (!verified) {
    const url = req.nextUrl.clone(); url.pathname = "/verify";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
  */
}
export const config = { matcher: ["/lobby/:path*", "/game/:path*"] };