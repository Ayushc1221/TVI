const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        applicationId: {
            type: String,
            required: true,
            unique: true,
        },
        // Company Details
        companyName: { type: String, required: [true, 'Company name is required'], trim: true },
        businessType: { type: String },
        industryType: { type: String },
        companyAddress: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String, default: 'India' },
        pinCode: { type: String },
        gstNumber: { type: String },
        companyWebsite: { type: String },

        // Contact Details
        contactPerson: { type: String, required: true },
        designation: { type: String },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, required: true },
        alternateMobile: { type: String },

        // Service Selected
        serviceType: {
            type: String,
            required: true,
            enum: ['ISO', 'AUDIT', 'HRAA', 'iso', 'audit', 'hraa'], // Frontend uses lowercase
        },

        // Service Specifics (Merged)
        certificationType: { type: mongoose.Schema.Types.Mixed }, // string or array for isoStandards
        scopeOfBusiness: { type: String },
        numEmployees: { type: String },
        certificationDuration: { type: String },
        existingIso: { type: String },

        auditServiceType: { type: String },
        auditCategories: { type: mongoose.Schema.Types.Mixed }, // array
        siteLocation: { type: String },
        numLocations: { type: String },
        preferredMode: { type: String },
        tentativeDate: { type: String },

        hraaType: { type: String },
        hraaEmployees: { type: String },
        payrollManaged: { type: String },
        hrPolicies: { type: String },
        labourLawCompliance: { type: String },

        paymentMethod: { type: String },
        serviceFee: { type: String },
        paymentId: { type: String },
        paymentStatus: { type: String, default: 'Pending' },
        termsAgreed: { type: Boolean, default: false },

        // Documents
        documents: [
            {
                name: String,
                url: String,
                uploadedAt: { type: Date, default: Date.now },
            },
        ],

        // System Tracking fields
        status: {
            type: String,
            enum: [
                'submitted',
                'under_review',
                'approved',
                'audit_assigned',
                'certificate_generated',
                'completed',
                'rejected',
            ],
            default: 'submitted',
        },
        assignedAuditor: {
            type: String,
            default: null,
        },
        adminNotes: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
