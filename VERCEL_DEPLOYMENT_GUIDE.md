# Vercel Deployment Guide

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click **"Add New"** → **"Project"**
4. Select your GitHub repository: `Julius-git-coder/Nextjs_Form_Full_Stack`
5. Click **"Import"**

## Step 3: Configure Environment Variables

In the Vercel dashboard for your project:

### A. Add Each Variable Individually

1. Go to **Settings** → **Environment Variables**
2. Add these variables from your `.env.local`:

```
MONGODB_URI=your_mongodb_atlas_uri
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key (if using email)
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

3. **Important**: Mark variables as:
   - **Public** (visible in browser): `NEXT_PUBLIC_*` variables
   - **Secret** (server-only): All others

### B. Or Upload .env.local File

1. Go to **Settings** → **Environment Variables**
2. Copy the content of your `.env.local`
3. Paste it in the text area
4. Click **"Add to .env.local"**

## Step 4: Environment Variable Naming

**Your variables in `.env.local`:**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx      ✓ Public (browser-safe)
MONGODB_URI=xxx                       ✓ Secret (server-only)
JWT_SECRET=xxx                        ✓ Secret (server-only)
GOOGLE_CLIENT_SECRET=xxx              ✓ Secret (server-only)
```

- Variables starting with `NEXT_PUBLIC_` are sent to browser
- All others are server-only
- Vercel auto-detects which is which

## Step 5: Deploy

### Option A: Automatic Deployment
- Push to `main` branch → Vercel auto-deploys

### Option B: Manual Deployment
1. In Vercel dashboard
2. Click **"Deployments"**
3. Click **"Deploy"** button
4. Select branch: `main`
5. Click **"Deploy"**

## Step 6: Verify Deployment

```bash
# Check deployment logs
vercel logs

# View your live app
https://your-project.vercel.app
```

## Troubleshooting

### ❌ "Environment variable not found" error

**Solution**: 
1. Verify variable is added in Vercel dashboard
2. Variable name matches exactly (case-sensitive)
3. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```

### ❌ MongoDB connection fails

**Verify**:
- `MONGODB_URI` is correct in Vercel
- MongoDB Atlas allows Vercel's IP (0.0.0.0/0)
- Connection string includes username & password

### ❌ Google Auth not working

**Verify**:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` matches Google Cloud Console
- Add Vercel domain to Google OAuth authorized redirect URIs:
  ```
  https://your-project.vercel.app/api/auth/google/callback
  https://your-project.vercel.app
  ```

### ❌ JWT errors

**Verify**:
- `JWT_SECRET` is the same as in development
- It's set as a **secret** variable (not public)

## Environment Variables Checklist

- [ ] MONGODB_URI (MongoDB Atlas connection string)
- [ ] NEXT_PUBLIC_GOOGLE_CLIENT_ID (Google OAuth Client ID)
- [ ] GOOGLE_CLIENT_SECRET (Google OAuth Client Secret)
- [ ] JWT_SECRET (Any long random string for JWT signing)
- [ ] All variables from `.env.local` are in Vercel dashboard
- [ ] `NEXT_PUBLIC_*` variables are marked as public
- [ ] Other variables are marked as secret
- [ ] Redeploy after adding variables

## Useful Commands

```bash
# List all environment variables
vercel env ls

# Pull environment variables from Vercel to local
vercel env pull

# Deploy production
vercel --prod

# View logs
vercel logs --follow
```

## MongoDB Atlas Setup for Vercel

1. Go to MongoDB Atlas dashboard
2. Click **"Network Access"**
3. Add IP Address: **0.0.0.0/0** (Allow anywhere)
   - This is required because Vercel IPs are dynamic
   - Keep your database password complex for security
4. Copy connection string
5. Add to Vercel as `MONGODB_URI`

## Security Best Practices

✅ Never commit `.env.local` (already in `.gitignore`)
✅ Keep secret variables as "Secret" in Vercel
✅ Use strong `JWT_SECRET` (minimum 32 characters)
✅ Rotate credentials regularly
✅ Use environment-specific variables (dev vs prod)
✅ Monitor MongoDB Atlas for unauthorized access

## Next Steps After Deployment

1. Test auth flow on Vercel domain
2. Check logs if any issues: `vercel logs --follow`
3. Update Google OAuth redirect URIs
4. Update your app links in documentation
5. Monitor error logs in Vercel dashboard

Your app is now live on Vercel! 🚀
