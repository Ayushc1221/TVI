const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * Generate a QR code image file for a certificate verification URL.
 *
 * @param {string} certificateNumber - The certificate number to encode
 * @returns {Promise<string>} - Relative path to the saved QR code image
 */
const generateQRCode = async (certificateNumber) => {
    const verificationUrl = `https://techvimalinternational.com/verify?cert=${certificateNumber}`;

    const qrDir = path.join(__dirname, '..', '..', 'uploads', 'certificates');
    if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
    }

    const filename = `qr_${certificateNumber}.png`;
    const filePath = path.join(qrDir, filename);

    await QRCode.toFile(filePath, verificationUrl, {
        width: 200,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF',
        },
    });

    return `/uploads/certificates/${filename}`;
};

/**
 * Generate a QR code as a data URL (base64) for embedding in templates.
 *
 * @param {string} certificateNumber
 * @returns {Promise<string>} - Base64 encoded data URL
 */
const generateQRCodeDataURL = async (certificateNumber) => {
    const verificationUrl = `https://techvimalinternational.com/verify?cert=${certificateNumber}`;

    const dataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 200,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF',
        },
    });

    return dataUrl;
};

module.exports = { generateQRCode, generateQRCodeDataURL };
