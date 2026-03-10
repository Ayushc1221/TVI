const express = require('express');
const router = express.Router();
const { generateCertificate, downloadCertificate } = require('../controllers/certGen.controller');
const { verifyCertificate } = require('../controllers/verification.controller');
const { authenticate } = require('../middleware');

// POST /api/certificates/generate
router.post('/generate', authenticate, generateCertificate);

// GET /api/certificates/download/:id
router.get('/download/:id', authenticate, downloadCertificate);

// GET /api/certificates/verify/:certificateNumber  (Public)
router.get('/verify/:certificateNumber', verifyCertificate);

module.exports = router;
