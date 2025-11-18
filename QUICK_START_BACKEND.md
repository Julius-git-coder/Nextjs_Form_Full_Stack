# Quick Start - Backend Integration

## Installation

1. **Install dependencies:**
```bash
npm install
```

## Environment Setup

2. **Create `.env.local` file in the root directory:**
```env
JWT_SECRET=your-super-secret-key-change-in-production-12345
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production-67890
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running the App

3. **Start the development server:**
```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

## Testing the Complete Flow

### 1. Sign Up
- Go to `/auth/SignUp`
- Fill in form with:
  - First Name: John
  - Last Name: Doe
  - Email: john@example.com
  - Password: password123 (min 6 chars)
  - Accept Terms: check
- Click "Join us"
- Should redirect to `/dashboard` on success

### 2. Login
- Go to `/auth/Login`
- Use credentials from signup:
  - Email: john@example.com
  - Password: password123
- Click "Login"
- Should redirect to `/dashboard`

### 3. Forgot Password
- Go to `/auth/ForgetPassword`
- Enter email: john@example.com
- Click "Send Reset Link"
- Should show success message (email sending not implemented yet)

### 4. Dashboard
- After login, you'll see:
  - User profile information
  - Email verification status
  - Member since date
  - List of implemented features
  - Logout button

### 5. Logout
- Click "Logout" on dashboard
- Should redirect to `/auth/Login`
- Tokens cleared from localStorage

## API Endpoints (Available Now)

All endpoints use POST requests:

| Endpoint | Request | Response |
|----------|---------|----------|
| `/api/auth/signup` | `{firstName, lastName, email, password}` | `{user, accessToken, refreshToken}` |
| `/api/auth/login` | `{email, password}` | `{user, accessToken, refreshToken}` |
| `/api/auth/logout` | `{}` | `{message}` |
| `/api/auth/refresh-token` | `{refreshToken}` | `{accessToken}` |
| `/api/auth/forgot-password` | `{email}` | `{message}` |
| `/api/auth/reset-password` | `{token, newPassword}` | `{user, message}` |
| `/api/auth/verify-email` | `{token}` | `{user, message}` |

## Testing with cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@test.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'

# Refresh Token (use accessToken from response)
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

## What's Implemented

✅ **Backend**
- User registration with validation
- User login with JWT tokens
- Token refresh mechanism
- Password hashing (bcryptjs)
- Form validation
- Error handling

✅ **Frontend**
- Auth forms (Login, Signup, Forgot Password)
- Error boundary for crash protection
- Loading indicators
- Protected routes
- Global auth context
- Auth state persistence
- Dashboard page

✅ **Security**
- JWT token management
- Secure token storage (localStorage)
- Password hashing
- Token expiry checking
- Auto token refresh

## Important Notes

### Current Limitations
- Uses in-memory storage (users stored in memory)
- Email sending not implemented
- No database integration yet
- Tokens reset on server restart

### For Production
Before deploying to production:
1. Connect to a real database (MongoDB, PostgreSQL, etc.)
2. Implement email service (SendGrid, AWS SES, Mailgun)
3. Set strong JWT secrets in environment
4. Add rate limiting
5. Enable HTTPS
6. Implement CSRF protection
7. Add request logging
8. Set up monitoring

## Troubleshooting

### App won't start
```bash
# Clear next cache
rm -rf .next
npm run dev
```

### Can't signup/login
1. Check browser console for errors
2. Check network tab in DevTools
3. Verify JWT_SECRET in .env.local is set

### Tokens not persisting
- Check localStorage in browser DevTools
- Make sure not in incognito/private mode

### Redirect issues
- Check that `/dashboard` page exists
- Verify AuthContext is wrapping the app in layout.js

## Next Steps

After verifying the basic flow:
1. Connect to a real database
2. Implement email verification
3. Add password reset email flow
4. Implement i18n (multi-language)
5. Add accessibility improvements
6. Add form persistence
7. Add animations with Framer Motion

## Support

For issues or questions:
1. Check IMPLEMENTATION_STATUS.md for completed features
2. Check BACKEND_INTEGRATION_PLAN.md for the overall plan
3. Review error messages in browser console
4. Check API response in Network tab

Happy coding! 🚀
