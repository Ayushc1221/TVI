const Application = require('../models/Application.model');

// @desc    Get applications assigned to the logged-in auditor
// @route   GET /api/auditor/assignments
// @access  Private (Auditor)
exports.getAssignedApplications = async (req, res, next) => {
    try {
        // The auth middleware attaches the user to req.admin
        const auditorIdentifier = req.admin?.email || req.admin?.name;

        const applications = await Application.find({ assignedAuditor: auditorIdentifier })
            .sort({ auditAssignedDate: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit an audit report (PDF and Observations)
// @route   POST /api/auditor/assignments/:id/report
// @access  Private (Auditor)
exports.submitAuditReport = async (req, res, next) => {
    try {
        const { auditObservations } = req.body;
        const applicationId = req.params.id;
        const auditorIdentifier = req.admin?.email || req.admin?.name;

        const application = await Application.findOne({ 
            applicationId,
            assignedAuditor: auditorIdentifier 
        });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Assigned application not found' });
        }

        if (application.status !== 'audit_assigned') {
            return res.status(400).json({ success: false, message: 'Application is not in audit state' });
        }

        let reportUrl = application.auditReportDocument;
        if (req.file) {
            reportUrl = `/uploads/${req.file.filename}`;
        }

        if (!reportUrl) {
            return res.status(400).json({ success: false, message: 'Audit report document is required' });
        }

        application.auditReportDocument = reportUrl;
        application.auditObservations = auditObservations || application.auditObservations;
        application.auditReportSubmittedAt = new Date();
        application.status = 'audit_report_submitted';

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Audit report submitted successfully',
            data: application
        });
    } catch (error) {
        next(error);
    }
};
