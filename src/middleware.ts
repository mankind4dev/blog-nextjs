import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const protectedRoute = ["/profile", "/post/create", "/post/edit"];

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  // const session = await auth.api.getSession({
  // headers: await headers(),
  // });

  const session = getSessionCookie(request);

  const isProtectedRoute = protectedRoute.some((route) =>
    pathName.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    //redirect user if not logged in
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  //if user already logged in successful
  //redirect to home automatically
  if (pathName === "/auth" && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/post/create", "/post/edit/:path*", "/auth"],
};
