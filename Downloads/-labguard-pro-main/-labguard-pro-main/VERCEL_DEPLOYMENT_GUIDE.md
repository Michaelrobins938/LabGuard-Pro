# 🚀 Vercel Deployment Guide for LabGuard Pro

This guide will help you deploy LabGuard Pro to Vercel with a working database and authentication system.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: You'll need a PostgreSQL database (recommended: Neon, Supabase, or Railway)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## 🗄️ Step 1: Set Up Database

### Option A: Neon (Recommended - Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string from the dashboard
5. It will look like: `postgresql://username:password@host/database`

### Option B: Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string

### Option C: Railway (Free Tier)
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add a PostgreSQL database
4. Copy the connection string

## 🔧 Step 2: Deploy to Vercel

### 2.1 Connect Repository
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the repository containing LabGuard Pro

### 2.2 Configure Project Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (or the directory containing your Next.js app)
- **Build Command**: `npm run build` (should be automatic)
- **Output Directory**: `.next` (should be automatic)

### 2.3 Set Environment Variables
In the Vercel project settings, add these environment variables:

```bash
# Required
DATABASE_URL=your_postgresql_connection_string_here
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Optional (if using NextAuth)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

### 2.4 Deploy
Click "Deploy" and wait for the build to complete.

## 🗃️ Step 3: Set Up Database Schema

After deployment, you need to push the database schema:

### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.local

# Push database schema
npx prisma db push
```

### Option B: Using Database Dashboard
1. Go to your database provider's dashboard
2. Open the SQL editor
3. Run the Prisma schema (you can generate it with `npx prisma db push --print`)

### Option C: Using Prisma Studio (if accessible)
```bash
# Pull environment variables first
vercel env pull .env.local

# Open Prisma Studio
npx prisma studio
```

## 🧪 Step 4: Test Your Deployment

### 4.1 Health Check
Visit: `https://your-vercel-domain.vercel.app/api/health`
Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "LabGuard Pro API is running on Vercel",
  "environment": "production"
}
```

### 4.2 Test Registration
```bash
curl -X POST https://your-vercel-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "confirmPassword": "testpassword123",
    "firstName": "Test",
    "lastName": "User",
    "laboratoryName": "Test Laboratory"
  }'
```

### 4.3 Test Login
```bash
curl -X POST https://your-vercel-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

## 🔍 Step 5: Troubleshooting

### Common Issues

#### 1. Database Connection Error
- Check your `DATABASE_URL` in Vercel environment variables
- Ensure your database is accessible from external connections
- For Neon/Supabase, make sure you're using the correct connection string

#### 2. Build Errors
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Make sure Prisma is generating correctly

#### 3. API Routes Not Working
- Check that your API routes are in the correct location (`src/app/api/`)
- Verify the route structure matches Next.js 13+ App Router
- Check Vercel function logs for errors

#### 4. Authentication Issues
- Verify `JWT_SECRET` is set in environment variables
- Check that the token is being sent correctly in requests
- Ensure the token format is `Bearer <token>`

### Debugging Commands

```bash
# Check Vercel logs
vercel logs

# Pull latest environment variables
vercel env pull .env.local

# Test database connection locally
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## 🔒 Step 6: Security Considerations

### Environment Variables
- Use strong, unique secrets for `JWT_SECRET`
- Never commit secrets to your repository
- Use Vercel's environment variable encryption

### Database Security
- Use connection pooling for production
- Enable SSL connections
- Regularly backup your database
- Monitor database usage

### API Security
- Implement rate limiting
- Add CORS configuration if needed
- Validate all inputs
- Use HTTPS in production

## 📈 Step 7: Monitoring and Maintenance

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Monitor function execution times
- Check for cold starts

### Database Monitoring
- Monitor database connections
- Check query performance
- Set up alerts for high usage

### Error Tracking
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor API response times
- Track user authentication failures

## 🎉 Success!

Your LabGuard Pro application should now be running on Vercel with:
- ✅ Working authentication (register/login)
- ✅ Database connectivity
- ✅ API routes functioning
- ✅ No more localhost:3001 errors

## 📞 Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify environment variables are set correctly
3. Test database connectivity
4. Review the troubleshooting section above

For additional help, check the Vercel documentation or your database provider's support resources. 