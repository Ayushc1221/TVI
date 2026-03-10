const Certificate = require('../models/Certificate.model');

/**
 * Generate a certificate number in the format: TVI-{TYPE}-{YEAR}-{SEQUENCE}
 *
 * TYPE mapping:
 *   ISO Certification → ISO
 *   Audit / Inspection → AUD
 *   HRAA → HRAA
 *
 * SEQUENCE auto increments per type per year.
 *
 * @param {string} serviceType - One of 'ISO', 'AUDIT', 'HRAA'
 * @returns {Promise<string>} e.g. TVI-ISO-2026-0001
 */
const generateCertificateNumber = async (serviceType) => {
    const typeMap = {
        ISO: 'ISO',
        AUDIT: 'AUD',
        HRAA: 'HRAA',
    };

    const typeCode = typeMap[serviceType] || 'ISO';
    const year = new Date().getFullYear();
    const prefix = `TVI-${typeCode}-${year}-`;

    // Find the latest certificate for this type and year
    const latestCert = await Certificate.findOne({
        certificateNumber: { $regex: `^${prefix}` },
    })
        .sort({ certificateNumber: -1 })
        .lean();

    let sequence = 1;
    if (latestCert) {
        const parts = latestCert.certificateNumber.split('-');
        const lastSeq = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(lastSeq)) {
            sequence = lastSeq + 1;
        }
    }

    const paddedSeq = String(sequence).padStart(4, '0');
    return `${prefix}${paddedSeq}`;
};

module.exports = generateCertificateNumber;
