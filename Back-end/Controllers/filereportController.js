const db = require('../db');

// Fetch all students
const getStudents = (req, res) => {
  const query = 'SELECT id, firstname, lastname, track, strand FROM tbl_student_profiles';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.status(500).send({ error: 'Error fetching students' });
    } else {
      res.send(results);
    }
  });
};


// Fetch all violations
const getViolations = (req, res) => {
  const query = 'SELECT id, violation FROM tbl_violation';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching violations:', err);
      res.status(500).send({ error: 'Error fetching violations' });
    } else {
      res.send(results);
    }
  });
};

// File a new report
const fileReport = (req, res) => {
  const { student_id, violation_id } = req.body;

  // Validate that both student_id and violation_id are provided
  if (!student_id || !violation_id) {
    return res.status(400).send({ error: 'Student ID and Violation ID are required' });
  }

  // Check if the student exists in tbl_student_profiles
  const studentQuery = 'SELECT id, track, strand FROM tbl_student_profiles WHERE id = ?';
  db.query(studentQuery, [student_id], (err, studentResults) => {
    if (err) {
      console.error('Error checking student:', err);
      return res.status(500).send({ error: 'Error checking student' });
    }

    if (studentResults.length === 0) {
      return res.status(400).send({ error: 'Invalid student ID' });
    }

    const { track, strand } = studentResults[0];  // Extract track and strand

    // Check if the violation exists in tbl_violation
    const violationQuery = 'SELECT 1 FROM tbl_violation WHERE id = ?';
    db.query(violationQuery, [violation_id], (err, violationResults) => {
      if (err) {
        console.error('Error checking violation:', err);
        return res.status(500).send({ error: 'Error checking violation' });
      }

      if (violationResults.length === 0) {
        return res.status(400).send({ error: 'Invalid violation ID' });
      }

      // If both student and violation exist, insert the report into tbl_filed_reports
      const insertQuery = `
        INSERT INTO tbl_filed_reports (student_id, violation_id, track, strand)
        VALUES (?, ?, ?, ?)`;
        
      db.query(insertQuery, [student_id, violation_id, track, strand], (err, results) => {
        if (err) {
          console.error('Error filing report:', err);
          return res.status(500).send({ error: 'Error filing report' });
        }

        res.send({ message: 'Report filed successfully', reportId: results.insertId });
      });
    });
  });
};


const getReportsWithDetails = (req, res) => {
  const query = `
    SELECT 
      r.report_id,
      r.student_id,
      r.violation_id,
      r.track,  -- Add track
      r.strand, -- Add strand
      s.firstname AS student_firstname,
      s.lastname AS student_lastname,
      v.violation AS violation_name
    FROM tbl_filed_reports r
    JOIN tbl_student_profiles s ON r.student_id = s.id
    JOIN tbl_violation v ON r.violation_id = v.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reports with details:', err);
      return res.status(500).json({ error: 'Unable to fetch reports' });
    }
    res.json(results);  // Send enriched reports with student, violation, track, and strand
  });
};


// Update an existing report
const updateReport = (req, res) => {
  const { student_id, violation_id, report_id } = req.body;

  // Validate the input
  if (!student_id || !violation_id || !report_id) {
    return res.status(400).send({ error: 'Student ID, Violation ID, and Report ID are required' });
  }

  // Check if the report exists
  const checkReportQuery = 'SELECT 1 FROM tbl_filed_reports WHERE report_id = ?';
  db.query(checkReportQuery, [report_id], (err, results) => {
    if (err) {
      console.error('Error checking report:', err);
      return res.status(500).send({ error: 'Error checking report' });
    }

    if (results.length === 0) {
      return res.status(400).send({ error: 'Report not found' });
    }

    // Update the report
    const updateQuery = 'UPDATE tbl_filed_reports SET student_id = ?, violation_id = ? WHERE report_id = ?';
    db.query(updateQuery, [student_id, violation_id, report_id], (err, result) => {
      if (err) {
        console.error('Error updating report:', err);
        return res.status(500).send({ error: 'Error updating report' });
      }

      res.send({ message: 'Report updated successfully' });
    });
  });
};



// Delete a report
const deleteReport = (req, res) => {
  const { report_id } = req.params;  // Use req.params.report_id to retrieve the ID

  if (!report_id) {
    return res.status(400).send({ error: 'Report ID is required' });
  }

  const reportQuery = 'SELECT 1 FROM tbl_filed_reports WHERE report_id = ?';
  db.query(reportQuery, [report_id], (err, reportResults) => {
    if (err) {
      console.error('Error checking report:', err);
      return res.status(500).send({ error: 'Error checking report' });
    }

    if (reportResults.length === 0) {
      return res.status(400).send({ error: 'Invalid report ID' });
    }

    const deleteQuery = 'DELETE FROM tbl_filed_reports WHERE report_id = ?';
    db.query(deleteQuery, [report_id], (err, results) => {
      if (err) {
        console.error('Error deleting report:', err);
        return res.status(500).send({ error: 'Error deleting report' });
      }

      res.send({ message: 'Report deleted successfully' });
    });
  });
};



module.exports = { getStudents, getViolations, fileReport, getReportsWithDetails,  updateReport, deleteReport };
