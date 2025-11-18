# MongoDB Setup Checklist

Copy this checklist and mark off as you go.

---

## Phase 1: Install (1 minute)

- [ ] Run `npm install` in your terminal
  ```bash
  npm install
  ```
- [ ] Verify mongoose installed: `npm list mongoose`

---

## Phase 2: Get MongoDB URL (5 minutes)

### Choose Your MongoDB Source

#### ☁️ MongoDB Atlas (Recommended - Cloud)
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create account (or login)
- [ ] Create free cluster (M0 tier)
- [ ] Wait for cluster to provision (~2 min)
- [ ] Click "Connect"
- [ ] Choose "Connect your application"
- [ ] Select Node.js driver
- [ ] Copy connection string
  ```
  mongodb+srv://username:password@cluster.mongodb.net/auth?retryWrites=true&w=majority
  ```
- [ ] Replace `<password>` with database password
- [ ] Security → Network Access → Allow from anywhere

#### 💻 Local MongoDB
- [ ] Install MongoDB locally:
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  ```
- [ ] Start MongoDB:
  ```bash
  brew services start mongodb-community
  ```
- [ ] Connection string:
  ```
  mongodb://localhost:27017/auth
  ```

---

## Phase 3: Configure Environment (2 minutes)

- [ ] Create or edit `.env.local` in project root
- [ ] Add these lines:
  ```env
  MONGODB_URI=your_mongodb_connection_string_here
  JWT_SECRET=your-super-secret-key-min-32-chars
  JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
- [ ] Replace with your actual values
- [ ] Save file
- [ ] Do NOT commit `.env.local` to git (already in .gitignore)

---

## Phase 4: Update API Routes (15 minutes)

### Route 1: `/api/auth/signup/route.js`
- [ ] Remove: `const users = new Map();`
- [ ] Add import:
  ```javascript
  import { createUser } from "@/lib/db-helpers";
  ```
- [ ] Replace user creation:
  ```javascript
  // OLD
  users.set(email, user);
  
  // NEW
  const user = await createUser({
    firstName,
    lastName,
    email,
    password,
  });
  ```
- [ ] Change JWT userId: `user._id` (not `user.id`)

### Route 2: `/api/auth/login/route.js`
- [ ] Remove: `const users = new Map();`
- [ ] Add import:
  ```javascript
  import { verifyPassword } from "@/lib/db-helpers";
  ```
- [ ] Replace user lookup:
  ```javascript
  // OLD
  const user = users.get(email);
  if (!user) throw error;
  
  // NEW
  const user = await verifyPassword(email, password);
  ```
- [ ] Change JWT userId: `user._id` (not `user.id`)

### Route 3: `/api/auth/verify-email/route.js`
- [ ] Remove: `const users = new Map();`
- [ ] Add import:
  ```javascript
  import { markEmailAsVerified } from "@/lib/db-helpers";
  ```
- [ ] Replace email verification:
  ```javascript
  // OLD
  user.isEmailVerified = true;
  
  // NEW
  const user = await markEmailAsVerified(userId);
  ```

### Route 4: `/api/auth/reset-password/route.js`
- [ ] Remove: `const users = new Map();`
- [ ] Add import:
  ```javascript
  import { updatePassword } from "@/lib/db-helpers";
  ```
- [ ] Replace password update:
  ```javascript
  // OLD
  user.password = hashedPassword;
  
  // NEW
  await updatePassword(userId, newPassword);
  ```

### Route 5: `/api/auth/forgot-password/route.js`
- [ ] Remove: `const users = new Map();`
- [ ] Add import:
  ```javascript
  import { findUserByEmail } from "@/lib/db-helpers";
  ```
- [ ] Replace user lookup:
  ```javascript
  // OLD
  const user = users.get(email);
  
  // NEW
  const user = await findUserByEmail(email);
  ```

### Routes NOT to Change
- [ ] `/api/auth/logout/route.js` - No changes needed
- [ ] `/api/auth/refresh-token/route.js` - No changes needed

---

## Phase 5: Test Everything (5 minutes)

### Start Dev Server
- [ ] Stop any running server (Ctrl+C)
- [ ] Start fresh:
  ```bash
  npm run dev
  ```
- [ ] Visit http://localhost:3000

### Test Signup
- [ ] Go to `/auth/signup`
- [ ] Fill in form with test data
- [ ] Submit form
- [ ] Should redirect to `/dashboard`
- [ ] Check browser console for errors (should be none)

### Verify in MongoDB
- [ ] Login to MongoDB Atlas dashboard
- [ ] Find your database
- [ ] Check `users` collection
- [ ] Should see your test user

### Test Login
- [ ] Logout (click Logout button)
- [ ] Go to `/auth/login`
- [ ] Use credentials from signup
- [ ] Should login successfully
- [ ] Should redirect to `/dashboard`

### Test Session Persistence
- [ ] Refresh page (F5)
- [ ] Should stay logged in
- [ ] Dashboard info should display

### Check Network Requests
- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Signup again
- [ ] Should see successful API calls
- [ ] Response should include user data

---

## Phase 6: Cleanup & Verification

- [ ] Remove old documentation (optional)
- [ ] Keep: MONGODB_MIGRATION.md, SCHEMAS_READY.md
- [ ] Test on both signup and existing users
- [ ] Check for console errors
- [ ] Test logout and re-login
- [ ] Test with multiple users

---

## Common Issues & Fixes

### Issue: "MONGODB_URI not found"
**Fix:**
- [ ] Check `.env.local` exists in project root
- [ ] Verify `MONGODB_URI=...` is there
- [ ] Restart dev server after adding URL

### Issue: "Connection refused"
**For MongoDB Atlas:**
- [ ] Check internet connection
- [ ] Check IP whitelist in Atlas (Security → Network Access)
- [ ] Verify password in connection string

**For Local MongoDB:**
- [ ] Start MongoDB: `brew services start mongodb-community`
- [ ] Check it's running: `brew services list`

### Issue: "User already exists"
**This is expected!**
- [ ] Use a different email address
- [ ] Or delete the user from MongoDB

### Issue: New user not in MongoDB
**Fix:**
- [ ] Check `.env.local` has correct MONGODB_URI
- [ ] Check dev server console for errors
- [ ] Check MongoDB database name matches

### Issue: Different userId breaking something
**Fix:**
- [ ] Ensure all JWT generation uses `user._id`
- [ ] Not `user.id` or `userId`
- [ ] MongoDB uses `_id` by default

---

## Final Verification

- [ ] Signup works → user in MongoDB
- [ ] Login works → user can access dashboard
- [ ] Logout works → user redirected to login
- [ ] Session persists → refresh page keeps login
- [ ] No console errors → browser DevTools shows nothing
- [ ] No API errors → Network tab shows 200 status codes

---

## Success! 🎉

If all checkboxes are checked, you're done!

Your authentication system is now using MongoDB instead of in-memory storage.

### What's Next?
1. Use the system (it's production ready!)
2. Add real email service for password resets
3. Add additional features as needed
4. Deploy to production

---

## Documentation Reference

- Quick setup: `MONGODB_QUICK_START.md`
- Full guide: `MONGODB_MIGRATION.md`
- Schema info: `SCHEMAS_READY.md`
- Code examples: `BEFORE_AFTER_COMPARISON.md`
- Helper functions: `lib/db-helpers.js`

---

## Need Help?

1. Check the relevant documentation file
2. Look at `app/api/auth/signup/route.mongodb.example.js` for complete example
3. Review `lib/db-helpers.js` for available functions
4. Check browser console and DevTools Network tab for errors

Good luck! 🚀
