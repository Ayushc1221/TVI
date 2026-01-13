const express = require('express');
const { dashboardController } = require('../controllers');
const { authenticate } = require('../middleware');

const router = express.Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', authenticate, dashboardController.getDashboardStats);

/**
 * @route   GET /api/dashboard/analytics
 * @desc    Get contact analytics
 * @access  Private
 */
router.get('/analytics', authenticate, dashboardController.getAnalytics);

module.exports = router;
