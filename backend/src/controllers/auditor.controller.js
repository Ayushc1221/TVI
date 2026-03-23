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

const Auditor = require('../models/Auditor.model');
const Admin = require('../models/Admin.model');

// @desc    Register a new Auditor (Public)
// @route   POST /api/auditor/register
// @access  Public
exports.registerAuditor = async (req, res, next) => {
    try {
        const data = req.body;
        
        // Handle file uploads
        const getFileUrl = (fieldName) => {
            if (req.files && req.files[fieldName] && req.files[fieldName].length > 0) {
                return `/uploads/${req.files[fieldName][0].filename}`;
            }
            return '';
        };

        const auditorData = {
            personalInfo: {
                fullName: data.fullName,
                dob: data.dob,
                gender: data.gender,
                profilePhotoUrl: getFileUrl('profilePhoto'),
                email: data.email,
                phone: data.phone,
                address: {
                    city: data.city,
                    state: data.state,
                    country: data.country
                }
            },
            education: {
                degree: data.degree,
                fieldOfStudy: data.fieldOfStudy,
                university: data.university,
                yearOfPassing: data.yearOfPassing,
                certificateUrl: getFileUrl('educationCertificate')
            },
            certification: {
                type: data.certType,
                certificateNumber: data.certNumber,
                issuingBody: data.issuingBody,
                issueDate: data.issueDate,
                expiryDate: data.expiryDate,
                certificateUrl: getFileUrl('isoCertificate')
            },
            experience: {
                totalYears: data.totalYears,
                currentOrg: data.currentOrg,
                designation: data.designation,
                industry: data.industry,
                auditsConducted: data.auditsConducted || 0
            },
            expertise: {
                isoStandards: data.isoStandards ? (Array.isArray(data.isoStandards) ? data.isoStandards : JSON.parse(data.isoStandards)) : [],
                auditType: data.auditType,
                industries: data.industries ? (Array.isArray(data.industries) ? data.industries : JSON.parse(data.industries)) : []
            },
            documents: {
                idProofUrl: getFileUrl('idProof'),
                resumeUrl: getFileUrl('resume'),
                experienceLettersUrl: getFileUrl('experienceLetters'),
                pastAuditReportsUrl: getFileUrl('pastAuditReports')
            },
            declaration: data.declaration === 'true' || data.declaration === true,
            status: 'pending'
        };

        const newAuditor = await Auditor.create(auditorData);

        res.status(201).json({
            success: true,
            message: 'Auditor registration submitted successfully',
            data: newAuditor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all auditor registrations
// @route   GET /api/auditor/registrations
// @access  Private (Admin)
exports.getAuditorRegistrations = async (req, res, next) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) {
            query.status = status;
        }

        const auditors = await Auditor.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: auditors.length,
            data: auditors
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update auditor status (Approve/Reject)
// @route   PUT /api/auditor/registrations/:id/status
// @access  Private (Admin)
exports.updateAuditorStatus = async (req, res, next) => {
    try {
        const { status, adminRemarks } = req.body;
        const auditor = await Auditor.findById(req.params.id);

        if (!auditor) {
            return res.status(404).json({ success: false, message: 'Auditor registration not found' });
        }

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        auditor.status = status;
        if (adminRemarks) auditor.adminRemarks = adminRemarks;

        await auditor.save();

        // If newly approved, generate an Admin account for them with role 'auditor'
        if (status === 'approved') {
            const email = auditor.personalInfo.email;
            const existingAdmin = await Admin.findOne({ email });

            if (!existingAdmin) {
                // Important: Using mobile number as default password as requested by user
                const defaultPassword = auditor.personalInfo.phone;
                
                await Admin.create({
                    name: auditor.personalInfo.fullName,
                    email: email,
                    password: defaultPassword,
                    role: 'auditor',
                    isActive: true
                });
            } else if (existingAdmin && existingAdmin.role !== 'auditor') {
                // If they exist with a different role, maybe upgrade them or skip
                // Ideally, we just update their role to auditor if they somehow exist already
                existingAdmin.role = 'auditor';
                await existingAdmin.save();
            }
        }

        res.status(200).json({
            success: true,
            message: `Auditor application ${status} successfully`,
            data: auditor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get approved auditors for dropdown selection
// @route   GET /api/auditor/approved
// @access  Private (Admin)
exports.getApprovedAuditors = async (req, res, next) => {
    try {
        const auditors = await Auditor.find({ status: 'approved' }).select('personalInfo.fullName personalInfo.email expertise.isoStandards');

        res.status(200).json({
            success: true,
            count: auditors.length,
            data: auditors
        });
    } catch (error) {
        next(error);
    }
};
