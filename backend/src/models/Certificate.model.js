const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    applicationId: {
        type: String, // Or mongoose.Schema.Types.ObjectId if referencing real applications
        required: true
    },
    certificateNumber: {
        type: String,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true
    },
    certificationType: {
        type: String,
        required: true
    },
    scopeOfBusiness: {
        type: String
    },
    issueDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    certificateFileUrl: {
        type: String
    },
    qrCodeUrl: {
        type: String
    },
    authorizedSignatory: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Revoked'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
