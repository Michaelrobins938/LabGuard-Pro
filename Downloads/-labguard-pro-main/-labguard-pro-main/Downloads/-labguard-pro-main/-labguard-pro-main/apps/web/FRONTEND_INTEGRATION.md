# 🚀 LabGuard Pro Frontend Integration Guide

## Overview

This guide covers the complete frontend integration with the LabGuard Pro backend API. The frontend is now fully connected to the production-ready API backend with real-time data, authentication, and comprehensive laboratory management features.

## ✅ What's Been Implemented

### 🔐 Authentication System
- **Real API Integration**: Login and registration now connect to the backend API
- **JWT Token Management**: Automatic token handling with axios interceptors
- **Protected Routes**: Route protection with authentication checks
- **User Context**: Global user state management with React Context

### 📊 Dashboard Integration
- **Real-time Analytics**: Dashboard shows live data from the backend
- **Equipment Statistics**: Real equipment counts and status
- **Compliance Metrics**: Live compliance scores and calibration due dates
- **Recent Activity**: Dynamic activity feeds

### 🧪 Equipment Management
- **CRUD Operations**: Full equipment lifecycle management
- **Real-time Updates**: Equipment status updates from the backend
- **Search & Filter**: Advanced equipment search functionality
- **Status Tracking**: Equipment status with visual indicators

### 🎯 API Service Layer
- **Comprehensive API Client**: Complete API service with all endpoints
- **Error Handling**: Robust error handling and user feedback
- **Request/Response Interceptors**: Automatic token management
- **TypeScript Support**: Full type safety for API responses

## 🏗️ Architecture

```
Frontend (Next.js) ←→ API Routes ←→ Backend API (Express)
     ↓                    ↓                    ↓
React Components    Next.js API Routes    Express Controllers
     ↓                    ↓                    ↓
Custom Hooks       Authentication Proxy   Database (PostgreSQL)
     ↓                    ↓                    ↓
Context Providers   Error Handling        Prisma ORM
```

## 🔧 Key Components

### 1. Authentication Hook (`useAuth`)
```typescript
const { user, login, register, logout, loading } = useAuth();

// Login
const result = await login({ email, password });
if (result.success) {
  // Redirect to dashboard
}

// Register
const result = await register(userData);
if (result.success) {
  // Account created successfully
}
```

### 2. Equipment Management Hook (`useEquipment`)
```typescript
const { 
  equipment, 
  stats, 
  createEquipment, 
  updateEquipment, 
  deleteEquipment 
} = useEquipment();

// Create new equipment
const result = await createEquipment({
  name: 'Analytical Balance',
  model: 'AB-220',
  serialNumber: 'SN123456',
  location: 'Lab A',
  status: 'active'
});
```

### 3. Analytics Hook (`useAnalytics`)
```typescript
const { 
  dashboardStats, 
  analyticsData, 
  recentActivity 
} = useAnalytics();

// Access real-time dashboard data
console.log(dashboardStats.totalEquipment);
console.log(dashboardStats.complianceScore);
```

### 4. API Service (`apiService`)
```typescript
// Authentication
await apiService.auth.login(credentials);
await apiService.auth.register(userData);
await apiService.auth.getProfile();

// Equipment
await apiService.equipment.getAll();
await apiService.equipment.create(equipmentData);
await apiService.equipment.update(id, data);

// Analytics
await apiService.analytics.getEquipmentAnalytics();
await apiService.dashboard.getStats();
```

## 🚀 Getting Started

### 1. Start the Backend API
```bash
cd apps/api
npm install
npm run dev
# API will be available at http://localhost:3001
```

### 2. Start the Frontend
```bash
cd apps/web
npm install
npm run dev
# Frontend will be available at http://localhost:3000
```

### 3. Test the Integration
```bash
cd apps/web
node scripts/test-integration.js
```

## 📱 Available Pages

### Public Pages
- **Landing Page** (`/`): Marketing and product information
- **Login** (`/auth/login`): User authentication
- **Register** (`/auth/register`): Account creation

### Protected Pages (Require Authentication)
- **Dashboard** (`/dashboard`): Main laboratory overview
- **Equipment** (`/dashboard/equipment`): Equipment management
- **AI Assistant** (`/dashboard/ai`): AI-powered assistance
- **Reports** (`/dashboard/reports`): Compliance reports
- **Team** (`/dashboard/team`): Team management
- **Settings** (`/dashboard/settings`): Application settings

## 🔒 Authentication Flow

1. **User Registration**
   ```
   Frontend Form → Next.js API Route → Backend API → Database
   ```

2. **User Login**
   ```
   Frontend Form → Next.js API Route → Backend API → JWT Token
   ```

3. **Protected Routes**
   ```
   Route Access → Auth Check → Token Validation → Backend API
   ```

4. **API Requests**
   ```
   Frontend Request → Axios Interceptor → Token Header → Backend API
   ```

## 🎨 UI Components

### Authentication Components
- `ProtectedRoute`: Route protection wrapper
- `LoginForm`: User login interface
- `RegisterForm`: User registration interface

### Dashboard Components
- `DashboardStats`: Real-time statistics cards
- `EquipmentList`: Equipment management interface
- `AnalyticsChart`: Data visualization components

### Shared Components
- `LoadingSpinner`: Loading states
- `ErrorBoundary`: Error handling
- `ToastNotifications`: User feedback

## 🔧 Configuration

### Environment Variables
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3001
```

### API Configuration
```typescript
// apps/web/src/lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 🧪 Testing

### Integration Tests
```bash
# Test the complete integration
node scripts/test-integration.js
```

### Manual Testing
1. **Registration Flow**
   - Visit `/auth/register`
   - Create a new account
   - Verify redirect to dashboard

2. **Login Flow**
   - Visit `/auth/login`
   - Login with credentials
   - Verify dashboard access

3. **Equipment Management**
   - Navigate to `/dashboard/equipment`
   - Add new equipment
   - Verify real-time updates

4. **Dashboard Analytics**
   - Visit `/dashboard`
   - Verify real-time statistics
   - Check data accuracy

## 🐛 Troubleshooting

### Common Issues

1. **Backend Not Running**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:3001
   Solution: Start the backend API server
   ```

2. **Authentication Errors**
   ```
   Error: 401 Unauthorized
   Solution: Check JWT token and user credentials
   ```

3. **Database Connection**
   ```
   Error: Database connection failed
   Solution: Verify DATABASE_URL and database status
   ```

4. **CORS Issues**
   ```
   Error: CORS policy violation
   Solution: Check backend CORS configuration
   ```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: API response caching with SWR
- **Bundle Analysis**: Webpack bundle analyzer

### API Optimizations
- **Request Batching**: Multiple API calls in parallel
- **Error Retry**: Automatic retry for failed requests
- **Loading States**: Optimistic UI updates
- **Pagination**: Efficient data loading

## 🔮 Next Steps

### Immediate Enhancements
1. **Real-time Updates**: WebSocket integration for live data
2. **Offline Support**: Service worker for offline functionality
3. **Mobile App**: React Native mobile application
4. **Advanced AI**: Enhanced AI assistant features

### Future Features
1. **Multi-tenancy**: Support for multiple laboratories
2. **Advanced Analytics**: Machine learning insights
3. **Integration APIs**: Third-party system integrations
4. **Enterprise Features**: SSO, LDAP, advanced security

## 📚 Additional Resources

- [Backend API Documentation](../api/README.md)
- [Database Schema](../api/prisma/schema.prisma)
- [API Endpoints](../api/src/routes/)
- [Component Library](../web/src/components/ui/)

## 🆘 Support

For technical support or questions about the integration:

1. Check the troubleshooting section above
2. Review the API documentation
3. Test with the integration script
4. Check server logs for detailed error messages

---

**🎉 Congratulations! Your LabGuard Pro frontend is now fully integrated with the backend API and ready for production use.** 