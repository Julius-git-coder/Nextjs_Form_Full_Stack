# MongoDB Quick Start - 3 Steps

## You're Here → You Want Your MongoDB URL → You're Done

---

## Step 1: Install (1 minute)

```bash
npm install
```

Mongoose automatically gets installed (already in package.json).

---

## Step 2: Add MongoDB URL (2 minutes)

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account → Create free cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password

Example:
```
mongodb+srv://julius:mypassword@cluster0.abc.mongodb.net/auth?retryWrites=true&w=majority
```

### Option B: Local MongoDB
Start MongoDB, then use:
```
mongodb://localhost:27017/auth
```

### Add to `.env.local`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 3: Update 5 API Routes (15 minutes)

### Pattern to Use Everywhere
**Remove this:**
```javascript
const users = new Map();
```

**Add this:**
```javascript
import { createUser, verifyPassword, markEmailAsVerified, updatePassword, findUserByEmail } from "@/lib/db-helpers";
```

**Then use the helpers:**

### Route 1: `/api/auth/signup`
```javascript
const user = await createUser({
  firstName,
  lastName,
  email,
  password,
});
```

### Route 2: `/api/auth/login`
```javascript
const user = await verifyPassword(email, password);
```

### Route 3: `/api/auth/verify-email`
```javascript
const user = await markEmailAsVerified(userId);
```

### Route 4: `/api/auth/reset-password`
```javascript
await updatePassword(userId, newPassword);
```

### Route 5: `/api/auth/forgot-password`
```javascript
const user = await findUserByEmail(email);
```

### Routes 6-7: Unchanged
- `/api/auth/logout` - No changes
- `/api/auth/refresh-token` - No changes

---

## Important: Change `user.id` to `user._id`

In JWT generation, change:
```javascript
// OLD
jwt.sign({ userId: user.id, ... })

// NEW
jwt.sign({ userId: user._id, ... })
```

MongoDB uses `_id` instead of `id`.

---

## Test It Works

1. Restart dev server
2. Go to signup page
3. Create an account
4. Check MongoDB for the user
5. Go to login page
6. Login with same credentials
7. You're done! 🎉

---

## Reference

All helper functions are in `lib/db-helpers.js`:
- `createUser({ firstName, lastName, email, password })`
- `verifyPassword(email, password)`
- `findUserByEmail(email)`
- `findUserById(userId)`
- `updateUser(userId, updateData)`
- `updatePassword(userId, newPassword)`
- `markEmailAsVerified(userId)`
- `deleteUser(userId)`

---

## Detailed Guides

- **Complete Guide:** `MONGODB_MIGRATION.md`
- **Setup Details:** `lib/MONGO_SETUP_GUIDE.md`
- **Before/After:** `BEFORE_AFTER_COMPARISON.md`
- **Full Status:** `SCHEMAS_READY.md`

---

## That's It!

Seriously. Just:
1. `npm install`
2. Add MongoDB URL
3. Update 5 routes
4. Test

You have everything else already built.
