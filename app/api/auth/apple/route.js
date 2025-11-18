import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "@/lib/db-helpers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production";

/**
 * POST /api/auth/apple
 * Authenticate with Apple OAuth
 */
export async function POST(request) {
  try {
    const { idToken, email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await findUserByEmail(email);

    // If user doesn't exist, create one
    if (!user) {
      user = await createUser({
        firstName: firstName || "Apple",
        lastName: lastName || "User",
        email,
        password: Math.random().toString(36).substring(2, 15), // Random password for OAuth users
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        type: "access",
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        type: "refresh",
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Apple authentication successful",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          createdAt: user.createdAt,
          isEmailVerified: true, // Apple users are auto-verified
        },
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Apple auth error:", error);
    return NextResponse.json(
      { message: error.message || "Apple authentication failed" },
      { status: 500 }
    );
  }
}
