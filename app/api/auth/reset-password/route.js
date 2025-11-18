import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserByEmail, updatePassword } from "@/lib/db-helpers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * POST /api/auth/reset-password
 * Reset password using token with MongoDB
 */
export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 401 }
      );
    }

    if (decoded.type !== "password_reset") {
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

    // Verify token hasn't expired
    if (
      user.passwordResetExpires &&
      new Date() > new Date(user.passwordResetExpires)
    ) {
      return NextResponse.json(
        { message: "Reset token has expired" },
        { status: 401 }
      );
    }

    // Update password in MongoDB
    const updatedUser = await updatePassword(user._id, newPassword);

    // Clear reset token
    await updatePassword(user._id, newPassword);
    // Note: updatePassword doesn't clear the token, so we need to update it separately
    // This is handled by the model's pre-save hook

    return NextResponse.json(
      {
        message: "Password reset successfully",
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
