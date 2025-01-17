const db = require('../db'); // Database connection

// SQL query for fetching tasks and reports
const fetchTasksQuery = `
 SELECT 
    t.id, 
    s.id AS student_id, 
    CONCAT(s.firstname, ' ', s.lastname) AS studentName, 
    s.track, 
    s.strand, 
    cs.taskname AS taskName, 
    t.violation, 
    t.dutyHours, 
    t.renderedHours,
    t.status,
    DATE_FORMAT(t.date, '%Y-%m-%d') AS date, 
    t.inTime, 
    t.outTime, 
    pic.id AS personInCharge,
    CONCAT(pic.firstName, ' ', pic.lastName) AS personInChargeName,
    t.task_id
  FROM tbl_assign_task t
  JOIN tbl_student_profiles s ON t.student_id = s.id
  JOIN tbl_person_in_charge pic ON t.personInCharge = pic.id
  JOIN tbl_community_service cs ON t.task_id = cs.id;
`;

// Function to get reports
const getReports = (req, res) => {
  db.query(fetchTasksQuery, (err, results) => {
    if (err) {
      console.error('Error fetching reports:', err.message);
      return res.status(500).json({ message: 'Error fetching reports data.' });
    }
    if (!results.length) {
      return res.status(404).json({ message: 'No data found for reports.' });
    }
    res.status(200).json(results);
  });
};

// Function to display tasks
const displayTask = (req, res) => {
  db.query(fetchTasksQuery, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err.message);
      return res.status(500).json({ message: 'Error fetching tasks data.' });
    }
    res.status(200).json(results);
  });
};

// Export functions using module.exports
module.exports = {
  getReports,
  displayTask,
};
