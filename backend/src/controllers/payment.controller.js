const Payment = require('../models/Payment.model');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
    try {
        const { applicationId, paymentStatus, search, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (applicationId) filter.applicationId = applicationId;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (search) {
            filter.$or = [
                { paymentId: { $regex: search, $options: 'i' } },
                { applicationId: { $regex: search, $options: 'i' } },
                { transactionId: { $regex: search, $options: 'i' } }
            ];
        }

        const payments = await Payment.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        const total = await Payment.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: payments.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: payments,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a Razorpay Order
// @route   POST /api/payments/create-order
// @access  Public
exports.createOrder = async (req, res, next) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: 'Amount is required'
            });
        }

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise for INR)
            currency,
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Razorpay Create Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order'
        });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Public
exports.verifyPayment = async (req, res, next) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            applicationId,
            amount,
            paymentMethod
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (isSignatureValid) {
            // Save payment record to database
            const payment = await Payment.create({
                paymentId: razorpay_payment_id,
                applicationId,
                amount,
                paymentMethod: paymentMethod || 'Razorpay',
                paymentStatus: 'completed',
                transactionId: razorpay_order_id
            });

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                data: payment
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }
    } catch (error) {
        console.error('Razorpay Verify Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during verification'
        });
    }
};

// @desc    Create a payment record (manual/legacy)
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
    try {
        const { paymentId, applicationId, amount, paymentMethod, paymentStatus, transactionId } = req.body;

        if (!paymentId || !applicationId || !amount || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'paymentId, applicationId, amount, and paymentMethod are required',
            });
        }

        const payment = await Payment.create({
            paymentId,
            applicationId,
            amount,
            paymentMethod,
            paymentStatus: paymentStatus || 'pending',
            transactionId,
        });

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};
