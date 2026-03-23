const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * Generate a PDF certificate from an HTML template string.
 *
 * Replaces the following placeholders in the template:
 *   {{certificate_number}}
 *   {{company_name}}
 *   {{certification_type}}
 *   {{scope}}
 *   {{issue_date}}
 *   {{expiry_date}}
 *   {{qr_code}}
 *
 * @param {Object} options
 * @param {string} options.templateHtml - The raw HTML template string
 * @param {Object} options.data - Data to fill placeholders
 * @param {string} options.data.certificateNumber
 * @param {string} options.data.companyName
 * @param {string} options.data.certificationType
 * @param {string} options.data.scope
 * @param {string} options.data.issueDate
 * @param {string} options.data.expiryDate
 * @param {string} options.data.qrCodeDataUrl - Base64 QR code data URL
 * @param {string} options.outputFilename - The output PDF filename (without path)
 * @returns {Promise<string>} - Relative path to the generated PDF
 */
const generatePDF = async ({ templateHtml, data, outputFilename }) => {
    // Replace placeholders
    let html = templateHtml;
    html = html.replace(/{{certificate_number}}/g, data.certificateNumber || '');
    html = html.replace(/{{company_name}}/g, data.companyName || '');
    html = html.replace(/{{certification_type}}/g, data.certificationType || '');
    html = html.replace(/{{scope}}/g, data.scope || '');
    html = html.replace(/{{issue_date}}/g, data.issueDate || '');
    html = html.replace(/{{expiry_date}}/g, data.expiryDate || '');
    html = html.replace(
        /{{qr_code}}/g,
        data.qrCodeDataUrl
            ? `<img src="${data.qrCodeDataUrl}" width="150" height="150" alt="QR Code" />`
            : ''
    );

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '..', '..', 'uploads', 'certificates');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, outputFilename);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    try {
        await page.setContent(html, { waitUntil: 'networkidle2', timeout: 15000 });
    } catch (e) {
        console.warn('page.setContent timeout or error (non-fatal, generating PDF anyway):', e.message);
    }

    await page.pdf({
        path: outputPath,
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await browser.close();

    return `/uploads/certificates/${outputFilename}`;
};

module.exports = generatePDF;
