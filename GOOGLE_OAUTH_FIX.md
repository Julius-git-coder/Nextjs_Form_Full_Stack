# Google OAuth Redirect Issue - Fixed

## Problem
When users signed up with Google, they were being redirected back to the Login page instead of the Dashboard.

## Root Causes

### 1. **Middleware Path Capitalization Mismatch**
   - Middleware had routes defined as: `/auth/login`, `/auth/signup`, `/auth/forgot-password` (lowercase)
   - Actual Next.js routes were: `/auth/Login`, `/auth/SignUp`, `/auth/ForgetPassword` (capitalized)
   - This caused the middleware to not recognize these as public routes
   - When authenticated users tried to access these routes, middleware redirected them correctly, but the paths didn't match

### 2. **Middleware Missing Dashboard Route**
   - The `/dashboard` route was not in `protectedRoutes`
   - Users with valid tokens could access dashboard, but authentication wasn't being properly verified
   - The redirect after OAuth callback worked, but the dashboard redirected unauthenticated users back to login

### 3. **HTTP-only Cookie Token Access Issue**
   - The `accessToken` cookie was set as HTTP-only (secure, can't be read by JavaScript)
   - The AuthContext needs to verify the token exists to authenticate users
   - Client-side code couldn't read the HTTP-only token to pass it to localStorage

### 4. **Auth Context Not Syncing OAuth Data**
   - After OAuth callback, user data was in cookies but not in localStorage
   - AuthContext initialization checked only localStorage
   - Even though the token cookie existed, the context thought the user was unauthenticated

## Solutions Applied

### 1. **Fixed Middleware Route Capitalization**
```javascript
// Before
const publicRoutes = ["/auth/Login", "/auth/signup", "/auth/forgot-password"];

// After
const publicRoutes = ["/auth/Login", "/auth/SignUp", "/auth/ForgetPassword"];
```

### 2. **Added Dashboard to Protected Routes**
```javascript
const protectedRoutes = [
  "/api/user",
  "/api/profile",
  "/api/settings",
  "/dashboard",  // Added
];
```

### 3. **Skip Middleware for OAuth Callback**
```javascript
const skipRoutes = [
  "/api/auth",
  "/api/auth/google/callback",
];

// In middleware function
const shouldSkip = skipRoutes.some((route) => pathname.startsWith(route));
if (shouldSkip) {
  return NextResponse.next();
}
```
This prevents the middleware from checking the token during the OAuth callback redirect.

### 4. **Enhanced Google Callback to Set User Cookie**
In `/app/api/auth/google/callback/route.js`:
```javascript
// Set user data in non-HTTP-only cookie for client-side sync
response.cookies.set("user", JSON.stringify(userDataForCookie), {
  httpOnly: false,  // Allows JavaScript to read it
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60,
});
```

### 5. **Added Cookie-to-LocalStorage Sync in Layout**
In `/app/layout.js`:
```javascript
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      try {
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='))
          ?.split('=')[1];
        
        if (userCookie) {
          const userData = JSON.parse(decodeURIComponent(userCookie));
          localStorage.setItem('auth_user', JSON.stringify(userData));
          localStorage.setItem('oauth_synced', 'true');
        }
      } catch (e) {
        console.error('Failed to sync auth data from cookies:', e);
      }
    })();
  `,
}} />
```
This script runs on page load and copies the OAuth user data from cookies to localStorage.

### 6. **Updated Auth Context Initialization**
In `/app/context/AuthContext.jsx`:
```javascript
const oauthSynced = localStorage.getItem("oauth_synced") === "true";
const hasCookie = document.cookie.includes("accessToken=");

if (hasCookie && oauthSynced && storedUser) {
  hasAccessToken = true;
}

if (userToUse && hasAccessToken) {
  setUserState(userToUse);
  setIsAuthenticated(true);
  if (oauthSynced) {
    localStorage.removeItem("oauth_synced");
  }
}
```
This checks for the OAuth sync flag and existing token cookie to determine authentication state.

## Updated Error Redirect Paths
Changed error redirects in `/app/api/auth/google/callback/route.js` from `/auth/SignUp` to `/auth/Login` for consistency.

## Testing Steps

1. Go to Sign Up page
2. Click "Sign up with Google"
3. Complete Google authentication
4. Should be redirected to `/dashboard` (not back to `/auth/Login`)
5. Dashboard should show:
   - User's first and last name
   - Email address
   - Email verification status (verified for Google OAuth users)
   - Join date
6. Logout button should work correctly

## Technical Flow

```
1. User clicks Google Sign Up
   ↓
2. Redirected to Google OAuth consent
   ↓
3. Google redirects to /api/auth/google/callback?code=...
   ↓
4. Callback route:
   - Exchanges code for tokens
   - Creates user in database
   - Sets accessToken (HTTP-only cookie)
   - Sets user (non-HTTP-only cookie)
   - Redirects to /dashboard
   ↓
5. On page load:
   - Layout script syncs user cookie → localStorage
   - Sets oauth_synced flag
   ↓
6. Middleware checks /dashboard:
   - Sees accessToken cookie exists
   - Allows access to dashboard
   ↓
7. AuthContext initializes:
   - Finds oauth_synced flag
   - Finds user in localStorage
   - Sets isAuthenticated = true
   ↓
8. Dashboard renders with user data
```

## Files Modified

- `app/middleware.js` - Fixed route paths, added dashboard protection, skip auth routes
- `app/api/auth/google/callback/route.js` - Set user data in non-HTTP-only cookie
- `app/layout.js` - Added sync script for OAuth data
- `app/context/AuthContext.jsx` - Enhanced OAuth detection logic
- `lib/auth/storage.js` - Enhanced getUser() to check cookies as fallback

## Notes

- HTTP-only cookies are still used for security (server-side verification only)
- Non-HTTP-only `user` cookie contains only non-sensitive user metadata
- The token itself remains HTTP-only for maximum security
- OAuth sync flag is cleared after use to prevent repeated syncing
