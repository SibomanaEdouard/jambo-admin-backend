import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Routes
import adminAuthRoutes from './routes/adminAuth';
import userRoutes from './routes/users';
import { apiLimiter, securityHeaders, requestLogger, errorHandler } from './middlewares/security';
import { AdminAuthService } from './services/adminAuthService';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(securityHeaders);
app.use(requestLogger);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Admin Backend'
  });
});


// Error handling middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB - Admin');

    // Create default admin user
    await AdminAuthService.createDefaultAdmin();
    
    app.listen(PORT, () => {
      console.log(`✅ Admin backend server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start admin server:', error);
    process.exit(1);
  }
};

startServer();