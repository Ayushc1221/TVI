const CertificateTemplate = require('../models/CertificateTemplate.model');

// @desc    Upload or replace a certificate template
// @route   POST /api/templates
// @access  Private (Admin only)
exports.uploadTemplate = async (req, res) => {
    try {
        const { serviceType, templateName, fileUrl } = req.body;

        if (!serviceType || !templateName || !fileUrl) {
            return res.status(400).json({
                success: false,
                message: 'Please provide serviceType, templateName, and fileUrl'
            });
        }

        if (!['ISO', 'Audit', 'HRAA'].includes(serviceType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service type'
            });
        }

        const template = await CertificateTemplate.findOneAndUpdate(
            { serviceType },
            {
                templateName,
                fileUrl,
                uploadedBy: req.admin ? req.admin._id : null
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: `Template for ${serviceType} updated successfully`,
            data: template
        });

    } catch (error) {
        console.error('Template upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error handling template upload'
        });
    }
};

// @desc    Get all active certificate templates
// @route   GET /api/templates
// @access  Private (Admin only)
exports.getTemplates = async (req, res) => {
    try {
        const templates = await CertificateTemplate.find().populate('uploadedBy', 'name email');

        res.status(200).json({
            success: true,
            data: templates
        });
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching templates'
        });
    }
};
