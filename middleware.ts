import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const apiAuthPrefix = "/api/auth";
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
  "/teacher/login",
  "/student/login", // Keep this if you have a student-specific login page
];
export const publicRoutes = [
  "/",
  "/auth/new-verification",
];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isTeacherRoute = nextUrl.pathname.startsWith("/teacher");

  // Allow API authentication routes
  if (isApiAuthRoute) {
    return null;
  }

  // Allow public routes
  if (isPublicRoute) {
    return null;
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!isLoggedIn || req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    return null;
  }

  // Handle teacher routes
  if (isTeacherRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(new URL(`/teacher/login?callbackUrl=${callbackUrl}`, nextUrl));
    }
    if (req.auth?.user?.role !== "teacher") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return null;
  }

  // Handle student role-based access
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  // If logged in and role is "student", allow access to student pages
  if (req.auth?.user?.role === "student") {
    return null; // Allow access to regular student routes (like /profile)
  }

  // Default redirect for non-logged in users or unauthorized access
  return NextResponse.redirect(new URL("/", nextUrl));
}) as any;

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
