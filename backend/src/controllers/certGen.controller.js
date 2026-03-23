const path = require('path');
const fs = require('fs');
const Certificate = require('../models/Certificate.model');
const Application = require('../models/Application.model');
const generateCertificateNumber = require('../utils/generateCertificateNumber');
const { generateQRCode, generateQRCodeDataURL } = require('../utils/generateQRCode');
const generatePDF = require('../utils/generatePDF');

// Default HTML template fallback (used if no DB template is found)
const defaultTemplate = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; padding: 40px; font-family: 'Georgia', serif; background: #fff; }
  .cert-container { border: 12px double #1e3a5f; padding: 60px; text-align: center; position: relative; min-height: 600px; }
  .cert-title { font-size: 36px; color: #1e3a5f; text-transform: uppercase; letter-spacing: 6px; margin-bottom: 10px; }
  .cert-subtitle { font-size: 14px; color: #666; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 40px; }
  .cert-body { font-size: 18px; color: #555; font-style: italic; margin-bottom: 10px; }
  .cert-company { font-size: 32px; color: #1e3a5f; font-weight: bold; margin: 20px 0; }
  .cert-type { font-size: 24px; color: #333; font-weight: bold; margin: 20px 0; }
  .cert-scope { font-size: 16px; color: #444; margin: 15px 60px; }
  .cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; padding-top: 30px; border-top: 1px solid #ddd; }
  .cert-dates { text-align: left; font-size: 13px; color: #555; }
  .cert-qr { text-align: center; }
  .cert-signatory { text-align: right; }
  .cert-signatory .name { font-size: 20px; font-style: italic; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 5px; }
  .cert-signatory .label { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #666; }
</style>
</head>
<body>
  <div class="cert-container">
    <div class="cert-title">Certificate of Registration</div>
    <div class="cert-subtitle">Certificate No: {{certificate_number}}</div>
    <div class="cert-body">This is to certify that the management system of</div>
    <div class="cert-company">{{company_name}}</div>
    <div class="cert-body">has been assessed and found to be in accordance with the requirements of</div>
    <div class="cert-type">{{certification_type}}</div>
    <div class="cert-body">For the following scope:</div>
    <div class="cert-scope">{{scope}}</div>
    <div class="cert-footer">
      <div class="cert-dates">
        <div><strong>Issue Date:</strong> {{issue_date}}</div>
        <div><strong>Expiry Date:</strong> {{expiry_date}}</div>
      </div>
      <div class="cert-qr">{{qr_code}}</div>
      <div class="cert-signatory">
        <div class="name">Authorized Signatory</div>
        <div class="label">Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// @desc    Get next certificate number prediction
// @route   GET /api/certificates/next-number?serviceType=iso
// @access  Private
exports.getNextCertificateNumber = async (req, res, next) => {
    try {
        const { serviceType } = req.query;
        if (!serviceType) {
            return res.status(400).json({ success: false, message: 'serviceType query param is required' });
        }
        const nextNumber = await generateCertificateNumber(serviceType.toUpperCase());
        res.status(200).json({ success: true, data: nextNumber });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate a certificate (full pipeline)
// @route   POST /api/certificates/generate
// @access  Private
exports.generateCertificate = async (req, res, next) => {
    try {
        console.log("GENERATE CERTIFICATE REQUEST BODY:", req.body);
        console.log("GENERATE CERTIFICATE FILE:", req.file ? req.file.originalname : "No file");
        
        const {
            applicationId,
            companyName,
            certificationType,
            scopeOfBusiness,  // frontend sends this
            scope,            // fallback
            issueDate,
            expiryDate,
            serviceType,
            authorizedSignatory,
            certificateNumber: providedNumber // optional frontend override
        } = req.body;

        const scopeValue = scopeOfBusiness || scope || '';

        if (!applicationId || !companyName || !certificationType || !issueDate || !expiryDate || !serviceType) {
            return res.status(400).json({
                success: false,
                message: 'applicationId, companyName, certificationType, issueDate, expiryDate, and serviceType are required',
            });
        }

        // 1. Generate certificate number automatically or use provided
        const certificateNumber = providedNumber || await generateCertificateNumber(serviceType);

        // 2. Generate QR code containing verification link
        const qrCodeUrl = await generateQRCode(certificateNumber);
        let qrCodeDataUrl = '';
        try {
            qrCodeDataUrl = await generateQRCodeDataURL(certificateNumber);
        } catch (e) {
            console.warn('QR code data URL generation failed (non-critical):', e.message);
        }

        // 3. Load certificate template (fallback to default)
        let templateHtml = defaultTemplate;
        try {
            const CertificateTemplate = require('../models/CertificateTemplate.model');
            const template = await CertificateTemplate.findOne({ serviceType: serviceType.toUpperCase() });

            if (template && template.fileUrl) {
                const templatePath = path.join(__dirname, '..', '..', template.fileUrl);
                if (fs.existsSync(templatePath)) {
                    templateHtml = fs.readFileSync(templatePath, 'utf8');
                }
            }
        } catch (e) {
            console.error('Error loading template (using default):', e.message);
        }

        // 4. Format dates for display
        const formattedIssueDate = new Date(issueDate).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric',
        });
        const formattedExpiryDate = new Date(expiryDate).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric',
        });

        // 5. Try to generate PDF via Puppeteer (optional - may fail on some environments)
        let certificateUrl = null;
        try {
            const pdfFilename = `${certificateNumber}.pdf`;
            certificateUrl = await generatePDF({
                templateHtml,
                data: {
                    certificateNumber,
                    companyName,
                    certificationType,
                    scope: scopeValue,
                    issueDate: formattedIssueDate,
                    expiryDate: formattedExpiryDate,
                    qrCodeDataUrl,
                },
                outputFilename: pdfFilename,
            });
        } catch (pdfErr) {
            console.error('PDF generation failed (non-fatal, saving record anyway):', pdfErr.message);
            // Certificate record is still saved below without a PDF file
        }

        // 6. Store certificate record in database
        let finalCertificateUrl = certificateUrl;
        if (req.file) {
            finalCertificateUrl = `/uploads/${req.file.filename}`;
        }

        const certificate = await Certificate.findOneAndUpdate(
            { applicationId },
            {
                certificateNumber,
                applicationId,
                companyName,
                certificationType,
                scopeOfBusiness: scopeValue,
                issueDate,
                expiryDate,
                certificateFileUrl: finalCertificateUrl,   // Prioritize uploaded file from frontend
                qrCodeUrl,
                authorizedSignatory: authorizedSignatory || '',
            },
            { new: true, upsert: true }
        );

        // 7. Update application status
        await Application.findOneAndUpdate(
            { applicationId },
            { status: 'certificate_generated' }
        );

        res.status(201).json({
            success: true,
            message: 'Certificate generated successfully',
            data: certificate,
        });
    } catch (error) {
        console.error('generateCertificate error:', error);
        next(error);
    }
};

// @desc    Download certificate PDF
// @route   GET /api/certificates/download/:id
// @access  Private
exports.downloadCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found',
            });
        }

        const filePath = path.join(__dirname, '..', '..', certificate.certificateUrl);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Certificate file not found on server',
            });
        }

        res.download(filePath, `${certificate.certificateNumber}.pdf`);
    } catch (error) {
        next(error);
    }
};
