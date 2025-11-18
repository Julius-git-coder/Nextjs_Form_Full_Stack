import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * POST /api/auth/logout
 * Logout user and invalidate tokens
 */
export async function POST(request) {
  try {
    // Get token from Authorization header or cookies
    let token = null;
    
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Fall back to cookie (for OAuth users)
      token = request.cookies.get("accessToken")?.value;
    }

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 400 }
      );
    }

    // Verify token is valid (will throw if invalid)
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // Clear authentication cookies
    const response = NextResponse.json(
      { 
        message: "Logout successful",
        success: true 
      },
      { status: 200 }
    );

    // Delete cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("userId");
    response.cookies.delete("user");

    // In a real application, you might:
    // 1. Blacklist the token in a database
    // 2. Add token to a Redis cache with expiration
    // 3. Store revoked tokens in MongoDB
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Failed to logout" },
      { status: 500 }
    );
  }
}
