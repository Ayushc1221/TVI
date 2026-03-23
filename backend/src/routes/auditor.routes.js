const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    getAssignedApplications,
    submitAuditReport,
    registerAuditor,
    getAuditorRegistrations,
    updateAuditorStatus,
    getApprovedAuditors
} = require('../controllers/auditor.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public route for Auditor Registration
router.post('/register', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'educationCertificate', maxCount: 1 },
    { name: 'isoCertificate', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'experienceLetters', maxCount: 1 },
    { name: 'pastAuditReports', maxCount: 1 }
]), registerAuditor);


// GET /api/auditor/assignments
router.get('/assignments', authenticate, authorize('auditor', 'super_admin', 'admin'), getAssignedApplications);

// POST /api/auditor/assignments/:id/report
router.post('/assignments/:id/report', authenticate, authorize('auditor', 'super_admin', 'admin'), upload.single('auditReportDocument'), submitAuditReport);


// Admin routes for managing Auditor Registrations
router.get('/registrations', authenticate, authorize('admin', 'super_admin'), getAuditorRegistrations);
router.put('/registrations/:id/status', authenticate, authorize('admin', 'super_admin'), updateAuditorStatus);
router.get('/approved', authenticate, authorize('admin', 'super_admin'), getApprovedAuditors);

module.exports = router;
