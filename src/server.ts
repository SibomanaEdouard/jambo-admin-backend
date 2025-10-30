import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Routes
import adminAuthRoutes from './routes/adminAuth';
import userRoutes from './routes/users';
import { apiLimiter, securityHeaders, requestLogger, errorHandler } from './middlewares/security';
import { AdminAuthService } from './services/adminAuthService';
import path from 'path';

dotenv.config();

const app = express();

// Swagger configuration
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin API Documentation',
      version: '1.0.0',
      description: 'API documentation for Admin authentication and user management',
      contact: {
        name: 'API Support',
        email: 'support@yourapp.com'
      },
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
        description: 'Development server'
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            code: {
              type: 'string',
              description: 'Error code'
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
   apis: [
    path.join(__dirname, './routes/*.ts'),
    path.join(__dirname, './controllers/*.ts')
  ], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Security middleware
app.use(helmet());
app.use(securityHeaders);
app.use(requestLogger);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting (exclude Swagger docs from rate limiting)
app.use('/api/', apiLimiter);

// Swagger Documentation Route (exclude from rate limiting)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Admin API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Admin Backend',
    version: '1.0.0'
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
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`📝 Swagger JSON: http://localhost:${PORT}/api-docs.json`);
    });
  } catch (error) {
    console.error('❌ Failed to start admin server:', error);
    process.exit(1);
  }
};

startServer();