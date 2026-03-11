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

// @desc    Generate a certificate (full pipeline)
// @route   POST /api/certificates/generate
// @access  Private
exports.generateCertificate = async (req, res, next) => {
    try {
        const {
            applicationId,
            companyName,
            certificationType,
            scope,
            issueDate,
            expiryDate,
            serviceType,
        } = req.body;

        if (!applicationId || !companyName || !certificationType || !issueDate || !expiryDate || !serviceType) {
            return res.status(400).json({
                success: false,
                message: 'applicationId, companyName, certificationType, issueDate, expiryDate, and serviceType are required',
            });
        }

        // 1. Generate certificate number automatically
        const certificateNumber = await generateCertificateNumber(serviceType);

        // 2. Generate QR code containing verification link
        const qrCodeUrl = await generateQRCode(certificateNumber);
        const qrCodeDataUrl = await generateQRCodeDataURL(certificateNumber);

        // 3. Load certificate template (fallback to default)
        let templateHtml = defaultTemplate;
        try {
            const CertificateTemplate = require('../models/CertificateTemplate.model');
            const template = await CertificateTemplate.findOne({ serviceType: serviceType.toUpperCase() });

            if (template && template.fileUrl) {
                const templatePath = path.join(__dirname, '..', '..', template.fileUrl);
                if (fs.existsSync(templatePath)) {
                    // Check if it's an HTML file
                    if (templatePath.endsWith('.html')) {
                        templateHtml = fs.readFileSync(templatePath, 'utf8');
                    } else {
                        // If it's an image/logo background (handled differently in templateHtml)
                        // For now we assume they upload HTML templates as requested.
                        // If it's a PDF/Image, we would need a different logic to layer.
                        // But let's stick to the HTML requirement.
                        templateHtml = fs.readFileSync(templatePath, 'utf8');
                    }
                }
            }
        } catch (e) {
            console.error('Error loading template:', e);
            // Use default template
        }

        // 4. Format dates for display
        const formattedIssueDate = new Date(issueDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
        const formattedExpiryDate = new Date(expiryDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        // 5. Replace template placeholders & Generate PDF certificate
        const pdfFilename = `${certificateNumber}.pdf`;
        const certificateUrl = await generatePDF({
            templateHtml,
            data: {
                certificateNumber,
                companyName,
                certificationType,
                scope: scope || '',
                issueDate: formattedIssueDate,
                expiryDate: formattedExpiryDate,
                qrCodeDataUrl,
            },
            outputFilename: pdfFilename,
        });

        // 6. Store certificate record in database
        const certificate = await Certificate.create({
            certificateNumber,
            applicationId,
            companyName,
            certificationType,
            scope,
            issueDate,
            expiryDate,
            certificateUrl,
            qrCodeUrl,
        });

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
