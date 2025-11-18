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
