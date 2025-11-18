import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

/**
 * Protected API routes that require authentication
 */
const protectedRoutes = [
  "/api/user",
  "/api/profile",
  "/api/settings",
];

/**
 * Public routes that should not redirect authenticated users
 */
const publicRoutes = ["/auth/Login", "/auth/SignUp", "/auth/ForgetPassword"];

/**
 * Verify JWT token
 */
async function verifyToken(token) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware for route protection and auth handling
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is public auth route
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Verify token for protected routes
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/Login", request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      // Clear invalid token
      const response = NextResponse.redirect(new URL("/auth/Login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-email", payload.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Redirect authenticated users away from login/signup
  if (isPublicRoute && token) {
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Configure which routes to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
