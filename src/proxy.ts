import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/utilities/auth";

export default async function proxy(req: NextRequest) {
  const { cookies, nextUrl } = req;
  const token = cookies.get("token")?.value ?? null;

  const protectedRoutes = [
    "/like",
    "/unlike",
    "/follow",
    "/unfollow",
    "/edit",
    "/delete",
    "/repost",
    "/unrepost",
    "/posts/create",
    "/messages/create",
  ];

  const staticRoutesPrivate = ["/notifications", "/messages", "/home"];

  const hasVerifiedToken =
    token && (await verifyJwtToken(token));

  // Check protected routes (POST actions)
  if (
    !hasVerifiedToken &&
    protectedRoutes.some((route) => nextUrl.pathname.endsWith(route))
  ) {
    return NextResponse.redirect(new URL("/not-authorized", req.url));
  }

  // Check private static pages
  if (
    !hasVerifiedToken &&
    staticRoutesPrivate.some((route) =>
      nextUrl.pathname.startsWith(route)
    )
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Logged in user should not stay on "/"
  if (hasVerifiedToken && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Prevent access to `/xxx/edit` pages
  if (
    hasVerifiedToken &&
    ["/notifications", "/messages", "/home", "/settings"]
      .some(prefix => nextUrl.pathname === `${prefix}/edit`)
  ) {
    const route = nextUrl.pathname.split("/")[1];
    return NextResponse.redirect(new URL(`/${route}`, req.url));
  }

  return NextResponse.next();
}
