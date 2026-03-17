const express = require('express');
const router = express.Router();
const {
    generateCertificate,
    verifyCertificate,
    downloadCertificate
} = require('../controllers/certificate.controller');
const upload = require('../middleware/upload');

// @route   GET /api/certificates/verify/:certificateNumber
// @desc    Verify certificate authenticity
// @access  Public
router.get('/verify/:certificateNumber', verifyCertificate);

// @route   GET /api/certificates/download/:id
// @desc    Download/view a certificate by its Application ID or Certificate ID
// @access  Public
router.get('/download/:id', downloadCertificate);

// @route   POST /api/certificates
// @desc    Create a new generated certificate (Backend API)
// @access  Public / Admin (keeping public for temp mock)
router.post('/', upload.single('certificateFile'), generateCertificate);

module.exports = router;
