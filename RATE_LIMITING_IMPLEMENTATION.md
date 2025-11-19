# Rate Limiting Implementation - 3 Attempts Per Week

## Overview
Password reset and email verification requests are now rate-limited to **3 attempts per 7-day (week) period** per user.

## Changes Made

### 1. Database Schema Updates
**File**: `lib/models/User.js`

Added two new array fields to track attempts:
- `passwordResetAttempts[]` - Array of timestamps for password reset requests
- `emailVerificationAttempts[]` - Array of timestamps for email verification requests

Each array contains objects with a `timestamp` field automatically set to the current time.

### 2. Database Helper Functions
**File**: `lib/db-helpers.js`

Added 4 new functions:

#### `checkPasswordResetAttempts(userId)`
- Checks how many password reset attempts were made in the last 7 days
- Returns object with:
  - `allowed` (boolean) - Whether user can make another attempt
  - `attemptCount` (number) - Current attempts in the week
  - `remainingAttempts` (number) - Attempts left (0-3)
  - `nextResetTime` (Date) - When rate limit resets (if blocked)

#### `recordPasswordResetAttempt(userId)`
- Records a new password reset attempt by adding timestamp to the array
- Called after successful email send

#### `checkEmailVerificationAttempts(userId)`
- Same as password reset version but for email verification
- Returns same data structure

#### `recordEmailVerificationAttempt(userId)`
- Records a new email verification attempt
- Called after successful email send

### 3. Forgot Password Endpoint
**File**: `app/api/auth/forgot-password/route.js`

**Changes**:
- Added rate limit check before sending reset email
- Returns 429 (Too Many Requests) if limit exceeded
- Includes next reset time in error response
- Returns remaining attempts in success response

**Response on rate limit (429)**:
```json
{
  "message": "Too many password reset requests. You can request a reset again after <datetime>",
  "remainingAttempts": 0,
  "nextResetTime": "2025-01-26T14:30:00.000Z"
}
```

**Response on success (200)**:
```json
{
  "message": "If an account exists with this email, a password reset link will be sent",
  "remainingAttempts": 2
}
```

### 4. Email Verification Request Endpoint
**File**: `app/api/auth/request-verification/route.js` (NEW)

Created new endpoint for requesting email verification with same rate limiting.

**Endpoint**: `POST /api/auth/request-verification`
**Rate Limit**: 3 attempts per 7 days

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response**: Same structure as forgot-password endpoint

## How It Works

### Rate Limit Calculation
1. When a request is made, system checks all attempts from the last 7 days
2. If `attemptCount >= 3`, request is blocked (429 status)
3. If blocked, `nextResetTime` = oldest attempt timestamp + 7 days
4. After 7 days, oldest attempt falls outside the window, freeing up one slot

### Example Timeline
- Day 1: User makes attempt 1 (1/3 available)
- Day 2: User makes attempt 2 (0/3 available)
- Day 3: User makes attempt 3 (0/3 available - blocked)
- Day 3: User blocked until Day 8 (first attempt expires)
- Day 8: Attempt 1 is now outside 7-day window, user has 1/3 available again

## Frontend Integration

The frontend (AuthContext.jsx) already handles the API responses:
- On success: Shows toast notification with remaining attempts
- On 429: Shows error message with next reset time
- Attempts to call the endpoint will automatically include the response data

## API Client Handling

The existing `apiClient` in `lib/api-client.js` automatically:
- Sends requests to the new endpoints
- Handles error responses with status codes
- Can be used by frontend to show rate limit warnings

## Testing Rate Limits

To test rate limiting:

1. **Test Password Reset**:
   ```bash
   # First 3 requests should succeed
   curl -X POST http://localhost:3000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   
   # 4th request should return 429
   curl -X POST http://localhost:3000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

2. **Test Email Verification**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/request-verification \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

## Security Notes

- Rate limiting is user-based (per userId after user exists)
- For non-existent emails, no rate limit is applied (security best practice)
- Timestamps are stored in MongoDB with automatic indexing
- Cleanup of old attempts is not implemented (optional optimization)
- Rate limit window is exactly 7 days from each attempt

## Future Enhancements

1. **Cleanup Job**: Add periodic cleanup to remove attempts older than 7 days
2. **IP-Based Limiting**: Additional layer for non-authenticated endpoints
3. **Exponential Backoff**: Progressive delays between attempts
4. **Redis Cache**: Optional caching for faster rate limit checks
5. **Admin Override**: Allow admins to reset attempt counters

## Database Indexes (Recommended)

For better performance with large user bases:
```javascript
// Add to User schema pre-save hook
userSchema.index({ 'passwordResetAttempts.timestamp': 1 });
userSchema.index({ 'emailVerificationAttempts.timestamp': 1 });
```
