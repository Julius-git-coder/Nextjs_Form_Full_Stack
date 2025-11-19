import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "@/lib/db-helpers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production";

/**
 * POST /api/auth/apple/callback
 * Apple Sign In callback handler
 */
export async function POST(request) {
  try {
    console.log("[Apple Callback] Started");
    
    const body = await request.json();
    const { user: appleUser, identityToken, authorizationCode } = body;

    if (!appleUser || !appleUser.email) {
      return NextResponse.json(
        { message: "Apple user data is required" },
        { status: 400 }
      );
    }

    const email = appleUser.email;
    const firstName = appleUser.name?.firstName || "Apple";
    const lastName = appleUser.name?.lastName || "User";

    console.log(`[Apple Callback] Processing: ${email}`);

    // Check if user exists
    let user = await findUserByEmail(email);

    // If user doesn't exist, create one
    if (!user) {
      console.log(`[Apple Callback] Creating new user: ${email}`);
      user = await createUser({
        firstName,
        lastName,
        email,
        password: Math.random().toString(36).substring(2, 15), // Random password for OAuth users
        isEmailVerified: true, // Apple users are auto-verified
      });
    } else {
      console.log(`[Apple Callback] User exists: ${email}`);
    }

    // Generate our app tokens
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

    // User data for response
    const userDataForResponse = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      createdAt: user.createdAt,
      isEmailVerified: user.isEmailVerified || true,
    };

    // Create response
    const response = NextResponse.json(
      {
        message: "Apple authentication successful",
        user: userDataForResponse,
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );

    // Store tokens in cookies
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.cookies.set("userId", user._id.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    // Set user data in cookie for client-side access
    const userCookieValue = JSON.stringify(userDataForResponse);
    response.cookies.set("user", userCookieValue, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    console.log(`[Apple Callback] Authentication successful for: ${email}`);

    return response;
  } catch (error) {
    console.error("Apple callback error:", error);
    return NextResponse.json(
      { message: error.message || "Apple authentication failed" },
      { status: 500 }
    );
  }
}
