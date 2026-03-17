const Application = require('../models/Application.model');

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Public
exports.createApplication = async (req, res, next) => {
    try {
        const formData = req.body;

        // Sanitize phone number by removing all whitespace
        if (formData.phone) {
            formData.phone = formData.phone.replace(/\s+/g, '');
        }

        // Generate Application ID (APP-YYYY-XXXX)
        const year = new Date().getFullYear();

        // Find the latest application for this year to get the next sequence number
        const lastApp = await Application.findOne({
            applicationId: new RegExp(`^APP-${year}-`)
        }).sort({ applicationId: -1 });

        let nextNumber = 1;
        if (lastApp) {
            const lastIdParts = lastApp.applicationId.split('-');
            const lastSeq = parseInt(lastIdParts[lastIdParts.length - 1]);
            if (!isNaN(lastSeq)) {
                nextNumber = lastSeq + 1;
            }
        }

        const newIdNumber = nextNumber.toString().padStart(4, '0');
        const applicationId = `APP-${year}-${newIdNumber}`;

        // Handle uploaded files
        const documents = [];
        if (req.files) {
            Object.keys(req.files).forEach(fieldname => {
                const filesArray = req.files[fieldname];
                filesArray.forEach(file => {
                    documents.push({
                        name: fieldname, // Map fieldname to document name (e.g., companyRegCert)
                        url: `/uploads/${file.filename}`
                    });
                });
            });
        }

        // Attempting to parse arrays if sent as string
        let parsedIsoStandards = req.body.isoStandards;
        if (typeof parsedIsoStandards === 'string') {
            try { parsedIsoStandards = JSON.parse(parsedIsoStandards); } catch (e) { parsedIsoStandards = [req.body.isoStandards]; }
        }

        let parsedAuditCategories = req.body.auditCategories;
        if (typeof parsedAuditCategories === 'string') {
            try { parsedAuditCategories = JSON.parse(parsedAuditCategories); } catch (e) { parsedAuditCategories = [req.body.auditCategories]; }
        }

        const newApplication = new Application({
            ...formData,
            applicationId,
            certificationType: parsedIsoStandards || formData.certificationType,
            auditCategories: parsedAuditCategories,
            documents
        });

        await newApplication.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                applicationId: newApplication.applicationId
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
exports.getApplications = async (req, res, next) => {
    try {
        const { status, serviceType, search, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (serviceType) filter.serviceType = serviceType;
        if (search) {
            filter.$or = [
                { applicationId: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { contactPerson: { $regex: search, $options: 'i' } },
                { contactName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const applications = await Application.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        const total = await Application.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: applications.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findOne({ applicationId: req.params.id });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Assign auditor to application
// @route   PUT /api/applications/assign-auditor
// @access  Private
exports.assignAuditor = async (req, res, next) => {
    try {
        const { applicationId, assignedAuditor } = req.body;

        if (!applicationId || !assignedAuditor) {
            return res.status(400).json({
                success: false,
                message: 'applicationId and assignedAuditor are required',
            });
        }

        const application = await Application.findOne({ applicationId });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        application.assignedAuditor = assignedAuditor;
        application.status = 'audit_assigned';
        application.auditAssignedDate = new Date(); // Start 5-day SLA
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Auditor assigned successfully',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PUT /api/applications/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
    try {
        const { applicationId, status } = req.body;

        const validStatuses = [
            'submitted',
            'under_review',
            'quotation_sent',
            'mou_accepted',
            'audit_assigned',
            'audit_report_submitted',
            'review_approved',
            'certificate_generated',
            'completed',
            'rejected',
        ];

        if (!applicationId || !status) {
            return res.status(400).json({
                success: false,
                message: 'applicationId and status are required',
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
            });
        }

        const application = await Application.findOne({ applicationId });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            success: true,
            message: `Application status updated to ${status}`,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload MOU and set quotation amount (Admin)
// @route   POST /api/applications/:id/mou
// @access  Private
exports.uploadMOU = async (req, res, next) => {
    try {
        const { quotationAmount } = req.body;
        const applicationId = req.params.id;

        const application = await Application.findOne({ applicationId });
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        let mouUrl = application.mouDocument;
        if (req.file) {
            mouUrl = `/uploads/${req.file.filename}`;
        }

        application.quotationAmount = quotationAmount || application.quotationAmount;
        application.mouDocument = mouUrl;
        application.mouStatus = 'sent_to_client';
        application.status = 'quotation_sent';

        await application.save();

        res.status(200).json({
            success: true,
            message: 'MOU uploaded and sent to client',
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Technical Review of Audit Report (Admin/Reviewer)
// @route   POST /api/applications/:id/review
// @access  Private
exports.technicalReview = async (req, res, next) => {
    try {
        const { technicalReviewStatus, technicalReviewNotes } = req.body;
        const applicationId = req.params.id;

        if (!['approved', 'requires_rework'].includes(technicalReviewStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid review status' });
        }

        const application = await Application.findOne({ applicationId });
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        application.technicalReviewStatus = technicalReviewStatus;
        application.technicalReviewNotes = technicalReviewNotes;

        if (technicalReviewStatus === 'approved') {
            application.status = 'review_approved';
        } else {
            // If it requires rework, keep it in audit_report_submitted or kick it back
            application.status = 'audit_assigned'; 
        }

        await application.save();

        res.status(200).json({
            success: true,
            message: `Technical review completed: ${technicalReviewStatus}`,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify an uploaded document
// @route   PUT /api/applications/:id/documents/:docId/verify
// @access  Private
exports.verifyDocument = async (req, res, next) => {
    try {
        const { id, docId } = req.params;
        const application = await Application.findOne({ applicationId: id });
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        const document = application.documents.id(docId);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        document.verified = !document.verified; // Toggle verification
        await application.save();

        res.status(200).json({
            success: true,
            message: `Document ${document.verified ? 'verified' : 'unverified'}`,
            data: document
        });
    } catch (error) {
        next(error);
    }
};
