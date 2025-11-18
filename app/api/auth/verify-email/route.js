import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserByEmail, markEmailAsVerified } from "@/lib/db-helpers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * POST /api/auth/verify-email
 * Verify user email using token and MongoDB
 */
export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 401 }
      );
    }

    if (decoded.type !== "email_verification") {
      return NextResponse.json(
        { message: "Invalid token type" },
        { status: 401 }
      );
    }

    // Find user in MongoDB
    const user = await findUserByEmail(decoded.email);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }

    // Mark email as verified in MongoDB
    const verifiedUser = await markEmailAsVerified(user._id);

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: verifiedUser._id,
          firstName: verifiedUser.firstName,
          lastName: verifiedUser.lastName,
          email: verifiedUser.email,
          isEmailVerified: verifiedUser.isEmailVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify email" },
      { status: 500 }
    );
  }
}
