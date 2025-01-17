const express = require('express');
const router = express.Router();
const violationController = require('../Controllers/manageviolationController'); // Update the path if needed

// Route to get all violations
router.get('/', violationController.getViolations);

// Route to add a new violation
router.post('/', violationController.addViolation);

// Route to delete a violation by ID
router.delete('/:id', violationController.deleteViolation);

// Route to update an existing violation by ID
router.put('/:id', violationController.updateViolation);


module.exports = router;
