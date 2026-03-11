const express = require('express');
const router = express.Router();
const { 
    getPayments, 
    createPayment, 
    createOrder, 
    verifyPayment 
} = require('../controllers/payment.controller');
const { authenticate } = require('../middleware');

// Public routes for payment processing
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

// Private routes for admin management
router.get('/', authenticate, getPayments);
router.post('/', authenticate, createPayment);

module.exports = router;
