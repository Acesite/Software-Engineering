const express = require('express');
const router = express.Router();
const manageadminController = require('../Controllers/manageadminController');

// Route to get all admins
router.get('/admins', manageadminController.getAdmins);

// Route to add a new admin
router.post('/admins', manageadminController.addAdmin);

// Route to delete an admin by ID
router.delete('/admins/:id', manageadminController.deleteAdmin);

module.exports = router;
