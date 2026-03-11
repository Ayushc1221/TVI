const express = require('express');
const router = express.Router();
const { uploadTemplate, getTemplates } = require('../controllers/template.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

// Protect all routes below
router.use(authenticate);

router.route('/')
    .get(getTemplates)
    .post(authorize('admin', 'super_admin'), upload.single('template'), uploadTemplate);

module.exports = router;
