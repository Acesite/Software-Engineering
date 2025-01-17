const express = require('express');
const router = express.Router();
const managestudentprofileController = require('../Controllers/managestudentprofileController'); // Adjust path if necessary
const multer = require('multer');

// Multer configuration for file uploads
const upload = multer({
  dest: '../../public/uploads', // Directory for storing uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
});

// Get student profile by userId
router.get('/profile/:userId', managestudentprofileController.getStudentProfile);

// Update student profile by userId (with optional profile picture upload)
router.put('/profile/:userId', upload.single('profilePicture'), managestudentprofileController.updateStudentProfile);

module.exports = router;
