const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/setting.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public route to get settings (for pricing in form)
router.get('/', getSettings);

// Protected route to update settings
router.put('/', authenticate, authorize('admin', 'super_admin'), updateSettings);

module.exports = router;
