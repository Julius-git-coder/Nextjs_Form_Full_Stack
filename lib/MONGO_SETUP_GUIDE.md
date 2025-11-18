# MongoDB Setup Guide

This guide will help you convert from in-memory storage to MongoDB with Mongoose.

## Step 1: Install Mongoose

```bash
npm install mongoose
```

Update `package.json` will include mongoose in dependencies.

## Step 2: Add MongoDB Connection String to .env.local

Add this to your `.env.local` file:

```env
# For MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth?retryWrites=true&w=majority

# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/auth

# Existing variables
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Database Files Created

The following files have been created for you:

### Connection & Models
- `lib/db.js` - MongoDB connection manager (handles caching and reconnection)
- `lib/models/User.js` - Mongoose User schema with all required fields
- `lib/db-helpers.js` - Helper functions for common database operations

### Helper Functions Available

```javascript
import { createUser, findUserByEmail, verifyPassword, updateUser } from '@/lib/db-helpers';

// Create a new user
const user = await createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Find user by email
const user = await findUserByEmail('john@example.com');

// Verify password
const user = await verifyPassword('john@example.com', 'password123');

// Update user
const updated = await updateUser(userId, { firstName: 'Jane' });

// Mark email as verified
const verified = await markEmailAsVerified(userId);

// Update password
const updated = await updatePassword(userId, 'newPassword123');
```

## Step 4: Update API Routes

Here's how to update each API route. Example for signup:

### OLD (In-Memory)
```javascript
const users = new Map();

export async function POST(request) {
  const user = {
    id: Math.random().toString(36).substring(7),
    firstName,
    lastName,
    email,
    password: hashedPassword,
  };
  
  users.set(email, user);
  // Generate tokens...
}
```

### NEW (MongoDB)
```javascript
import { createUser } from "@/lib/db-helpers";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validation (same as before)
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

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create user in MongoDB
    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
    });

    // Generate tokens (same as before)
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

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          createdAt: user.createdAt,
        },
        accessToken,
        refreshToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to register user" },
      { status: error.message?.includes("already exists") ? 409 : 500 }
    );
  }
}
```

## Step 5: Update All Routes

Follow the same pattern for all API routes:

### LOGIN ROUTE
```javascript
import { verifyPassword } from "@/lib/db-helpers";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verify user exists and password is correct
    const user = await verifyPassword(email, password);

    // Generate tokens
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

    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          ...userWithoutPassword,
          fullName: `${user.firstName} ${user.lastName}`,
        },
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }
}
```

### VERIFY EMAIL ROUTE
```javascript
import { markEmailAsVerified } from "@/lib/db-helpers";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Mark email as verified
    const user = await markEmailAsVerified(userId);

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: user._id,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify email" },
      { status: 500 }
    );
  }
}
```

## Step 6: Test the Connection

1. Make sure your MongoDB URI is in `.env.local`
2. Restart your dev server
3. Try signing up with a test account
4. Check MongoDB to verify the user was created

### For MongoDB Atlas:
- Go to https://www.mongodb.com/cloud/atlas
- Create an account or login
- Create a free cluster
- Get your connection string
- Add it to `.env.local`

### For Local MongoDB:
```bash
# Install MongoDB locally (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Your connection string
MONGODB_URI=mongodb://localhost:27017/auth
```

## Step 7: Common Issues

### "MONGODB_URI not found"
- Add MONGODB_URI to `.env.local`
- Restart dev server
- Make sure the connection string is valid

### "User already exists"
- This is expected! User model has unique index on email
- Try a different email address

### Connection timeout
- Check internet connection (for MongoDB Atlas)
- Check MongoDB is running (for local MongoDB)
- Verify IP whitelist (for MongoDB Atlas)

## Step 8: Switching Between Storage

You can keep the in-memory version for development and switch to MongoDB for production:

```javascript
const USE_MONGODB = process.env.USE_MONGODB === 'true';

if (USE_MONGODB) {
  const user = await createUser({ firstName, lastName, email, password });
} else {
  const user = { id, firstName, lastName, email, password };
  users.set(email, user);
}
```

Then in `.env.local`:
```env
USE_MONGODB=true  # or false for in-memory
```

## Summary

✅ Files created:
- `lib/db.js` - Connection manager
- `lib/models/User.js` - Mongoose schema
- `lib/db-helpers.js` - Helper functions

✅ Next steps:
1. Install mongoose: `npm install mongoose`
2. Add MONGODB_URI to `.env.local`
3. Update API routes to use the helper functions
4. Test with MongoDB

The schemas are already set up and ready to use!
