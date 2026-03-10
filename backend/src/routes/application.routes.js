const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    createApplication,
    getApplications,
    getApplicationById,
    assignAuditor,
    updateStatus,
} = require('../controllers/application.controller');
const { authenticate } = require('../middleware');

const uploadFields = [
    { name: 'companyRegCert', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'siteAddressProof', maxCount: 1 },
    { name: 'gstCert', maxCount: 1 },
    { name: 'prevIsoCert', maxCount: 1 },
    { name: 'prevAuditReport', maxCount: 1 },
    { name: 'hrPolicyDocs', maxCount: 1 },
    { name: 'payrollSample', maxCount: 1 }
];

// POST /api/applications (Public)
router.post('/', upload.fields(uploadFields), createApplication);

// GET /api/applications
router.get('/', authenticate, getApplications);

// GET /api/applications/:id
router.get('/:id', authenticate, getApplicationById);

// PUT /api/applications/assign-auditor
router.put('/assign-auditor', authenticate, assignAuditor);

// PUT /api/applications/status
router.put('/status', authenticate, updateStatus);

module.exports = router;
