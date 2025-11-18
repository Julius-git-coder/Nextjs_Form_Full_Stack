import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "@/lib/db-helpers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production";

/**
 * GET /api/auth/google/callback
 * Google OAuth callback handler
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      const errorDescription = searchParams.get("error_description") || error;
      return NextResponse.redirect(
        `/auth/SignUp?error=${encodeURIComponent(errorDescription)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        "/auth/SignUp?error=" + encodeURIComponent("No authorization code received")
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return NextResponse.redirect(
        "/auth/SignUp?error=" + encodeURIComponent(errorData.error_description || "Token exchange failed")
      );
    }

    const tokenData = await tokenResponse.json();
    const idToken = tokenData.id_token;

    // Decode ID token to get user info
    const base64Url = idToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const userData = JSON.parse(jsonPayload);

    // Check if user exists
    let user = await findUserByEmail(userData.email);

    // If user doesn't exist, create one
    if (!user) {
      user = await createUser({
        firstName: userData.given_name || "Google",
        lastName: userData.family_name || "User",
        email: userData.email,
        password: Math.random().toString(36).substring(2, 15),
        isEmailVerified: userData.email_verified || true,
      });
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

    // Redirect with tokens as query params
    const redirectUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    redirectUrl.searchParams.append("accessToken", accessToken);
    redirectUrl.searchParams.append("refreshToken", refreshToken);
    redirectUrl.searchParams.append("userId", user._id.toString());

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      "/auth/SignUp?error=" + encodeURIComponent("Authentication failed")
    );
  }
}
