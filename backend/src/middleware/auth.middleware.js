const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const config = require('../config');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches admin to request
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Find admin
        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Admin not found.',
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.',
            });
        }

        // Attach admin to request
        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication error.',
        });
    }
};

/**
 * Role-based Authorization Middleware
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.',
            });
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize,
};
