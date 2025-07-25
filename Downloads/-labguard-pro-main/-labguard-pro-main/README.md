# LabGuard Pro - Web Application

A comprehensive laboratory management system with AI-powered compliance validation and equipment management.

## Features

- **Complete Authentication System**
  - User registration with email verification
  - Secure password hashing with bcrypt
  - Password reset functionality
  - Role-based access control
  - Session management with NextAuth.js

- **Laboratory Management**
  - Multi-tenant laboratory support
  - Equipment tracking and calibration
  - Compliance validation tools
  - Audit logging and reporting

- **AI-Powered Features**
  - Biomni AI integration for intelligent assistance
  - Compliance validation automation
  - Predictive maintenance insights
  - Natural language report generation

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## Environment Setup

1. Copy the environment template:
```bash
cp env.local.example .env.local
```

2. Configure your environment variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/labguard_pro"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-secret-key-here"

# Email (for production)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yourdomain.com"

# API Configuration
API_BASE_URL="http://localhost:3001/api"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
NEXT_PUBLIC_BIOMNI_API_KEY="your-biomni-api-key"

# Payment Processing (Stripe)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE labguard_pro;
```

2. Run database migrations:
```bash
npm run db:push
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Seed the database with initial data:
```bash
npm run db:seed
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database (see Database Setup above)

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t labguard-pro .
```

2. Run with environment variables:
```bash
docker run -p 3000:3000 --env-file .env.local labguard-pro
```

## Authentication System

The application includes a complete authentication system:

### User Registration
- Email verification required
- Password strength validation
- Laboratory creation during registration
- Role assignment (Lab Manager, Technician, etc.)

### Login System
- Secure password authentication
- Account lockout protection
- Session management
- Remember me functionality

### Password Management
- Secure password reset via email
- Password change tracking
- Failed login attempt monitoring

### Security Features
- bcrypt password hashing
- JWT token management
- CSRF protection
- Rate limiting on auth endpoints

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (handled by NextAuth)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-email` - Verify email address

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/laboratory` - Get laboratory information

## Database Schema

The application uses Prisma with PostgreSQL and includes:

- **Users** - User accounts with roles and permissions
- **Laboratories** - Multi-tenant laboratory organizations
- **Equipment** - Laboratory equipment tracking
- **Calibrations** - Equipment calibration records
- **Subscriptions** - Billing and subscription management
- **Audit Logs** - Security and compliance logging

## Development

### Code Structure
```
src/
├── app/                 # Next.js 13+ app directory
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Dashboard pages
├── components/         # React components
├── lib/               # Utility libraries
└── types/             # TypeScript type definitions
```

### Key Technologies
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication
- **Tailwind CSS** - Styling
- **Zod** - Schema validation

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions:
- Email: support@labguard.com
- Documentation: [docs.labguard.com](https://docs.labguard.com)
- Issues: GitHub Issues 