const express = require('express');
const router = express.Router();
const { uploadTemplate, getTemplates } = require('../controllers/template.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Protect all routes below
router.use(authenticate);

// Allow only Master Admin and System Admin (or as per other routes)
router.use(authorize('Master Admin', 'System Admin'));

router.route('/')
    .get(getTemplates)
    .post(uploadTemplate);

module.exports = router;
