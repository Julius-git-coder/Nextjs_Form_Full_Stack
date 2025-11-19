/**
 * Database Helper Functions
 * Common operations for user management
 */

import User from "./models/User";
import connectDB from "./db";
import bcryptjs from "bcryptjs";

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
  try {
    await connectDB();
    return await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
}

/**
 * Find user by ID
 */
export async function findUserById(userId) {
  try {
    await connectDB();
    return await User.findById(userId);
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
}

/**
 * Create new user
 */
export async function createUser(userData) {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: userData.email.toLowerCase(),
    });

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(userData.password, 10);

    // Create user
    const user = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: false,
    });

    await user.save();

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Verify password
 */
export async function verifyPassword(email, password) {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return user;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

/**
 * Update user
 */
export async function updateUser(userId, updateData) {
  try {
    await connectDB();

    // Don't allow direct password update
    delete updateData.password;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Update password
 */
export async function updatePassword(userId, newPassword) {
  try {
    await connectDB();

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

/**
 * Mark email as verified
 */
export async function markEmailAsVerified(userId) {
  try {
    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error marking email as verified:", error);
    throw error;
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId) {
  try {
    await connectDB();

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Check if user has exceeded password reset attempts (3 per week)
 */
export async function checkPasswordResetAttempts(userId) {
  try {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Get attempts from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttempts = (user.passwordResetAttempts || []).filter(
      (attempt) => new Date(attempt.timestamp) > sevenDaysAgo
    );

    const remainingAttempts = 3 - recentAttempts.length;

    return {
      allowed: recentAttempts.length < 3,
      attemptCount: recentAttempts.length,
      remainingAttempts: Math.max(0, remainingAttempts),
      nextResetTime:
        recentAttempts.length >= 3
          ? new Date(recentAttempts[0].timestamp.getTime() + 7 * 24 * 60 * 60 * 1000)
          : null,
    };
  } catch (error) {
    console.error("Error checking password reset attempts:", error);
    throw error;
  }
}

/**
 * Record password reset attempt
 */
export async function recordPasswordResetAttempt(userId) {
  try {
    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          passwordResetAttempts: {
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error recording password reset attempt:", error);
    throw error;
  }
}

/**
 * Check if user has exceeded email verification attempts (3 per week)
 */
export async function checkEmailVerificationAttempts(userId) {
  try {
    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Get attempts from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttempts = (user.emailVerificationAttempts || []).filter(
      (attempt) => new Date(attempt.timestamp) > sevenDaysAgo
    );

    const remainingAttempts = 3 - recentAttempts.length;

    return {
      allowed: recentAttempts.length < 3,
      attemptCount: recentAttempts.length,
      remainingAttempts: Math.max(0, remainingAttempts),
      nextResetTime:
        recentAttempts.length >= 3
          ? new Date(recentAttempts[0].timestamp.getTime() + 7 * 24 * 60 * 60 * 1000)
          : null,
    };
  } catch (error) {
    console.error("Error checking email verification attempts:", error);
    throw error;
  }
}

/**
 * Record email verification attempt
 */
export async function recordEmailVerificationAttempt(userId) {
  try {
    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          emailVerificationAttempts: {
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error recording email verification attempt:", error);
    throw error;
  }
}
