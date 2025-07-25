# 🧪 LabGuard Pro - Laboratory Management Platform

A comprehensive laboratory management system with AI-powered insights, built with modern technologies.

## ✨ Features

- 🔐 **Authentication System** - Secure user registration and login
- 🏭 **Laboratory Management** - Multi-laboratory support with role-based access
- ⚙️ **Equipment Management** - Track, calibrate, and maintain laboratory equipment
- 📊 **Compliance Reporting** - Automated compliance tracking and reporting
- 👥 **Team Management** - User invitations, roles, and permissions
- 🤖 **AI Assistant** - Biomni AI integration for laboratory insights
- 📈 **Analytics Dashboard** - Real-time metrics and insights
- 🔔 **Notifications** - Real-time alerts and updates

## 🏗️ Tech Stack

### Backend
- **Framework**: Node.js + Express
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: Next.js 14 + React
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: React hooks + Context
- **Type Safety**: TypeScript

### Infrastructure
- **Monorepo**: npm workspaces
- **Database**: Prisma + SQLite/PostgreSQL
- **Development**: Hot reload, TypeScript compilation
- **Production**: Docker-ready, scalable architecture

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd labguard-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # API environment
   cp apps/api/env.example apps/api/.env
   
   # Web environment
   cp apps/web/env.local.example apps/web/.env.local
   ```

4. **Set up the database**
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   ```

5. **Start development servers**
   ```bash
   # From project root
   npm run dev
   ```

6. **Access the application**
   - **Frontend**: http://localhost:3000
   - **API**: http://localhost:3001
   - **Health Check**: http://localhost:3001/health

## 📁 Project Structure

```
labguard-pro/
├── apps/
│   ├── api/              # Express.js API server
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── prisma/       # Database schema
│   └── web/              # Next.js frontend
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── hooks/
│       │   └── lib/
│       └── public/
├── packages/             # Shared packages
└── docs/                # Documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Equipment Management
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/:id` - Update equipment

### Reports & Analytics
- `GET /api/reports/compliance-summary` - Compliance overview
- `GET /api/reports/equipment-status` - Equipment status report
- `GET /api/reports/analytics` - Laboratory analytics

### Team Management
- `GET /api/team/members` - List team members
- `POST /api/team/invite` - Invite team member
- `PUT /api/team/members/:id/role` - Update member role

### AI Assistant
- `POST /api/biomni/query` - Execute AI query
- `POST /api/biomni/generate-protocol` - Generate protocol

## 🧪 Testing

```bash
# Test API health
curl http://localhost:3001/health

# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","laboratoryName":"Test Lab"}'
```

## 🚢 Deployment

### Production Environment Setup

1. **Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   ```

2. **Database Migration**
   ```bash
   npx prisma migrate deploy
   ```

3. **Build Applications**
   ```bash
   npm run build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Stanford Biomni AI for laboratory intelligence
- Prisma for database management
- Next.js team for the amazing framework
- All contributors and supporters

---

**Built with ❤️ for the scientific community**