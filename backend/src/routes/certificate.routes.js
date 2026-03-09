const express = require('express');
const router = express.Router();
const {
    generateCertificate,
    verifyCertificate
} = require('../controllers/certificate.controller');

// @route   GET /api/certificates/verify/:certificateNumber
// @desc    Verify certificate authenticity
// @access  Public
router.get('/verify/:certificateNumber', verifyCertificate);

// @route   POST /api/certificates
// @desc    Create a new generated certificate (Backend API)
// @access  Public / Admin (keeping public for temp mock)
router.post('/', generateCertificate);

module.exports = router;
