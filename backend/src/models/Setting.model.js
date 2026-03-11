const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        default: 'platform_config'
    },
    services: {
        iso: { type: Boolean, default: true },
        audit: { type: Boolean, default: true },
        hraa: { type: Boolean, default: true }
    },
    notifications: {
        email: { type: Boolean, default: true },
        statusUpdates: { type: Boolean, default: true }
    },
    pricing: {
        iso: { type: Number, default: 25000 },
        audit: { type: Number, default: 15000 },
        inspection: { type: Number, default: 15000 },
        hraa: { type: Number, default: 30000 },
        // Detailed pricing for specific standards/types
        isoDetails: { type: Map, of: Number, default: {} },
        auditDetails: { type: Map, of: Number, default: {} },
        hraaDetails: { type: Map, of: Number, default: {} }
    }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
