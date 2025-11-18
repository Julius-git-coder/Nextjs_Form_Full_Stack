# Backend Integration Implementation Plan

## Phase 1: Core Backend Setup (High Priority)

### 1.1 Database & Auth API Routes
- [ ] Create `app/api/auth/signup/route.js` - User registration
- [ ] Create `app/api/auth/login/route.js` - User login
- [ ] Create `app/api/auth/refresh-token/route.js` - Token refresh
- [ ] Create `app/api/auth/logout/route.js` - Logout
- [ ] Create `app/api/auth/verify-email/route.js` - Email verification
- [ ] Create `app/api/auth/forgot-password/route.js` - Password reset request
- [ ] Create `app/api/auth/reset-password/route.js` - Password reset confirmation

### 1.2 Authentication Utilities
- [ ] Create `lib/auth/jwt.js` - JWT sign/verify functions
- [ ] Create `lib/auth/password.js` - Password hashing (bcrypt)
- [ ] Create `lib/auth/tokens.js` - Token generation and validation
- [ ] Create `lib/api-client.js` - API client with auto token refresh

### 1.3 Token Management
- [ ] Implement localStorage token storage with encryption
- [ ] Create `lib/auth/storage.js` - Secure token storage
- [ ] Create token refresh mechanism
- [ ] Handle token expiration gracefully

### 1.4 Error Handling & Error Boundary
- [ ] Create `app/components/ErrorBoundary.jsx` - Error boundary component
- [ ] Create `lib/errors/AppError.js` - Custom error class
- [ ] Create `lib/errors/handler.js` - Error handling utilities
- [ ] Add error logging service

## Phase 2: Frontend Integration (High Priority)

### 2.1 Update useAuthForm Hook
- [ ] Add API calls for signup
- [ ] Add API calls for login
- [ ] Add API calls for forgot-password
- [ ] Handle token storage after login
- [ ] Add error handling for API failures

### 2.2 Middleware & Route Protection
- [ ] Create `middleware.js` - Route protection middleware
- [ ] Add protected route wrapper component
- [ ] Implement route guards for auth pages
- [ ] Add redirect logic for unauthenticated users

### 2.3 Context API for Auth State
- [ ] Create `app/context/AuthContext.jsx` - Global auth state
- [ ] Create `useAuth` hook for consuming auth state
- [ ] Implement auth state persistence
- [ ] Handle auto-login on app load

## Phase 3: Enhanced Features (Medium Priority)

### 3.1 Loading States & UX
- [ ] Add global loading indicator
- [ ] Add toast notifications
- [ ] Update form submission feedback
- [ ] Add skeleton loaders

### 3.2 Form Persistence
- [ ] Implement draft saving to localStorage
- [ ] Create `lib/storage/formStorage.js`
- [ ] Auto-restore form on page load
- [ ] Clear draft after successful submission

### 3.3 Email Verification
- [ ] Add email verification step after signup
- [ ] Create verification email template
- [ ] Implement verification link handling
- [ ] Add resend verification email

### 3.4 Password Reset Flow
- [ ] Implement forgot password email flow
- [ ] Create reset link generation
- [ ] Add reset link validation
- [ ] Implement new password confirmation

## Phase 4: Accessibility & Animations (Medium Priority)

### 4.1 Accessibility
- [ ] Add ARIA labels to all form fields
- [ ] Add ARIA descriptions for errors
- [ ] Implement keyboard navigation
- [ ] Add focus management

### 4.2 Internationalization (i18n)
- [ ] Install `next-intl`
- [ ] Create translation files (en, es, fr, etc.)
- [ ] Add language switcher
- [ ] Implement locale routing

### 4.3 Animations
- [ ] Add Framer Motion transitions to forms
- [ ] Add success/error animations
- [ ] Add page transition animations
- [ ] Add loading state animations

## Dependencies to Install
```bash
npm install bcrypt jsonwebtoken next-intl next-auth
npm install --save-dev @types/node
```

## File Structure to Create
```
app/
├── api/auth/
│   ├── signup/route.js
│   ├── login/route.js
│   ├── logout/route.js
│   ├── refresh-token/route.js
│   ├── verify-email/route.js
│   ├── forgot-password/route.js
│   └── reset-password/route.js
├── components/
│   ├── ErrorBoundary.jsx
│   ├── ProtectedRoute.jsx
│   └── LoadingIndicator.jsx
├── context/
│   └── AuthContext.jsx
├── middleware.js
└── hooks/
    └── useAuth.js
lib/
├── auth/
│   ├── jwt.js
│   ├── password.js
│   ├── tokens.js
│   └── storage.js
├── api-client.js
├── errors/
│   ├── AppError.js
│   └── handler.js
└── storage/
    └── formStorage.js
```

## Database Schema (Example - MongoDB)
```javascript
User {
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String (hashed),
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps
1. Install dependencies
2. Create database connection
3. Implement Phase 1 API routes
4. Test each endpoint with Postman/Insomnia
5. Update frontend hooks with API calls
6. Implement error handling
7. Add remaining features in order
