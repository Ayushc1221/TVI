const mongoose = require('mongoose');

const certificateTemplateSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        required: true,
        enum: ['ISO', 'Audit', 'HRAA'],
        unique: true // Ensures only one active template per service type
    },
    templateName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { timestamps: true });

module.exports = mongoose.model('CertificateTemplate', certificateTemplateSchema);
