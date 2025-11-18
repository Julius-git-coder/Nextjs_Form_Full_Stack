# OAuth and Email Setup Guide

## Email Configuration (Gmail)

For password reset and verification emails, we use Nodemailer with Gmail.

### Step 1: Enable Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification (if not already enabled)
3. Go to App passwords
4. Select "Mail" and "Windows Computer" (or your device)
5. Google will generate a 16-character password
6. Copy this password

### Step 2: Add Email Credentials to .env.local

```env
# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
```

### Step 3: Test Email

The email service will automatically test on server startup. Check the console for confirmation.

---

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to https://console.cloud.google.com/
2. Create a new project (e.g., "Form Validation")
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
4. Select "Web Application"
5. Add authorized origins:
   - `http://localhost:3000`
   - `https://yourdomain.com` (production)
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/signup` (or your signup page)
   - `https://yourdomain.com/auth/signup`
7. Copy the Client ID and Client Secret

### Step 2: Add Google Credentials to .env.local

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 3: Install Google Sign-In Button

In your signup page, add:

```jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function SignUp() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={credentialResponse => {
          // Send credentialResponse.credential (idToken) to your /api/auth/google endpoint
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
}
```

Install the package:
```bash
npm install @react-oauth/google
```

---

## Apple OAuth Setup

### Step 1: Create Apple Sign In Credentials

1. Go to https://developer.apple.com/
2. Sign in with your Apple ID
3. Go to "Certificates, Identifiers & Profiles"
4. Select "Identifiers" → Create a new identifier
5. Choose "App IDs"
6. Enable "Sign in with Apple"
7. Go to "Keys" and create a new key
8. Enable "Sign in with Apple"
9. Download the .p8 file (keep it safe)
10. Note your Team ID and Key ID

### Step 2: Add Apple Credentials to .env.local

```env
# Apple Sign In
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_BUNDLE_ID=com.yourcompany.app
APPLE_KEY_PATH=./path/to/your/key.p8
APPLE_REDIRECT_URI=https://yourdomain.com/api/auth/apple/callback
```

### Step 3: Add Apple Sign In Button

```jsx
import AppleID from 'react-apple-signin-button';

export default function SignUp() {
  const handleAppleSignIn = (response) => {
    // Send response to /api/auth/apple endpoint
  };

  return (
    <AppleID
      clientID={process.env.NEXT_PUBLIC_APPLE_CLIENT_ID}
      redirectURI={process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI}
      usePopup={true}
      onSuccess={handleAppleSignIn}
    />
  );
}
```

Install the package:
```bash
npm install react-apple-signin-button
```

---

## Complete .env.local Example

```env
# MongoDB
MONGODB_URI=mongodb+srv://daganajulius5_db_user:FkG5jdgV14sS46IH@cluster0.yp2bfbw.mongodb.net/auth?retryWrites=true&w=majority

# JWT
JWT_SECRET=3ceb0cc466198fb0b2f51f70f94aa094d11f0c3d3e0ca6580d039b79a946647e
JWT_REFRESH_SECRET=13a3247da22c0fcfd62912080e40ce0af42628832ab165a3657893803fc68ece

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
USE_MONGODB=true

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple Sign In
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_BUNDLE_ID=com.yourcompany.app
NEXT_PUBLIC_APPLE_CLIENT_ID=your-apple-client-id
```

---

## API Endpoints

### Google Authentication
**POST** `/api/auth/google`

Request:
```json
{
  "idToken": "google-id-token",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profileImage": "url-to-image"
}
```

Response:
```json
{
  "message": "Google authentication successful",
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Apple Authentication
**POST** `/api/auth/apple`

Request:
```json
{
  "idToken": "apple-id-token",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "message": "Apple authentication successful",
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Forgot Password
**POST** `/api/auth/forgot-password`

Request:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "message": "If an account exists with this email, a password reset link will be sent"
}
```

A password reset link will be sent to the user's email. The link includes a token that expires in 1 hour.

---

## Password Reset Flow

1. User clicks "Forgot Password" on login page
2. User enters email address
3. System sends reset link via email (valid for 1 hour)
4. User clicks link in email
5. User enters new password
6. Password is updated and user can login

---

## Troubleshooting

### Email not sending
- Check EMAIL_USER and EMAIL_PASSWORD in .env.local
- Make sure Gmail App Password is correct (16 characters)
- Check console for error messages
- Make sure 2-Step Verification is enabled

### Google OAuth not working
- Verify NEXT_PUBLIC_GOOGLE_CLIENT_ID is correct
- Check authorized origins and redirect URIs in Google Console
- Clear browser cache and cookies
- Check browser console for errors

### Apple Sign In not working
- Verify Apple Team ID and Key ID
- Make sure .p8 key file path is correct
- Check authorized domains in Apple Developer settings
- Ensure APPLE_BUNDLE_ID matches your app configuration

---

## Security Notes

- Never commit .env.local to Git
- Store sensitive credentials securely
- Use app-specific passwords for email (not main account password)
- Rotate OAuth keys regularly
- Use HTTPS in production (not HTTP)
