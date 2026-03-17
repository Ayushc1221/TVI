const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    getAssignedApplications,
    submitAuditReport
} = require('../controllers/auditor.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/auditor/assignments
router.get('/assignments', authenticate, authorize('auditor', 'master_admin'), getAssignedApplications);

// POST /api/auditor/assignments/:id/report
router.post('/assignments/:id/report', authenticate, authorize('auditor', 'master_admin'), upload.single('auditReportDocument'), submitAuditReport);

module.exports = router;
