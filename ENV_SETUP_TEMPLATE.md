# Environment Variables Setup

## Required Variables for `.env.local`

Create a `.env.local` file in the root directory with these variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_atlas_connection_string

# Google OAuth (from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secrets (use strong random strings)
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Email Service (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ⚠️ Security Note
- **NEVER commit `.env.local` to GitHub** (already in `.gitignore`)
- All credentials should only be in:
  - Local `.env.local` file
  - Vercel Environment Variables (for production)
- Use strong, random strings for JWT secrets

## Setup Steps

### 1. MongoDB Atlas
1. Create cluster at [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create database user with strong password
3. Whitelist your IP (or use 0.0.0.0/0 for development)
4. Copy connection string to `MONGODB_URI`

### 2. Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
7. Copy Client Secret to `GOOGLE_CLIENT_SECRET`

### 3. Gmail App Password
1. Enable 2-Factor Authentication on Gmail
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer" (or your device)
4. Copy generated password to `EMAIL_PASSWORD`

### 4. JWT Secrets
Generate random strings (min 32 characters):
```bash
# On macOS/Linux:
openssl rand -base64 32
```

## For Vercel Deployment

Add these same variables to Vercel dashboard:
1. Settings → Environment Variables
2. Add each variable from your `.env.local`
3. Mark `NEXT_PUBLIC_*` variables as public
4. Mark others as secret
5. Redeploy

See `VERCEL_DEPLOYMENT_GUIDE.md` for full deployment instructions.
