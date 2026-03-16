const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { authenticateClient } = require('../middleware');

// Public routes for client
router.post('/login', clientController.loginClient);

// Protected routes for client
router.use(authenticateClient);
router.get('/applications', clientController.getClientApplications);

module.exports = router;
