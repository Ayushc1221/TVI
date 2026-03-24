const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/auth.routes');
const contactRoutes = require('./src/routes/contact.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const templateRoutes = require('./src/routes/template.routes');
const certificateRoutes = require('./src/routes/certificate.routes');
const applicationRoutes = require('./src/routes/application.routes');
const certGenRoutes = require('./src/routes/certGen.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const verificationRoutes = require('./src/routes/verification.routes');
const settingRoutes = require('./src/routes/setting.routes');
const clientRoutes = require('./src/routes/client.routes');
const path = require('path');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL,
        'https://techvimalinternational.com',
        'https://www.techvimalinternational.com',
        'http://techvimalinternational.com',
        'http://www.techvimalinternational.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// Root Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TVI Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/certificates', certGenRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/client', clientRoutes);

// Register Auditor Routes
const auditorRoutes = require('./src/routes/auditor.routes');
app.use('/api/auditor', auditorRoutes);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    const address = server.address();
    console.log(`
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
  📡 Port: ${PORT}
  🔗 Bind Address: ${JSON.stringify(address)}
  🌐 URL: http://0.0.0.0:${PORT}
  📋 Health: http://0.0.0.0:${PORT}/api/health
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    process.exit(1);
});
