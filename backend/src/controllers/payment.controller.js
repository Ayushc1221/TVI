const Payment = require('../models/Payment.model');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
    try {
        const { applicationId, paymentStatus, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (applicationId) filter.applicationId = applicationId;
        if (paymentStatus) filter.paymentStatus = paymentStatus;

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

// @desc    Create a payment record
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
