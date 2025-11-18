# Complete Setup Guide: Email, Google, and Apple

---

## Part 1: Gmail Setup for Password Reset Emails

### Step 1.1: Enable 2-Step Verification

1. Open https://myaccount.google.com
2. Click **"Security"** in left sidebar
3. Scroll down to **"How you sign in to Google"**
4. Click **"2-Step Verification"**
5. Click **"Get Started"**
6. Follow the prompts:
   - Enter your password
   - Verify using your phone (SMS or authenticator app)
   - Confirm setup
7. You'll see "2-Step Verification is on"

### Step 1.2: Generate Gmail App Password

1. Still in Google Account settings, go back to **"Security"**
2. Scroll down to **"App passwords"** (only appears after 2FA is enabled)
3. **Select App**: Choose "Mail"
4. **Select Device**: Choose "Windows Computer" (or your device)
5. Google generates a **16-character password**
6. **COPY THIS PASSWORD** - you'll need it

**Example password:**
```
abcd efgh ijkl mnop
```
(Remove spaces when using)

### Step 1.3: Update .env.local

Open `.env.local` and update:

```env
# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=your-email@gmail.com
```

Replace:
- `your-email@gmail.com` with your actual Gmail
- `abcdefghijklmnop` with your 16-char app password (no spaces)

### Step 1.4: Test Email (Optional)

Run your app:
```bash
npm run dev
```

Check the terminal for: `"Email service is configured correctly"`

---

## Part 2: Google OAuth Setup

### Step 2.1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click **"Select a Project"** at the top
3. Click **"NEW PROJECT"**
4. **Project name**: `Form Validation` (or any name)
5. Click **"CREATE"**
6. Wait 1-2 minutes for project creation

### Step 2.2: Enable Google Sign-In API

1. In the left sidebar, click **"APIs & Services"**
2. Click **"+ ENABLE APIS AND SERVICES"**
3. Search: `Google+ API`
4. Click the first result
5. Click **"ENABLE"**
6. Wait for it to complete

### Step 2.3: Create OAuth 2.0 Credentials

1. In left sidebar, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth 2.0 Client ID"**
4. You'll see: "To create an OAuth client ID, you must first set up your OAuth consent screen"
5. Click **"CONFIGURE CONSENT SCREEN"**

### Step 2.4: Configure OAuth Consent Screen

1. Select **"External"** (for testing)
2. Click **"CREATE"**
3. **App name**: `Form Validation`
4. **User support email**: Your email
5. **Developer contact**: Your email
6. Click **"SAVE AND CONTINUE"**
7. Skip scopes (click "SAVE AND CONTINUE")
8. Skip test users (click "SAVE AND CONTINUE")
9. Review and click **"BACK TO DASHBOARD"**

### Step 2.5: Create OAuth Client ID

1. Click **"Credentials"** in left sidebar again
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth 2.0 Client ID"**
4. **Application type**: Select **"Web application"**
5. **Name**: `Form Validation Web`
6. Under **"Authorized JavaScript origins"**, click **"+ ADD URI"**
   - Add: `http://localhost:3000`
   - Add: `https://yourdomain.com` (for production later)
7. Under **"Authorized redirect URIs"**, click **"+ ADD URI"**
   - Add: `http://localhost:3000/auth/signup`
   - Add: `https://yourdomain.com/auth/signup` (for production)
8. Click **"CREATE"**
9. A popup shows your credentials - **COPY THESE**

**You should see:**
- Client ID: `xxxxxxx.apps.googleusercontent.com`
- Client Secret: `xxxxxxxxxxxxxx`

### Step 2.6: Update .env.local

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxx
```

Replace with your actual values from Step 2.5.

---

## Part 3: Apple Sign-In Setup

### Step 3.1: Create Apple Developer Account

1. Go to https://developer.apple.com/
2. Sign in with your Apple ID (create one if needed)
3. Go to **"Account"** → **"Certificates, IDs & Profiles"**

### Step 3.2: Register Your App Bundle ID

1. Click **"Identifiers"** in left sidebar
2. Click **"+"** to create a new identifier
3. Select **"App IDs"**
4. Click **"Continue"**
5. **Description**: `Form Validation`
6. **Bundle ID**: `com.yourcompany.formvalidation`
   - (Use your company name, or `com.example.formvalidation`)
7. Scroll down and enable **"Sign in with Apple"**
8. Click **"Continue"** → **"Register"**
9. **Note your Bundle ID** (you'll need it)

### Step 3.3: Create a Services ID for Web

1. Click **"Identifiers"** in left sidebar
2. Click **"+"** to create new identifier
3. Select **"Services IDs"**
4. Click **"Continue"**
5. **Description**: `Form Validation Web`
6. **Identifier**: `com.yourcompany.formvalidation.web`
7. Enable **"Sign in with Apple"**
8. Click **"Configure"**
9. Add website:
   - **Domain**: `localhost` (for development)
   - **Return URL**: `http://localhost:3000/api/auth/apple/callback`
10. Add website (for production):
    - **Domain**: `yourdomain.com`
    - **Return URL**: `https://yourdomain.com/api/auth/apple/callback`
11. Click **"Save"**
12. **Note your Services ID** (you'll need it)

### Step 3.4: Create a Private Key

1. Click **"Keys"** in left sidebar
2. Click **"+"** to create new key
3. **Key Name**: `Form Validation Key`
4. Enable **"Sign in with Apple"**
5. Click **"Configure"**
6. Select the Bundle ID you created (from Step 3.2)
7. Click **"Save"**
8. Click **"Continue"**
9. Click **"Register"**
10. **Download the .p8 file** - SAVE THIS SAFELY
11. **Note the Key ID** shown on screen

### Step 3.5: Get Your Team ID

1. In the top right of Apple Developer, click your name
2. Click **"Membership"**
3. Find **"Team ID"** - copy it

### Step 3.6: Update .env.local

```env
# Apple Sign-In
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_KEY_ID=XXXXXXXXXX
APPLE_BUNDLE_ID=com.yourcompany.formvalidation
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.formvalidation.web
```

Replace:
- `APPLE_TEAM_ID` - from Step 3.5
- `APPLE_KEY_ID` - from Step 3.4
- `com.yourcompany.formvalidation` - your bundle ID from Step 3.2
- `com.yourcompany.formvalidation.web` - your services ID from Step 3.3

---

## Complete .env.local Example

After all steps, your `.env.local` should look like:

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
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxx

# Apple Sign-In
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_KEY_ID=XXXXXXXXXX
APPLE_BUNDLE_ID=com.yourcompany.formvalidation
NEXT_PUBLIC_APPLE_CLIENT_ID=com.yourcompany.formvalidation.web
```

---

## Testing

### Test 1: Email Verification
1. Run: `npm run dev`
2. Go to login page
3. Click "Forgot Password"
4. Enter your email
5. Check your email for reset link
6. Click link (should work for 1 hour)

### Test 2: Google Sign-In (After adding button to SignUp page)
1. Click Google Sign-In button
2. Complete Google login
3. Should create/login user
4. Should appear in MongoDB

### Test 3: Apple Sign-In (After adding button to SignUp page)
1. Click Apple Sign-In button
2. Complete Apple login
3. Should create/login user
4. Should appear in MongoDB

---

## Troubleshooting

### Email not sending
**Problem**: "Failed to send email"
- **Solution**: Check EMAIL_USER and EMAIL_PASSWORD are correct
- **Solution**: Make sure you used App Password (not regular password)
- **Solution**: Enable 2-Step Verification in Gmail

### Google OAuth not working
**Problem**: "Invalid client ID"
- **Solution**: Check NEXT_PUBLIC_GOOGLE_CLIENT_ID is exact copy
- **Solution**: Verify http://localhost:3000 is in authorized origins
- **Solution**: Clear browser cache and try again

### Apple Sign-In not working
**Problem**: "Invalid bundle ID"
- **Solution**: Check APPLE_BUNDLE_ID matches Apple Developer
- **Solution**: Make sure Services ID is configured for localhost
- **Solution**: Use Safari for testing (Apple Sign-In best on Safari)

---

## Security Notes

🔒 **Keep These Secret:**
- EMAIL_PASSWORD (16-char Gmail app password)
- GOOGLE_CLIENT_SECRET
- APPLE_TEAM_ID
- APPLE_KEY_ID

✅ **These are Public (ok to expose):**
- NEXT_PUBLIC_GOOGLE_CLIENT_ID (starts with NEXT_PUBLIC_)
- NEXT_PUBLIC_APPLE_CLIENT_ID (starts with NEXT_PUBLIC_)
- NEXT_PUBLIC_APP_URL

⚠️ **Never:**
- Commit `.env.local` to Git
- Share credentials in chat/email
- Use real passwords for app passwords
- Leave secrets in frontend code

---

## Summary Checklist

- [ ] Gmail 2-Step Verification enabled
- [ ] Gmail App Password generated (16 chars)
- [ ] Gmail credentials added to .env.local
- [ ] Google Cloud Project created
- [ ] Google Sign-In API enabled
- [ ] OAuth consent screen configured
- [ ] Google OAuth credentials created
- [ ] Google credentials added to .env.local
- [ ] Apple Developer account set up
- [ ] Apple Bundle ID created
- [ ] Apple Services ID created
- [ ] Apple Private Key downloaded
- [ ] Apple credentials added to .env.local
- [ ] `.env.local` saved

Once all checked, run:
```bash
npm run dev
```

Your app is ready for testing!
