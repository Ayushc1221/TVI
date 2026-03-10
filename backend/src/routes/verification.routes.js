const express = require('express');
const router = express.Router();
const { verifyCertificate } = require('../controllers/verification.controller');

// GET /api/verify/:certificateNumber  (Public)
router.get('/:certificateNumber', verifyCertificate);

module.exports = router;
