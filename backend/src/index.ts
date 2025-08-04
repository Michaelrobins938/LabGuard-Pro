import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import billingRoutes from './routes/billing.routes';
import calibrationRoutes from './routes/calibration.routes';
import complianceRoutes from './routes/compliance.routes';
import equipmentRoutes from './routes/equipment.routes';
import laboratoryRoutes from './routes/laboratory.routes';
import notificationRoutes from './routes/notification.routes';
import publicHealthRoutes from './routes/public-health.routes';
import reportsRoutes from './routes/reports.routes';
import surveillanceRoutes from './routes/surveillance.routes';
import vectorControlRoutes from './routes/vector-control.routes';
import westNileVirusRoutes from './routes/west-nile-virus.routes';
import qrCodeRoutes from './routes/qr-code.routes';
import wnvSamplesRoutes from './routes/wnv-samples.routes';
import demoDataRoutes from './routes/demo-data.routes';
import printerRoutes from './routes/printer.routes';
import mobilePrintRoutes from './routes/mobile-print.routes';
import analyticsRoutes from './routes/analytics.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { monitoringMiddleware } from './middleware/monitoring';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Monitoring middleware
app.use(monitoringMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/calibration', calibrationRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/laboratory', laboratoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/public-health', publicHealthRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/surveillance', surveillanceRoutes);
app.use('/api/vector-control', vectorControlRoutes);
app.use('/api/west-nile-virus', westNileVirusRoutes);
app.use('/api/qr-codes', qrCodeRoutes);
app.use('/api/wnv-samples', wnvSamplesRoutes);
app.use('/api/demo-data', demoDataRoutes);
app.use('/api/printers', printerRoutes);
app.use('/api/mobile-print', mobilePrintRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app; 