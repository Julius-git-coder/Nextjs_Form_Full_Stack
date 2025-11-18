/**
 * MONGODB VERSION - Example of how to update signup route
 * 
 * To use this:
 * 1. Install mongoose: npm install mongoose
 * 2. Add MONGODB_URI to .env.local
 * 3. Replace the current route.js with this file
 * 
 * Current route.js uses in-memory storage.
 * This shows how to switch to MongoDB.
 */

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createUser } from "@/lib/db-helpers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production";

/**
 * POST /api/auth/signup
 * Register a new user with MongoDB
 */
export async function POST(request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create user in MongoDB
    // This function handles:
    // - Checking if user exists
    // - Hashing password
    // - Saving to database
    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
    });

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user._id, // MongoDB ObjectId
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

    // Return user data without password
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
        accessToken,
        refreshToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific errors
    if (error.message.includes("already exists")) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 }
      );
    }

    if (error.message.includes("validation")) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 }
    );
  }
}
