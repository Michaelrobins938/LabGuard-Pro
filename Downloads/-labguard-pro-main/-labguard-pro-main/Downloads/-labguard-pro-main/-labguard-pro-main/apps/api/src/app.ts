import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// ONLY include working routes
import authRoutes from './routes/auth.routes';
import reportsRoutes from './routes/reports.routes';
import equipmentRoutes from './routes/equipment.routes';
import biomniRoutes from './routes/biomni.routes';
import teamRoutes from './routes/team.routes';
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ONLY working routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/biomni', biomniRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Add missing routes that frontend expects
app.use('/api/billing', (req, res) => {
  res.json({ message: 'Billing API endpoint' });
});

app.use('/api/settings', (req, res) => {
  res.json({ message: 'Settings API endpoint' });
});

app.use('/api/ai', (req, res) => {
  res.json({ message: 'AI API endpoint' });
});

app.use('/api/calibration', (req, res) => {
  res.json({ message: 'Calibration API endpoint' });
});

app.use('/api/files', (req, res) => {
  res.json({ message: 'Files API endpoint' });
});

app.use('/api/audit', (req, res) => {
  res.json({ message: 'Audit API endpoint' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'LabGuard Pro API',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/equipment',
      '/api/reports',
      '/api/dashboard',
      '/api/analytics',
      '/api/team',
      '/api/notifications'
    ]
  });
});

// Error handling
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
  });
});

export default app; 