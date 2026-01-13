const { Contact } = require('../models');

/**
 * Submit Contact Form (Public)
 * POST /api/contact
 */
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, company, message } = req.body;

        // Create contact entry
        const contact = await Contact.create({
            name,
            email,
            phone,
            company,
            message,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown',
        });

        res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been received. We will contact you soon.',
            data: {
                id: contact._id,
            },
        });
    } catch (error) {
        console.error('Contact submission error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to submit message. Please try again.',
        });
    }
};

/**
 * Get All Contacts (Admin Only)
 * GET /api/contact
 */
const getAllContacts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Build query
        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } },
            ];
        }

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const [contacts, total] = await Promise.all([
            Contact.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit)),
            Contact.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            data: {
                contacts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalItems: total,
                    itemsPerPage: parseInt(limit),
                },
            },
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts',
        });
    }
};

/**
 * Get Single Contact (Admin Only)
 * GET /api/contact/:id
 */
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        res.status(200).json({
            success: true,
            data: { contact },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact',
        });
    }
};

/**
 * Update Contact Status (Admin Only)
 * PATCH /api/contact/:id/status
 */
const updateContactStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status, notes },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact status updated',
            data: { contact },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update contact',
        });
    }
};

/**
 * Delete Contact (Admin Only)
 * DELETE /api/contact/:id
 */
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact',
        });
    }
};

module.exports = {
    submitContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
};
