const Setting = require('../models/Setting.model');

// @desc    Get platform settings
// @route   GET /api/settings
// @access  Private (Admin only)
exports.getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne({ key: 'platform_config' });

        if (!settings) {
            // Create default settings if not exists
            settings = await Setting.create({ key: 'platform_config' });
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching settings'
        });
    }
};

// @desc    Update platform settings
// @route   PUT /api/settings
// @access  Private (Admin only)
exports.updateSettings = async (req, res) => {
    try {
        const { services, notifications, pricing } = req.body;

        const settings = await Setting.findOneAndUpdate(
            { key: 'platform_config' },
            {
                services,
                notifications,
                pricing
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error updating settings'
        });
    }
};
