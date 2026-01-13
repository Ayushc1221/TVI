const { Contact } = require('../models');

/**
 * Get Dashboard Stats (Admin Only)
 * GET /api/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        // Get total counts by status
        const [totalContacts, statusCounts, recentContacts] = await Promise.all([
            Contact.countDocuments(),
            Contact.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]),
            Contact.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name email company status createdAt'),
        ]);

        // Format status counts
        const statusMap = {
            new: 0,
            read: 0,
            replied: 0,
            archived: 0,
        };
        statusCounts.forEach((item) => {
            statusMap[item._id] = item.count;
        });

        // Get contacts from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyContacts = await Contact.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
        });

        // Get contacts from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyContacts = await Contact.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
        });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalContacts,
                    newContacts: statusMap.new,
                    readContacts: statusMap.read,
                    repliedContacts: statusMap.replied,
                    archivedContacts: statusMap.archived,
                    weeklyContacts,
                    monthlyContacts,
                },
                recentContacts,
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
