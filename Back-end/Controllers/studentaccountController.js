const db = require('../db'); // Import your database connection

const getAssignedTasks = (req, res) => {
  const { studentId } = req.params;

  console.log('Fetching tasks for student ID:', studentId);

  if (!studentId || isNaN(studentId)) {
    return res.status(400).json({ error: 'Invalid student ID provided.' });
  }

  const query = `
    SELECT 
      cs.taskname AS taskName, 
      t.violation, 
      t.dutyHours, 
      t.renderedHours,
      t.status,
      DATE_FORMAT(t.date, '%Y-%m-%d') AS date, 
      CONCAT(pic.firstName, ' ', pic.lastName) AS personInChargeName
    FROM tbl_assign_task t
    JOIN tbl_student_profiles s ON t.student_id = s.id
    JOIN tbl_person_in_charge pic ON t.personInCharge = pic.id
    JOIN tbl_community_service cs ON t.task_id = cs.id
    WHERE t.student_id = ?;
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

  

    if (results.length === 0) {
      return res.status(200).json({ tasks: [] }); // Return an empty array with 200 OK
    }
    
    res.status(200).json({ tasks: results });
  });
};

const getStudentDashboard = (req, res) => {
  const userId = req.user.userId; // Extract userId from verified token payload
  const userType = req.user.userType; // Extract userType from token payload

  if (userType !== 'student') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const query = `
    SELECT 
      id AS studentId, 
      firstName, 
      lastName 
    FROM tbl_student_profiles 
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const studentProfile = results[0];
    res.status(200).json({
      message: `Welcome ${studentProfile.firstName} ${studentProfile.lastName} to the Student Dashboard`,
      studentId: studentProfile.studentId,
      user: {
        firstName: studentProfile.firstName,
        lastName: studentProfile.lastName,
      },
    });
  });
};

module.exports = {
  getAssignedTasks,
  getStudentDashboard, // Add this to the exports
};
