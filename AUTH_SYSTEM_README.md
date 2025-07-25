# 🔐 LabGuard Pro - Authentication System

A focused, production-ready authentication system for LabGuard Pro built with Next.js, Prisma, and PostgreSQL.

## ✅ Features Implemented

- **User Registration** - Create new laboratory accounts
- **User Login** - Secure authentication with JWT tokens
- **User Logout** - Secure session termination
- **Profile Management** - Get user information
- **Protected Routes** - Dashboard access control
- **Database Integration** - PostgreSQL with Prisma ORM
- **Password Security** - bcrypt hashing
- **Token Management** - JWT-based authentication
- **Error Handling** - Comprehensive error messages
- **TypeScript** - Full type safety

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment file and configure your database:

```bash
cp env.local.example .env.local
```

Update `.env.local` with your database credentials:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/labguard_pro"
JWT_SECRET="your-super-secret-jwt-key-here-make-it-very-long-and-random"
NODE_ENV="development"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test the System

```bash
# Run authentication tests
npm run test:auth
```

## 📁 File Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── register/route.ts    # User registration
│   │   ├── login/route.ts       # User login
│   │   ├── logout/route.ts      # User logout
│   │   └── profile/route.ts     # Get user profile
│   ├── auth/
│   │   ├── register/page.tsx    # Registration page
│   │   └── login/page.tsx       # Login page
│   └── dashboard/page.tsx       # Protected dashboard
├── lib/
│   ├── auth.ts                  # JWT utilities
│   └── api.ts                   # API client
└── components/ui/               # UI components

prisma/
└── schema.prisma               # Database schema

scripts/
└── test-auth.js               # Authentication tests
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/health` - Health check

### Request/Response Examples

#### Registration
```json
POST /api/auth/register
{
  "email": "john@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "laboratoryName": "Acme Research Lab",
  "role": "ADMIN"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Profile (with Authorization header)
```json
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

## 🛡️ Security Features

- **Password Hashing** - bcrypt with 12 salt rounds
- **JWT Tokens** - 7-day expiration
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Prisma ORM
- **CORS Protection** - Next.js built-in
- **Environment Variables** - Secure configuration

## 🎯 User Flow

1. **Registration** → User creates account with laboratory
2. **Login** → User authenticates and receives JWT token
3. **Dashboard** → Protected route shows user information
4. **Logout** → Token invalidated and user redirected

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Auth system complete"
git push
```

2. **Configure Environment Variables in Vercel**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Your JWT secret key

3. **Deploy**
   - Vercel will automatically deploy from GitHub
   - Run `npx prisma db push` in Vercel console if needed

### Database Options

**Option A: Neon (Recommended)**
- Free PostgreSQL hosting
- Automatic scaling
- Easy setup

**Option B: Supabase**
- Free tier available
- Built-in authentication (optional)
- Real-time features

## 🧪 Testing

Run the authentication test suite:

```bash
npm run test:auth
```

This will test:
- Health check
- User registration
- User login
- Profile access
- User logout

## 🔄 Next Steps

Once authentication is working, you can build:

- **Equipment Management** - Add, edit, delete laboratory equipment
- **Calibration Tracking** - Schedule and track equipment calibration
- **AI Assistant** - Integrate AI for laboratory assistance
- **Team Management** - Invite and manage team members
- **Reporting System** - Generate compliance reports
- **Advanced Features** - Notifications, audit logs, etc.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` in `.env.local`
   - Ensure PostgreSQL is running
   - Run `npx prisma db push`

2. **JWT Secret Error**
   - Set a strong `JWT_SECRET` in `.env.local`
   - Restart the development server

3. **CORS Issues**
   - Check API base URL configuration
   - Ensure proper headers in requests

4. **Prisma Errors**
   - Run `npx prisma generate`
   - Check database schema compatibility

### Getting Help

- Check the browser console for errors
- Review server logs in terminal
- Run `npm run test:auth` to verify functionality
- Check Prisma Studio: `npx prisma studio`

## 📝 License

This authentication system is part of LabGuard Pro and follows the same licensing terms.

---

**🎉 Your authentication system is ready! Test it out and start building the full LabGuard Pro platform!** 