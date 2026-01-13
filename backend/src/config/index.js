module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@techvimal.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    },
};
