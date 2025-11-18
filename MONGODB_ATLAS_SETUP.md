# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Sign Up**
3. Enter your email and password
4. Click **Create account**
5. Verify your email

## Step 2: Create a New Project

1. After login, click **Create** → **New Project**
2. Enter project name (e.g., "Form-Validation")
3. Click **Next**
4. Select members (just you for now)
5. Click **Create Project**

## Step 3: Build Your Cluster

1. Click **Create** → **Build a Cluster**
2. Choose **Free Tier** (perfect for development)
3. Select your **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Select your **Region** (choose closest to you)
5. Cluster name (default "Cluster0" is fine)
6. Click **Create Cluster** (wait 2-3 minutes for creation)

## Step 4: Get Your Connection String

1. Once cluster is created, click **Connect**
2. Click **Drivers**
3. Select **Node.js** and version **5.9 or later**
4. Copy the connection string

**Example format:**
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

## Step 5: Create Database User

Before connecting, you need a database user:

1. In **Connect** dialog, click **Create a database user**
2. **Username**: Choose any username (e.g., "formuser")
3. **Password**: Create a strong password (save it!)
4. **Database User Privileges**: Keep as "Atlas admin"
5. Click **Create Database User**

## Step 6: Whitelist Your IP

1. In **Connect** dialog, click **Add My Current IP Address**
   - Or manually add: **0.0.0.0/0** (allows any IP - only for development!)
2. Click **Add Entry**

## Step 7: Build Your Connection String

Your connection string will look like:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/auth?retryWrites=true&w=majority
```

**Replace:**
- `username` = your database username
- `password` = your database password
- `cluster0.abc123` = your actual cluster address

## Step 8: Update .env.local

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/auth?retryWrites=true&w=majority

JWT_SECRET=3ceb0cc466198fb0b2f51f70f94aa094d11f0c3d3e0ca6580d039b79a946647e
JWT_REFRESH_SECRET=13a3247da22c0fcfd62912080e40ce0af42628832ab165a3657893803fc68ece

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 9: Test Connection

1. Save `.env.local`
2. Run dev server: `npm run dev`
3. Go to http://localhost:3000/auth/signup
4. Try creating an account
5. Check MongoDB Atlas to see if user was created:
   - Go to Clusters → Browse Collections
   - Check "auth" database → "users" collection

## Troubleshooting

### "Authentication failed"
- Check username/password in connection string
- Make sure user was created in Step 5

### "IP not whitelisted"
- Go to Network Access
- Add your IP (or 0.0.0.0/0 for development)

### "Connect timeout"
- Check internet connection
- Verify cluster is running (green status in Clusters)
- Try again in 5 minutes if cluster just created

## Security Note

- Never commit `.env.local` to Git (already in .gitignore)
- For production, use IP whitelist, not 0.0.0.0/0
- Use strong database passwords
