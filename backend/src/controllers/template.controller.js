const CertificateTemplate = require('../models/CertificateTemplate.model');

// @desc    Upload or replace a certificate template
// @route   POST /api/templates
// @access  Private (Admin only)
exports.uploadTemplate = async (req, res) => {
    try {
        const { serviceType } = req.body;
        const file = req.file;

        if (!serviceType || !file) {
            return res.status(400).json({
                success: false,
                message: 'Please provide serviceType and upload a template file'
            });
        }

        // Standardize serviceType to uppercase for matching
        const normalizedServiceType = serviceType.toUpperCase();

        if (!['ISO', 'AUDIT', 'HRAA'].includes(normalizedServiceType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service type'
            });
        }

        const fileUrl = `/uploads/${file.filename}`;

        const template = await CertificateTemplate.findOneAndUpdate(
            { serviceType: normalizedServiceType },
            {
                templateName: file.originalname,
                fileUrl,
                uploadedBy: req.admin ? req.admin._id : null
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: `Template for ${normalizedServiceType} updated successfully`,
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
