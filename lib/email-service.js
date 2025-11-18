/**
 * Email Service using Nodemailer
 * Sends password reset and verification emails
 */

import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, resetToken) {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Link - Form Validation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
              Hi there,
            </p>
            
            <p style="color: #555; font-size: 14px; margin: 0 0 30px 0;">
              We received a request to reset the password for your account. Click the button below to reset your password. This link will expire in 1 hour.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #667eea; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; margin: 30px 0 0 0; border-top: 1px solid #ddd; padding-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <code style="color: #667eea; word-break: break-all;">${resetLink}</code>
            </p>
            
            <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">
              If you did not request a password reset, please ignore this email or contact support.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send email");
  }
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email, verificationToken) {
  try {
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - Form Validation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Verify Your Email</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
              Welcome to Form Validation!
            </p>
            
            <p style="color: #555; font-size: 14px; margin: 0 0 30px 0;">
              Thank you for signing up. Please verify your email address by clicking the button below. This link will expire in 24 hours.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background: #667eea; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                Verify Email
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; margin: 30px 0 0 0; border-top: 1px solid #ddd; padding-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <code style="color: #667eea; word-break: break-all;">${verificationLink}</code>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send email");
  }
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration() {
  try {
    await transporter.verify();
    console.log("Email service is configured correctly");
    return true;
  } catch (error) {
    console.error("Email service configuration error:", error);
    return false;
  }
}
