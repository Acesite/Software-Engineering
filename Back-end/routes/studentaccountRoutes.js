const express = require('express');
 const verifyToken = require('../middleware/verifyToken'); // Import the middleware
const studentAccountController = require('../Controllers/studentaccountController'); // Import your controller
const router = express.Router();

// Test route for assigned tasks
router.get('/student/assigned-tasks/:studentId/',studentAccountController.getAssignedTasks);
// router.get('/student/:studentId',studentAccountController.getAssignedTasks)

// Route to get student dashboard
router.get('/student/dashboard', verifyToken, studentAccountController.getStudentDashboard);

module.exports = router;
