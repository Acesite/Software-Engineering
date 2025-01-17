const express = require('express');
const router = express.Router();
const reportsController = require('../Controllers/reportsController');

router.get('/', reportsController.getReports);


module.exports = router;
