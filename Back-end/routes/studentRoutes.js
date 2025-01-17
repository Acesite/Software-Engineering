const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentprofileController');

// Define routes
router.get('/', studentController.getStudents); // Get all students
router.post('/', studentController.addStudent); // Add a new student
router.put('/:id', studentController.updateStudent); // Update an existing student by ID
router.delete('/:id', studentController.deleteStudent); 

module.exports = router;
