import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserByEmail, updateUser } from "@/lib/db-helpers";
import { sendPasswordResetEmail } from "@/lib/email-service";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * POST /api/auth/forgot-password
 * Send password reset email with MongoDB
 */
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists in MongoDB
    const user = await findUserByEmail(email);

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a password reset link will be sent",
        },
        { status: 200 }
      );
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        type: "password_reset",
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store reset token in user document with expiry
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await updateUser(user._id, {
      passwordResetToken: resetToken,
      passwordResetExpires: expiresAt,
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request, but log the error
      // In production, you might want to handle this differently
    }

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, a password reset link will be sent",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Failed to process password reset" },
      { status: 500 }
    );
  }
}
