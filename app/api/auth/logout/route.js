import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * POST /api/auth/logout
 * Logout user and invalidate tokens
 */
export async function POST(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 400 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token is valid (will throw if invalid)
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // In a real application, you might:
    // 1. Blacklist the token in a database
    // 2. Add token to a Redis cache with expiration
    // 3. Store revoked tokens in MongoDB
    
    // For now, clearing client-side tokens is sufficient
    // The frontend should delete localStorage tokens

    return NextResponse.json(
      { 
        message: "Logout successful",
        success: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Failed to logout" },
      { status: 500 }
    );
  }
}
