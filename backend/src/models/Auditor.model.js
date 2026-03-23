const mongoose = require('mongoose');

const auditorSchema = new mongoose.Schema({
    // Personal Information
    personalInfo: {
        fullName: { type: String, required: true },
        dob: { type: Date, required: true },
        gender: { type: String, required: true },
        profilePhotoUrl: { type: String }, // Optional or required based on upload
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        address: {
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true }
        }
    },
    // Educational Qualifications
    education: {
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        university: { type: String, required: true },
        yearOfPassing: { type: String, required: true },
        certificateUrl: { type: String, required: true }
    },
    // ISO Auditor Certification Details
    certification: {
        type: { type: String, required: true },
        certificateNumber: { type: String, required: true },
        issuingBody: { type: String, required: true },
        issueDate: { type: Date, required: true },
        expiryDate: { type: Date, required: true },
        certificateUrl: { type: String, required: true }
    },
    // Work Experience
    experience: {
        totalYears: { type: Number, required: true },
        currentOrg: { type: String },
        designation: { type: String },
        industry: { type: String, required: true },
        auditsConducted: { type: Number, default: 0 }
    },
    // Audit Expertise
    expertise: {
        isoStandards: [{ type: String }],
        auditType: { type: String, required: true },
        industries: [{ type: String }]
    },
    // Documents Upload
    documents: {
        idProofUrl: { type: String, required: true },
        resumeUrl: { type: String, required: true },
        experienceLettersUrl: { type: String },
        pastAuditReportsUrl: { type: String }
    },
    // Declaration
    declaration: {
        type: Boolean,
        required: true,
        default: false
    },
    // Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminRemarks: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Auditor = mongoose.model('Auditor', auditorSchema);
module.exports = Auditor;
