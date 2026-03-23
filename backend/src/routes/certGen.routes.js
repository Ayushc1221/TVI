const express = require('express');
const router = express.Router();
const { generateCertificate, downloadCertificate, getNextCertificateNumber } = require('../controllers/certGen.controller');
const { verifyCertificate } = require('../controllers/certificate.controller');
const { authenticate } = require('../middleware');
const upload = require('../middleware/upload');

// GET /api/certificates/next-number
router.get('/next-number', authenticate, getNextCertificateNumber);

// POST /api/certificates/generate
router.post('/generate', authenticate, upload.single('certificateFile'), generateCertificate);

// GET /api/certificates/download/:id
router.get('/download/:id', authenticate, downloadCertificate);

// GET /api/certificates/verify/:certificateNumber  (Public)
router.get('/verify/:certificateNumber', verifyCertificate);

module.exports = router;
