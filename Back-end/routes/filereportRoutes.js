    const express = require('express');
    const { getStudents, getViolations, fileReport, getReportsWithDetails, updateReport, deleteReport } = require('../Controllers/filereportController');

    const router = express.Router();

    // Routes
    router.get('/students', getStudents);
    router.get('/violations', getViolations);
    router.get('/reports', getReportsWithDetails);
    router.post('/file', fileReport);

    // New routes for edit and delete
    router.put('/reports/:report_id', updateReport);  // Update report (Edit)
    router.delete('/reports/:report_id', deleteReport);  // Delete report

    module.exports = router;
