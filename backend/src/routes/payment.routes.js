const express = require('express');
const router = express.Router();
const { getPayments, createPayment } = require('../controllers/payment.controller');
const { authenticate } = require('../middleware');

// GET /api/payments
router.get('/', authenticate, getPayments);

// POST /api/payments
router.post('/', authenticate, createPayment);

module.exports = router;
