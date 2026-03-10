const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
    {
        templateId: {
            type: String,
            required: true,
            unique: true,
        },
        serviceType: {
            type: String,
            required: true,
            enum: ['ISO', 'AUDIT', 'HRAA'],
        },
        templateUrl: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Template', templateSchema);
