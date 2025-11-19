import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  updateUser,
  checkEmailVerificationAttempts,
  recordEmailVerificationAttempt,
} from "@/lib/db-helpers";
import { sendVerificationEmail } from "@/lib/email-service";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * POST /api/auth/request-verification
 * Send email verification link
 * Rate limited: 3 attempts per week (7 days)
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

    // Check if user exists
    const user = await findUserByEmail(email);

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json(
        {
          message: "If an account exists with this email, a verification link will be sent",
        },
        { status: 200 }
      );
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    // Check rate limiting (3 attempts per week)
    const attemptStatus = await checkEmailVerificationAttempts(user._id);

    if (!attemptStatus.allowed) {
      return NextResponse.json(
        {
          message: `Too many verification requests. You can request a verification link again after ${attemptStatus.nextResetTime?.toLocaleString()}`,
          remainingAttempts: 0,
          nextResetTime: attemptStatus.nextResetTime,
        },
        { status: 429 }
      );
    }

    // Generate verification token (expires in 24 hours)
    const verificationToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        type: "email_verification",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Store verification token in user document with expiry
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await updateUser(user._id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: expiresAt,
    });

    // Record the attempt
    await recordEmailVerificationAttempt(user._id);

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request, but log the error
    }

    return NextResponse.json(
      {
        message: "If an account exists with this email, a verification link will be sent",
        remainingAttempts: attemptStatus.remainingAttempts - 1,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification request error:", error);
    return NextResponse.json(
      { message: "Failed to process verification request" },
      { status: 500 }
    );
  }
}
