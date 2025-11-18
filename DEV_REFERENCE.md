# Developer Quick Reference

## 🚀 Common Tasks

### Import useAuth Hook
```javascript
import { useAuth } from "@/app/context/AuthContext";

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  // ...
}
```

### Make API Calls
```javascript
import apiClient from "@/lib/api-client";

// GET
const user = await apiClient.get("/api/user/profile");

// POST
const result = await apiClient.post("/api/endpoint", { data });

// PUT
const updated = await apiClient.put("/api/endpoint", { data });

// DELETE
await apiClient.delete("/api/endpoint");
```

### Protect a Route
```javascript
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function SecurePage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### Get Tokens
```javascript
import {
  getAccessToken,
  getRefreshToken,
  getUser,
  isAuthenticated,
  clearAuthData
} from "@/lib/auth/storage";

const token = getAccessToken();
const user = getUser();
const isLoggedIn = isAuthenticated();
```

---

## 📋 API Endpoints Cheat Sheet

### Authentication
```javascript
// Signup
POST /api/auth/signup
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123"
}
// Returns: { user, accessToken, refreshToken }

// Login
POST /api/auth/login
{
  email: "john@example.com",
  password: "password123"
}
// Returns: { user, accessToken, refreshToken }

// Logout
POST /api/auth/logout
{}

// Refresh Token
POST /api/auth/refresh-token
{
  refreshToken: "token_value"
}
// Returns: { accessToken }

// Forgot Password
POST /api/auth/forgot-password
{
  email: "john@example.com"
}

// Reset Password
POST /api/auth/reset-password
{
  token: "reset_token",
  newPassword: "newpassword123"
}

// Verify Email
POST /api/auth/verify-email
{
  token: "verification_token"
}
```

---

## 🎨 Common Patterns

### Form with API Integration
```javascript
"use client";

import { useState } from "react";
import apiClient from "@/lib/api-client";

export default function MyForm() {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await apiClient.post("/api/endpoint", formData);
      // Handle success
    } catch (err) {
      setError(err.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-600">{error}</p>}
      {/* Form fields */}
      <button disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
```

### Protected API Route
```javascript
// app/api/my-endpoint/route.js
import { verifyToken } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Get token from header
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);

    // Do something with payload.userId
    const data = { message: "Success" };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Error" },
      { status: 500 }
    );
  }
}
```

### Error Handling
```javascript
try {
  const result = await apiClient.post("/api/endpoint", data);
} catch (error) {
  // error.status = HTTP status code
  // error.data = { message: "..." }
  // error.message = error message

  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 400) {
    // Handle bad request
  } else {
    // Handle other errors
  }
}
```

---

## 🔍 Debugging Tips

### Check Token Status
```javascript
// In browser console
localStorage.getItem('auth_access_token')
localStorage.getItem('auth_user')
localStorage.getItem('auth_refresh_token')
```

### View API Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Try signup/login
4. Click the request
5. Check Request/Response tabs

### Clear Auth State
```javascript
// In browser console
localStorage.clear()
// Then refresh page
```

### Debug useAuth Hook
```javascript
import { useAuth } from "@/app/context/AuthContext";

export default function MyComponent() {
  const auth = useAuth();
  
  console.log("Auth State:", {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error
  });
  
  return <div>Check console</div>;
}
```

---

## 📝 Code Snippets

### Sign Up Button
```javascript
const handleSignup = async () => {
  try {
    await signup(firstName, lastName, email, password);
    router.push("/dashboard");
  } catch (error) {
    setError(error.message);
  }
};
```

### Login Button
```javascript
const handleLogin = async () => {
  try {
    await login(email, password);
    router.push("/dashboard");
  } catch (error) {
    setError(error.message);
  }
};
```

### Logout Button
```javascript
const handleLogout = async () => {
  await logout();
  router.push("/auth/login");
};
```

### User Profile Display
```javascript
const { user } = useAuth();

return (
  <div>
    <p>Name: {user.firstName} {user.lastName}</p>
    <p>Email: {user.email}</p>
    <p>Verified: {user.isEmailVerified ? "Yes" : "No"}</p>
    <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
  </div>
);
```

---

## 🚨 Common Errors & Solutions

### "useAuth must be used within an AuthProvider"
**Cause:** Component not wrapped in AuthProvider
**Solution:** Make sure AuthProvider is in layout.js wrapping children

### "Cannot read property 'user' of undefined"
**Cause:** Using useAuth() without being in AuthContext
**Solution:** Wrap component with AuthProvider or use ProtectedRoute

### "Token is expired"
**Cause:** Access token has expired
**Solution:** This happens automatically - client requests new token

### "Unauthorized" on API call
**Cause:** Token missing or invalid
**Solution:** Check token in localStorage, try logging in again

### "User already exists"
**Cause:** Email already registered
**Solution:** Use different email or reset in-memory storage

### Form not submitting
**Cause:** Validation errors
**Solution:** Check form errors object, ensure all required fields filled

---

## 📁 File Locations Quick Reference

| What | Where |
|------|-------|
| Auth Context | `app/context/AuthContext.jsx` |
| API Client | `lib/api-client.js` |
| Token Storage | `lib/auth/storage.js` |
| Token Utilities | `lib/auth/tokens.js` |
| Error Boundary | `app/components/ErrorBoundary.jsx` |
| Protected Route | `app/components/ProtectedRoute.jsx` |
| Loading Indicator | `app/components/LoadingIndicator.jsx` |
| Dashboard | `app/dashboard/page.jsx` |
| Auth Pages | `app/auth/[Login\|SignUp\|ForgetPassword]/page.jsx` |
| Auth Components | `app/auth/components/` |
| Auth Hooks | `app/auth/hooks/useAuthForm.js` |
| Auth Utils | `app/auth/utils/` |
| API Routes | `app/api/auth/` |

---

## 🔑 Key Values Reference

### User Object
```javascript
{
  id: "user_id",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  isEmailVerified: false,
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Token Object
```javascript
{
  type: "access",  // or "refresh"
  userId: "user_id",
  email: "john@example.com",
  iat: 1234567890,
  expiresAt: 1234569690
}
```

### Error Response
```javascript
{
  status: 400,  // HTTP status
  data: {
    message: "Email already exists"
  },
  message: "Email already exists"
}
```

---

## 🔄 Workflow Examples

### Complete Signup Flow
```javascript
1. User fills signup form
2. Client validates (useAuthForm)
3. POST /api/auth/signup
4. Server hashes password
5. Server saves user to DB
6. Server generates JWT tokens
7. Client receives user + tokens
8. Client stores in localStorage
9. Client updates AuthContext
10. User redirected to /dashboard
```

### Complete Login Flow
```javascript
1. User fills login form
2. Client validates (useAuthForm)
3. POST /api/auth/login
4. Server finds user by email
5. Server verifies password (bcryptjs)
6. Server generates JWT tokens
7. Client receives user + tokens
8. Client stores in localStorage
9. Client updates AuthContext
10. User redirected to /dashboard
```

### Complete Logout Flow
```javascript
1. User clicks logout button
2. Client calls logout()
3. POST /api/auth/logout
4. Client removes tokens from localStorage
5. Client clears AuthContext
6. AuthContext clears user data
7. User redirected to /auth/login
8. ProtectedRoute prevents access to /dashboard
```

---

## 🎯 Best Practices

✅ Always use `useAuth()` for auth operations
✅ Always use `apiClient` for API calls
✅ Always wrap sensitive pages with `ProtectedRoute`
✅ Always display errors to user
✅ Always show loading state during requests
✅ Never store passwords in localStorage
✅ Never expose JWT_SECRET in client code
✅ Always validate on both client and server

---

## 📞 Quick Help

**Authentication not working?**
- Check .env.local has JWT_SECRET
- Check tokens in localStorage
- Check browser console for errors

**API calls failing?**
- Check Network tab in DevTools
- Check response status and message
- Verify route exists

**Page won't load?**
- Check error boundary message
- Check console for errors
- Clear .next folder and rebuild

**Not redirecting after login?**
- Check /dashboard page exists
- Check router.push in useAuthForm
- Check AuthContext provides isAuthenticated

---

**Need more help? Check the documentation files in the project root.**
