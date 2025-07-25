# Vercel Environment Variables Setup

## Required Environment Variables for Vercel

You need to add these environment variables in your Vercel dashboard:

### 1. **DATABASE_URL** (Already set)

```
DATABASE_URL=postgresql://neondb_owner:npg_S3Tl9RyYUOjH@ep-falling-dawn-a1fk267r-pooler.ap-southeast-1.aws.neon.tech/pos_db?sslmode=require&channel_binding=require
```

### 2. **NEXTAUTH_SECRET** (Required for authentication)

Generate a secure random string and add it:

```
NEXTAUTH_SECRET=your-secure-random-string-here
```

### 3. **NEXTAUTH_URL** (Required for NextAuth.js)

Set this to your Vercel domain:

```
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### 4. **APP_URL** (Required for API calls)

Set this to your Vercel domain (same as NEXTAUTH_URL):

```
APP_URL=https://pos-frontend-brown.vercel.app
```

## How to Add Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: Generate a random string (you can use: `openssl rand -base64 32`)
   - **Environment**: Production (and Preview if needed)
   - **Name**: `NEXTAUTH_URL`
   - **Value**: `https://pos-frontend-brown.vercel.app`
   - **Environment**: Production (and Preview if needed)
   - **Name**: `APP_URL`
   - **Value**: `https://pos-frontend-brown.vercel.app`
   - **Environment**: Production (and Preview if needed)
5. Redeploy your application

## Generate a Secure Secret:

```bash
# In terminal
openssl rand -base64 32
```

## After Adding Environment Variables:

1. Redeploy your application in Vercel
2. Try logging in with:
   - **Username**: `admin`
   - **Password**: `admin@123`

## Local Development Setup:

For local development, create a `.env.local` file in the frontend directory with:

```
# Database URL for local development (without SSL)
DATABASE_URL=postgresql://admin:admin123@localhost:5432/pos_db

# NextAuth Configuration
NEXTAUTH_SECRET=your-local-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# App URL for local development
APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Troubleshooting:

- If login still fails, check Vercel function logs for database connection errors
- Ensure your Neon database is active and accessible
- Verify all environment variables are set correctly
- For local development: Make sure your local PostgreSQL server is running and accessible
- SSL errors in local development: The app now automatically disables SSL for local development
