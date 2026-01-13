const express = require('express');
const { body, param } = require('express-validator');
const { contactController } = require('../controllers');
const { authenticate, validate } = require('../middleware');

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit contact form (Public)
 * @access  Public
 */
router.post(
    '/',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ max: 100 })
            .withMessage('Name cannot exceed 100 characters'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid email'),
        body('phone')
            .optional()
            .trim()
            .isLength({ max: 20 })
            .withMessage('Phone number cannot exceed 20 characters'),
        body('company')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Company name cannot exceed 100 characters'),
        body('message')
            .trim()
            .notEmpty()
            .withMessage('Message is required')
            .isLength({ max: 2000 })
            .withMessage('Message cannot exceed 2000 characters'),
    ],
    validate,
    contactController.submitContact
);

/**
 * @route   GET /api/contact
 * @desc    Get all contacts (Admin only)
 * @access  Private
 */
router.get('/', authenticate, contactController.getAllContacts);

/**
 * @route   GET /api/contact/:id
 * @desc    Get single contact (Admin only)
 * @access  Private
 */
router.get(
    '/:id',
    authenticate,
    [
        param('id')
            .isMongoId()
            .withMessage('Invalid contact ID'),
    ],
    validate,
    contactController.getContactById
);

/**
 * @route   PATCH /api/contact/:id/status
 * @desc    Update contact status (Admin only)
 * @access  Private
 */
router.patch(
    '/:id/status',
    authenticate,
    [
        param('id')
            .isMongoId()
            .withMessage('Invalid contact ID'),
        body('status')
            .isIn(['new', 'read', 'replied', 'archived'])
            .withMessage('Invalid status value'),
        body('notes')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Notes cannot exceed 500 characters'),
    ],
    validate,
    contactController.updateContactStatus
);

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact (Admin only)
 * @access  Private
 */
router.delete(
    '/:id',
    authenticate,
    [
        param('id')
            .isMongoId()
            .withMessage('Invalid contact ID'),
    ],
    validate,
    contactController.deleteContact
);

module.exports = router;
