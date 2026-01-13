const express = require('express');
const { body } = require('express-validator');
const { authController } = require('../controllers');
const { authenticate, validate } = require('../middleware');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid email'),
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
    ],
    validate,
    authController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current admin profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change admin password
 * @access  Private
 */
router.post(
    '/change-password',
    authenticate,
    [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters'),
    ],
    validate,
    authController.changePassword
);

/**
 * @route   POST /api/auth/logout
 * @desc    Admin logout
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router;
