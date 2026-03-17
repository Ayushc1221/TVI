const jwt = require('jsonwebtoken');
const Application = require('../models/Application.model');
const config = require('../config');

// @desc    Login client using Email and Phone
// @route   POST /api/client/login
// @access  Public
exports.loginClient = async (req, res) => {
    try {
        const { email, phone } = req.body;

        if (!email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and phone number'
            });
        }

        const cleanPhone = phone.replace(/\s+/g, '');

        // Find ALL applications for this email and phone
        const applications = await Application.find({
            email: email.toLowerCase().trim(),
            phone: cleanPhone
        });

        if (!applications || applications.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'No application found with these details. Please check your credentials.'
            });
        }

        // Check if ANY application has moved past 'submitted' status
        // A client can only log in if at least one application is verified/processing
        const hasProcessedApplication = applications.some(app => app.status !== 'submitted');

        if (!hasProcessedApplication) {
            return res.status(403).json({
                success: false,
                message: 'Your application is currently pending initial review. Dashboard access will be enabled once processing begins.'
            });
        }

        // Use the most recent application to grab the name and company for the token payload
        const latestApp = applications.sort((a, b) => b.createdAt - a.createdAt)[0];

        const token = jwt.sign(
            { 
                email: email.toLowerCase().trim(), 
                phone: cleanPhone,
                role: 'client' 
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        res.status(200).json({
            success: true,
            data: {
                token,
                client: {
                    email: email.toLowerCase().trim(),
                    phone: phone.trim(),
                    name: latestApp.contactPerson,
                    companyName: latestApp.companyName,
                    role: 'client'
                }
            }
        });

    } catch (error) {
        console.error('Client login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Get client applications
// @route   GET /api/client/applications
// @access  Private (Client)
exports.getClientApplications = async (req, res) => {
    try {
        const { email, phone } = req.client;
        
        // Ensure any old tokens with whitespace are handled
        const cleanPhone = phone ? phone.replace(/\s+/g, '') : '';
        
        console.log('--- GET CLIENT APPLICATIONS ---');
        console.log('Token Payload:', { email, phone });
        console.log('Querying DB with:', { email, cleanPhone });

        // Fetch all applications matching the authenticated email and phone
        const applications = await Application.find({ email, phone: cleanPhone }).sort('-createdAt');
        
        console.log(`Found ${applications.length} applications`);

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });

    } catch (error) {
        console.error('Get client applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching applications'
        });
    }
};

// @desc    Accept MOU (Client)
// @route   POST /api/client/applications/:id/accept-mou
// @access  Private (Client)
exports.acceptMOU = async (req, res) => {
    try {
        const { email, phone } = req.client;
        const applicationId = req.params.id;
        
        const cleanPhone = phone ? phone.replace(/\s+/g, '') : '';

        const application = await Application.findOne({
            applicationId,
            email,
            phone: cleanPhone
        });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
        }

        if (application.mouStatus !== 'sent_to_client') {
            return res.status(400).json({ success: false, message: 'MOU is not pending acceptance' });
        }

        application.mouStatus = 'accepted';
        application.status = 'mou_accepted';

        await application.save();

        res.status(200).json({
            success: true,
            message: 'MOU accepted successfully',
            data: application
        });

    } catch (error) {
        console.error('Accept MOU error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error accepting MOU'
        });
    }
};
