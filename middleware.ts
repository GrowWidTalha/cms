import { auth } from "@/auth";

const DEFAULT_LOGIN_REDIRECT = "/";
export const apiAuthPrefix = "/api/auth";
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
  "/teacher/login",
  "/login",
];
export const publicRoutes = [
  "/auth/new-verification",
  "/admin",
  "/teacher/login",  // Allowing access to the teacher login page
];

// @ts-ignore
export default auth(async (req) => {
  const { nextUrl } = req;
  const session = await auth();

  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isTeacherRoute = nextUrl.pathname.startsWith("/teacher");
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Allow API authentication routes
  if (isApiAuthRoute) {
    return null;
  }

  // Allow access to admin routes and their children
  if (isAdminRoute) {
    return null;
  }

  // Allow teachers to access the teacher login page and root /teacher page
  if (isTeacherRoute) {
    if (!isLoggedIn) {
      // Allow unauthenticated users access to /teacher or /teacher/login
      if (nextUrl.pathname === "/teacher/login") {
        return null;
      }
      // Redirect unauthenticated users trying to access other teacher routes to login
      const encodedCallbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
      return Response.redirect(new URL(`/teacher/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
    }
    // If logged in as teacher, allow access to teacher routes
    if (session?.user?.role === "teacher") {
      return null;
    } else {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  // Redirect logged-in users from auth routes to default redirect
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // Redirect unauthenticated users to login for non-public routes
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl ?? "/"}`, nextUrl));
  }

  // Allow all other routes
  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
