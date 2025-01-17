// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');

// Existing route for dashboard data
router.get('/dashboard-data', adminController.getAdminDashboardData);

// New route to fetch students near completion
router.get('/students-near-completion', adminController.getStudentsNearCompletion);

module.exports = router;
