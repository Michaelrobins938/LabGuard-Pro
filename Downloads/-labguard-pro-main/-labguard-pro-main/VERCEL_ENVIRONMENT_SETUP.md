# 🔧 Vercel Environment Variables Setup

## Critical Environment Variables Required

Your Vercel deployment is failing because of missing environment variables. Add these to your Vercel dashboard:

### 1. Go to your Vercel Dashboard
- Visit https://vercel.com/dashboard
- Select your LabGuard Pro project
- Go to Settings → Environment Variables

### 2. Add These Required Variables:

#### **Authentication (CRITICAL)**
```bash
NEXTAUTH_SECRET=your-super-secret-nextauth-key-minimum-32-characters-long
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### **Database**
```bash
DATABASE_URL=your-postgresql-database-url
```

#### **Basic App Config**
```bash
JWT_SECRET=your-jwt-secret-key-here
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

#### **Optional: AI Services**
```bash
OPENAI_API_KEY=your-openai-key-if-you-have-one
NEXT_PUBLIC_BIOMNI_API_KEY=your-biomni-key-if-available
```

### 3. Quick Fix for NEXTAUTH_SECRET

Generate a secure secret:
```bash
# Use this command to generate a secure secret:
openssl rand -base64 32

# Or use this online generator:
# https://generate-secret.vercel.app/32
```

### 4. Database Setup

If you don't have a database yet:

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel project
2. Click "Storage" tab
3. Create new Postgres database
4. Copy the DATABASE_URL to environment variables

#### Option B: Supabase (Free)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string to DATABASE_URL

### 5. After Adding Variables:

1. Go to Vercel Deployments
2. Click "Redeploy" on latest deployment
3. Or push any commit to trigger new deployment

## Current Issue: NEXTAUTH_SECRET Missing

The error `Configuration` in your login page indicates NextAuth can't initialize properly without the NEXTAUTH_SECRET.

**Quick Fix:**
1. Add NEXTAUTH_SECRET environment variable in Vercel
2. Set value to any string longer than 32 characters
3. Redeploy

Example:
```
NEXTAUTH_SECRET=labguard-pro-super-secure-secret-key-2024-production-deployment
```

## Test After Setup:

1. Visit your homepage: https://your-domain.vercel.app
2. Navigation should work properly
3. Only /dashboard routes should require login
4. Public pages (/, /about, /pricing, etc.) should work without authentication 