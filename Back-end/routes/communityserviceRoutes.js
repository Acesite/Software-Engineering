// server/routes/communityserviceRoutes.js

const express = require('express');
const router = express.Router();
const communityServiceController = require('../Controllers/communityserviceController');

// Define routes
router.get('/', communityServiceController.getCommunityServiceTasks); // Route to get all tasks
router.post('/', communityServiceController.addCommunityServiceTask); // Route to add a new task
router.delete('/:id', communityServiceController.deleteCommunityServiceTask); // Route to delete a task
router.put('/:id', communityServiceController.updateCommunityServiceTask); // Route to update a task

module.exports = router;
