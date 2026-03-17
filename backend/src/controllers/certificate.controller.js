const Certificate = require('../models/Certificate.model');

// @desc    Generate and save a certificate
// @route   POST /api/certificates
// @access  Private (Admin)
exports.generateCertificate = async (req, res) => {
    try {
        const { certificateNumber, companyName, certificationType, scopeOfBusiness, issueDate, expiryDate, authorizedSignatory, applicationId, qrCodeUrl } = req.body;
        
        let certificateFileUrl = req.body.certificateFileUrl;
        if (req.file) {
            certificateFileUrl = `/uploads/${req.file.filename}`;
        }

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

        // Search by Certificate Number OR Application ID (Case-Insensitive)
        // Also handle cases where user might omit leading zeros in the sequence (e.g. -1 vs -0001)
        let searchRegex;
        const certPatternMatch = certificateNumber.match(/^(TVI-[A-Z]+-\d{4}-)(\d+)$/i);
        
        if (certPatternMatch) {
            const prefix = certPatternMatch[1];
            const seq = parseInt(certPatternMatch[2], 10);
            // Matches prefix followed by optional leading zeros + sequence
            searchRegex = new RegExp(`^${prefix}0*${seq}$`, 'i');
        } else {
            searchRegex = new RegExp(`^${certificateNumber}$`, 'i');
        }
        
        const certificate = await Certificate.findOne({
            $or: [
                { certificateNumber: searchRegex },
                { applicationId: searchRegex }
            ]
        });

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

// @desc    Download / View a certificate Document by App ID or Cert ID
// @route   GET /api/certificates/download/:id
// @access  Public
exports.downloadCertificate = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to find the certificate by its database ID or the application ID
        let certificate;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            certificate = await Certificate.findOne({
                $or: [{ _id: id }, { applicationId: id }]
            });
        } else {
            certificate = await Certificate.findOne({ applicationId: id });
        }

        // Graceful fallback: If we have an actual physically uploaded PDF, send them to it
        if (certificate && certificate.certificateFileUrl) {
            return res.redirect(certificate.certificateFileUrl);
        }

        if (!certificate || !certificate.certificateNumber) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        // Since older applications generated PDFs on the client-side without storing the raw PDF file,
        // we redirect the user to the Verification page where they can view/print it dynamically.
        res.redirect(`http://localhost:3000/verify?cert=${certificate.certificateNumber}`);

    } catch (error) {
        console.error('Download certificate error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error downloading certificate'
        });
    }
};
