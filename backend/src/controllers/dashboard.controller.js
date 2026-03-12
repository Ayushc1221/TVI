const { Contact } = require('../models');
const Application = require('../models/Application.model');
const Payment = require('../models/Payment.model');

/**
 * Get Dashboard Stats (Admin Only)
 * GET /api/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        // Get counts from Application collection
        const [
            totalApps,
            submittedCount,
            underReviewCount,
            approvedCount,
            auditAssignedCount,
            certGeneratedCount,
            completedCount,
            rejectedCount
        ] = await Promise.all([
            Application.countDocuments(),
            Application.countDocuments({ status: 'submitted' }),
            Application.countDocuments({ status: 'under_review' }),
            Application.countDocuments({ status: 'approved' }),
            Application.countDocuments({ status: 'audit_assigned' }),
            Application.countDocuments({ status: 'certificate_generated' }),
            Application.countDocuments({ status: 'completed' }),
            Application.countDocuments({ status: 'rejected' })
        ]);

        // Calculate Revenue from completed payments
        const revenueResult = await Payment.aggregate([
            {
                $match: {
                    paymentStatus: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $toDouble: "$amount" } }
                }
            }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Get recent applications
        const recentApplications = await Application.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('applicationId companyName serviceType status createdAt');

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    total: totalApps,
                    submitted: submittedCount,
                    approved: approvedCount + completedCount + certGeneratedCount,
                    rejected: rejectedCount,
                    inProgress: underReviewCount + auditAssignedCount,
                    totalRevenue
                },
                recentApplications
            },
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats',
        });
    }
};

/**
 * Get Contact Analytics (Admin Only)
 * GET /api/dashboard/analytics
 */
const getAnalytics = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Daily contact submissions
        const dailyContacts = await Contact.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                dailyContacts,
            },
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
        });
    }
};

module.exports = {
    getDashboardStats,
    getAnalytics,
};
