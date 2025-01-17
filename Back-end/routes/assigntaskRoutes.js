const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  addTask,
  updateTask, 
  deleteTask,
  getStudentDetails,
  getAllCommunityServiceTasks,
  getAllPersonsInCharge,
  displayTask,
  logTaskHours,
  getAllViolations, // Import the new getAllViolations function
} = require('../Controllers/assigntaskController');

// Routes for task assignments
router.get('/', getAllTasks); // Fetch all tasks
router.post('/', addTask); // Add a new task
router.delete('/:id', deleteTask); // Delete a task by ID
router.get('/students/:studentId/details', getStudentDetails); // Fetch student details by ID
router.get('/community-service', getAllCommunityServiceTasks); // Fetch all community service tasks
router.get('/person-in-charge', getAllPersonsInCharge);
router.get('/tasks/details', displayTask);
router.put('/:id', updateTask);
router.post('/tasks/log-hours', logTaskHours);

// Add the route for violations
router.get('/violations', getAllViolations); // Get all violations

module.exports = router;
