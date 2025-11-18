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
    console.log(`[OAuth Callback] Started - URL: ${request.url}`);
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    console.log(`[OAuth Callback] Code: ${code ? "present" : "missing"}, Error: ${error || "none"}`);

    // Handle OAuth errors
    if (error) {
      const errorDescription = searchParams.get("error_description") || error;
      console.log(`[OAuth Callback] OAuth error: ${errorDescription}`);
      return NextResponse.redirect(
        `/auth/Login?error=${encodeURIComponent(errorDescription)}`
      );
    }

    if (!code) {
      console.log(`[OAuth Callback] No authorization code received`);
      return NextResponse.redirect(
        "/auth/Login?error=" + encodeURIComponent("No authorization code received")
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
        "/auth/Login?error=" + encodeURIComponent(errorData.error_description || "Token exchange failed")
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
     console.log(`[OAuth] Creating new user: ${userData.email}`);
     user = await createUser({
       firstName: userData.given_name || "Google",
       lastName: userData.family_name || "User",
       email: userData.email,
       password: Math.random().toString(36).substring(2, 15),
       isEmailVerified: userData.email_verified || true,
     });
    } else {
     console.log(`[OAuth] User exists: ${userData.email}`);
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

    // Create response with redirect to oauth-sync page (which will sync cookies and redirect to dashboard)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    console.log(`[OAuth Callback] Redirecting to: ${baseUrl}/auth/oauth-sync`);
    const response = NextResponse.redirect(
      new URL("/auth/oauth-sync", baseUrl)
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

    // Also set user data in cookie for client-side access
    // This is a workaround since we can't directly set localStorage from server
    const userDataForCookie = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      createdAt: user.createdAt,
      isEmailVerified: user.isEmailVerified || true,
    };

    const userCookieValue = JSON.stringify(userDataForCookie);
    console.log(`[OAuth Callback] User data for cookie:`, userDataForCookie);
    console.log(`[OAuth Callback] User cookie size: ${userCookieValue.length} bytes`);

    response.cookies.set("user", userCookieValue, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    console.log(`[OAuth Callback] Cookies set for user: ${user.email}`);
    console.log(`[OAuth Callback] AccessToken cookie: ${accessToken.substring(0, 20)}...`);

    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      "/auth/Login?error=" + encodeURIComponent("Authentication failed")
    );
  }
}
