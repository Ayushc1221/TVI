const Certificate = require('../models/Certificate.model');

// @desc    Verify a certificate by certificate number
// @route   GET /api/certificates/verify/:certificateNumber
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
    try {
        const { certificateNumber } = req.params;

        const certificate = await Certificate.findOne({ certificateNumber });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                valid: false,
                message: 'Certificate Not Found',
            });
        }

        // Auto-check if expired
        let currentStatus = 'Active';
        if (new Date(certificate.expiryDate) < new Date()) {
            currentStatus = 'Expired';
        }

        res.status(200).json({
            success: true,
            valid: true,
            data: {
                companyName: certificate.companyName,
                certificationType: certificate.certificationType,
                certificateNumber: certificate.certificateNumber,
                issueDate: certificate.issueDate,
                expiryDate: certificate.expiryDate,
                status: currentStatus,
            },
        });
    } catch (error) {
        next(error);
    }
};
