import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const apiAuthPrefix = "/api"
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
  "/teacher/login",
  "/student/login",
  "/login",
]
export const publicRoutes = [
  "/auth/new-verification",
]
// @ts-ignore
export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isTeacherRoute = nextUrl.pathname.startsWith("/teacher")

  // Helper function for redirects with callback
  const redirectWithCallback = (redirectTo: string) => {
    // const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search)
    return NextResponse.redirect(new URL(`${redirectTo}`, nextUrl))
  }

  if(isApiAuthRoute){
    return null
  }

  // Allow auth routes, API auth routes, and public routes
  if (isAuthRoute || isApiAuthRoute || isPublicRoute || isAdminRoute) {
    return null
  }

  // Handle teacher routes
  if (isTeacherRoute) {
    if (!isLoggedIn) {
      return redirectWithCallback("/teacher/login")
    }
    if (req.auth?.user?.role !== "teacher") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
    return null
  }

  // Handle student role-based access
  if (!isLoggedIn) {
    return redirectWithCallback("/login")
  }

  // If logged in and role is "student", allow access to student pages
  if (req.auth?.user?.role === "student") {
    return null // Allow access to regular student routes (like /profile)
  }

  // Default redirect for non-logged in users or unauthorized access
  return NextResponse.redirect(new URL("/", nextUrl))
}) as any

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
