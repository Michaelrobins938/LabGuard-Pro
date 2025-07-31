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

- **🧪 Equipment Calibration Audit System**
  - YAML-defined agents for equipment validation
  - CLI interface for automated audits
  - React-based UI for lab staff
  - Comprehensive testing framework
  - Audit logging and compliance tracking

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

## 🧪 Equipment Calibration Audit System

### How to Run a Calibration Audit

#### CLI Interface
The LabGuard-Pro CLI provides a command-line interface for equipment calibration validation:

```bash
# Basic usage
node cli/labguard.js check-calibration --device "Microscope" --last "2025-01-15" --tolerance 30

# Examples
node cli/labguard.js check-calibration --device "Incubator" --last "2024-11-01" --tolerance 30
node cli/labguard.js check-calibration --device "PCR Machine" --last "2024-10-01" --tolerance 7

# Help
node cli/labguard.js --help
```

**Output Examples:**
```
✅ PASS: Microscope was calibrated 16 days ago. Within tolerance.

⚠️ FAIL: Incubator was calibrated 91 days ago. Tolerance is 30. Recommend recalibration.
```

#### Web Interface
Access the calibration audit interface at `/audit` in your browser:

1. Navigate to `http://localhost:3000/audit`
2. Enter equipment details:
   - **Device Name**: Equipment identifier
   - **Last Calibration Date**: Date in YYYY-MM-DD format
   - **Tolerance Period**: Maximum days between calibrations
3. Click "Run Audit" to validate compliance
4. View results with PASS/FAIL status and recommendations

### How to Add a New Agent

1. Create a new YAML file in `/agents/`:
```yaml
name: "your-agent-name"
version: "1.0.0"
description: "Your agent description"

inputs:
  # Define your inputs here

outputs:
  # Define your outputs here

logic:
  # Define your logic steps here

functions:
  # Define your custom functions here
```

2. Update the CLI to support your new agent:
   - Add command parsing in `cli/labguard.js`
   - Implement agent logic execution
   - Add help documentation

3. Create test cases in `/tests/`:
   - Add JSON test files for validation
   - Include edge cases and error scenarios

### Testing Agent Logic

Run the comprehensive test suite:

```bash
# Run all tests
node tests/test-runner.js

# Expected output:
# 🚀 Starting LabGuard-Pro Test Suite
# =====================================
# 
# 📋 Test Suite: calibration-audit
#    Description: Test cases for equipment calibration validation agent
#    Version: 1.0.0
#    Total Tests: 6
# 
# 🧪 Running test: recently_calibrated_pass
#    Description: Device calibrated recently - should PASS
#    Input: {"device":"Microscope","last_calibrated":"2025-01-15","tolerance":30}
#    ✅ PASS
#    Result: Microscope was calibrated 16 days ago. Within tolerance.
# 
# 📊 Test Results Summary
# ========================
#    Total: 6
#    ✅ Passed: 6
#    ❌ Failed: 0
#    💥 Errors: 0
#    📈 Success Rate: 100.0%
```

### Deploying with Vercel

1. **Environment Variables**: Ensure all required environment variables are set in Vercel dashboard

2. **Build Configuration**: The system automatically detects and builds the calibration audit components

3. **API Routes**: The `/api/audit/run` endpoint is automatically deployed

4. **Static Assets**: All UI components and test files are included in the build

5. **CLI Tools**: For production deployment, consider containerizing the CLI tools or using serverless functions

### System Architecture

```
LabGuard-Pro/
├── agents/
│   └── calibration-audit.yaml          # YAML agent definition
├── cli/
│   ├── labguard.js                     # CLI wrapper
│   └── package.json                    # CLI dependencies
├── logs/
│   └── audit-results.json              # Audit log storage
├── tests/
│   ├── calibration-tests.json          # Test cases
│   └── test-runner.js                  # Test execution
├── src/app/
│   ├── audit/
│   │   └── page.tsx                    # React UI
│   └── api/audit/run/
│       └── route.ts                    # API endpoint
└── vendor/
    ├── nerve/                          # Nerve framework
    ├── mcp-cli-host/                   # MCP CLI host
    └── tester-mcp-client/              # Testing framework
```

### Compliance Features

- **Automated Validation**: YAML-defined rules for equipment compliance
- **Audit Logging**: All audit results are logged with timestamps
- **Multi-format Output**: CLI and web interfaces for different use cases
- **Test Coverage**: Comprehensive test suite for validation accuracy
- **Non-technical Interface**: User-friendly forms for lab staff

### Integration Points

- **Database**: Audit results can be stored in PostgreSQL
- **Notifications**: Failed audits can trigger email alerts
- **Reporting**: Generate compliance reports from audit logs
- **API**: RESTful endpoints for external system integration

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