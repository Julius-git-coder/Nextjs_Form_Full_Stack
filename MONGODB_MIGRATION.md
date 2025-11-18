# MongoDB Migration Guide

Everything is set up and ready for MongoDB. Just follow these simple steps.

## ✅ What's Already Done

Files created for you:
- `lib/db.js` - Connection management (handles caching & reconnection)
- `lib/models/User.js` - Complete Mongoose schema with validation
- `lib/db-helpers.js` - Ready-to-use database functions
- `lib/MONGO_SETUP_GUIDE.md` - Detailed setup instructions
- `package.json` - Updated with mongoose dependency

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

This will install mongoose (already added to package.json).

### Step 2: Add MongoDB Connection String

Create or update `.env.local`:

```env
# MongoDB (choose one below)

# Option A: MongoDB Atlas (Cloud - recommended for development)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth?retryWrites=true&w=majority

# Option B: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/auth

# Keep existing variables
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Update Your First API Route

Example: Update `app/api/auth/signup/route.js`

**Replace this:**
```javascript
const users = new Map();

export async function POST(request) {
  // ... validation ...
  users.set(email, user);
  // ...
}
```

**With this:**
```javascript
import { createUser } from "@/lib/db-helpers";

export async function POST(request) {
  // ... validation ...
  const user = await createUser({
    firstName,
    lastName,
    email,
    password,
  });
  // ...
}
```

See `app/api/auth/signup/route.mongodb.example.js` for complete example.

---

## 📋 API Routes to Update

Update these files to use MongoDB functions:

### 1. `/api/auth/signup`
```javascript
import { createUser } from "@/lib/db-helpers";

const user = await createUser({
  firstName,
  lastName,
  email,
  password,
});
```

### 2. `/api/auth/login`
```javascript
import { verifyPassword } from "@/lib/db-helpers";

const user = await verifyPassword(email, password);
```

### 3. `/api/auth/verify-email`
```javascript
import { markEmailAsVerified } from "@/lib/db-helpers";

const user = await markEmailAsVerified(userId);
```

### 4. `/api/auth/reset-password`
```javascript
import { updatePassword } from "@/lib/db-helpers";

await updatePassword(userId, newPassword);
```

### 5. `/api/auth/forgot-password`
```javascript
import { findUserByEmail } from "@/lib/db-helpers";

const user = await findUserByEmail(email);
```

### 6. `/api/auth/logout`
No changes needed - it works on the client side.

### 7. `/api/auth/refresh-token`
No changes needed - it uses JWT verification.

---

## 🔧 Database Helper Functions

All functions are ready to use:

```javascript
import {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  updateUser,
  updatePassword,
  markEmailAsVerified,
  deleteUser,
} from "@/lib/db-helpers";

// Create a user
const user = await createUser({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123",
});
// Returns: { _id, firstName, lastName, email, ... } (no password)

// Find by email
const user = await findUserByEmail("john@example.com");
// Returns: { _id, firstName, lastName, email, password, ... }

// Find by ID
const user = await findUserById("507f1f77bcf86cd799439011");
// Returns: { _id, firstName, lastName, email, ... }

// Verify password (login)
const user = await verifyPassword("john@example.com", "password123");
// Returns: user object if correct, throws error if wrong

// Update user
const updated = await updateUser(userId, {
  firstName: "Jane",
});
// Returns: updated user object

// Update password
await updatePassword(userId, "newPassword123");
// Returns: user object

// Mark email verified
const user = await markEmailAsVerified(userId);
// Returns: user with isEmailVerified: true

// Delete user
await deleteUser(userId);
// Returns: deleted user object
```

---

## 🔑 Important: userId Changes

**In-Memory Version:**
```javascript
const userId = Math.random().toString(36).substring(7);
// Example: "abc123"
```

**MongoDB Version:**
```javascript
const userId = user._id; // MongoDB ObjectId
// Example: "507f1f77bcf86cd799439011"
```

Update your JWT token generation:
```javascript
// OLD
const accessToken = jwt.sign({
  userId: user.id,
  email: user.email,
}, JWT_SECRET, { expiresIn: "15m" });

// NEW
const accessToken = jwt.sign({
  userId: user._id, // MongoDB ObjectId
  email: user.email,
}, JWT_SECRET, { expiresIn: "15m" });
```

---

## 🗄️ User Schema Fields

Your MongoDB User schema includes:

```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  isEmailVerified: Boolean (default: false),
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto),
}
```

---

## ☁️ MongoDB Atlas (Recommended for Development)

### Sign Up
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster (takes ~2 minutes)

### Get Connection String
1. In MongoDB Atlas, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

Example:
```
mongodb+srv://julius:mypassword@cluster0.abcde.mongodb.net/auth?retryWrites=true&w=majority
```

### Add to .env.local
```env
MONGODB_URI=mongodb+srv://julius:mypassword@cluster0.abcde.mongodb.net/auth?retryWrites=true&w=majority
```

### Whitelist Your IP
- In MongoDB Atlas, go to Security → Network Access
- Click "Add IP Address"
- Choose "Allow Access from Anywhere" (development only)
- Or add your specific IP

---

## 🖥️ Local MongoDB (Alternative)

### Install MongoDB (macOS)
```bash
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### Connection String
```env
MONGODB_URI=mongodb://localhost:27017/auth
```

### Verify It Works
```bash
# In another terminal
mongosh

# In mongosh shell
show databases
use auth
show collections
```

---

## 🧪 Testing Your Setup

### 1. Restart Dev Server
```bash
# Stop: Ctrl+C
npm run dev
```

### 2. Test Signup
- Go to `http://localhost:3000/auth/signup`
- Fill in form
- Click submit
- Should create user in MongoDB

### 3. Verify in MongoDB
```bash
# Using MongoDB Atlas
1. Go to Atlas Dashboard
2. Click Clusters
3. Click Browse Collections
4. Find your auth database → users collection
5. See your created user

# Or using mongosh (local)
mongosh
use auth
db.users.find()
```

### 4. Test Login
- Logout if signed in
- Go to `http://localhost:3000/auth/login`
- Use email/password from signup
- Should login successfully

### 5. Check Browser Console
- Open DevTools (F12)
- Console tab should show no errors
- Network tab should show successful API calls

---

## ✅ Checklist for Migration

- [ ] `npm install` (installs mongoose)
- [ ] Add `MONGODB_URI` to `.env.local`
- [ ] Update `app/api/auth/signup/route.js` to use `createUser()`
- [ ] Update `app/api/auth/login/route.js` to use `verifyPassword()`
- [ ] Update `app/api/auth/verify-email/route.js` to use `markEmailAsVerified()`
- [ ] Update `app/api/auth/reset-password/route.js` to use `updatePassword()`
- [ ] Update `app/api/auth/forgot-password/route.js` to use `findUserByEmail()`
- [ ] Restart dev server
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Verify users are in MongoDB
- [ ] Test logout and re-login

---

## 🆘 Troubleshooting

### Error: "MONGODB_URI is not defined"
**Solution:** Add to `.env.local` and restart dev server

### Error: "Connection refused"
**Solutions:**
- MongoDB Atlas: Check internet, check IP whitelist
- Local MongoDB: Start MongoDB with `brew services start mongodb-community`

### Error: "User already exists"
**Solution:** This is correct! The schema has unique email. Try different email.

### Error: "Password hash failed"
**Solution:** Make sure password is a string with at least 6 characters

### New users not appearing in MongoDB
**Solution:**
1. Check `.env.local` has correct MONGODB_URI
2. Check dev server console for errors
3. Check MongoDB database access/permissions
4. Verify network connectivity

### Different userId format causing issues
**Solution:** Update JWT token generation to use `user._id` instead of `user.id`

---

## 📚 Reference Files

- `lib/db.js` - Connection manager with caching
- `lib/models/User.js` - Mongoose schema
- `lib/db-helpers.js` - All helper functions
- `app/api/auth/signup/route.mongodb.example.js` - Complete example
- `lib/MONGO_SETUP_GUIDE.md` - Detailed guide

---

## 🎯 What Happens Next

After you update the API routes:

1. Users sign up → Saved to MongoDB
2. Users login → Verified against MongoDB
3. Tokens generated → Same as before
4. Dashboard shows user info → From MongoDB
5. Everything works the same, but with persistent storage

---

## 🚀 You're Ready!

The hard part is done. Now just:

1. Add MongoDB connection string
2. Update API routes to use helper functions
3. Test it works

All the schemas, validation, and database logic are already implemented.

Good luck! 🎉
