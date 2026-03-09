const Certificate = require('../models/Certificate.model');

// @desc    Generate and save a certificate
// @route   POST /api/certificates
// @access  Private (Admin)
exports.generateCertificate = async (req, res) => {
    try {
        const { certificateNumber, companyName, certificationType, scopeOfBusiness, issueDate, expiryDate, authorizedSignatory, applicationId, certificateFileUrl, qrCodeUrl } = req.body;

        const newCert = await Certificate.create({
            applicationId,
            certificateNumber,
            companyName,
            certificationType,
            scopeOfBusiness,
            issueDate,
            expiryDate,
            certificateFileUrl,
            qrCodeUrl,
            authorizedSignatory
        });

        res.status(201).json({
            success: true,
            data: newCert
        });
    } catch (error) {
        console.error('Create certificate error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Certificate number already exists.' });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error creating certificate'
        });
    }
};

// @desc    Verify a certificate by number
// @route   GET /api/certificates/verify/:certificateNumber
// @access  Public
exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateNumber } = req.params;

        const certificate = await Certificate.findOne({ certificateNumber });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate Not Found'
            });
        }

        // Check if expired
        let currentStatus = certificate.status;
        if (currentStatus === 'Active' && new Date(certificate.expiryDate) < new Date()) {
            currentStatus = 'Expired';
            // Optionally update DB
            certificate.status = 'Expired';
            await certificate.save();
        }

        res.status(200).json({
            success: true,
            data: {
                companyName: certificate.companyName,
                certificationType: certificate.certificationType,
                certificateNumber: certificate.certificateNumber,
                issueDate: certificate.issueDate,
                expiryDate: certificate.expiryDate,
                status: currentStatus
            }
        });

    } catch (error) {
        console.error('Verify certificate error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error verifying certificate'
        });
    }
};
