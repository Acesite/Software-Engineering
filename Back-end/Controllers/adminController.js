// controllers/adminController.js
const db = require('../db'); // Ensure the path is correct

// Existing controller for dashboard data
exports.getAdminDashboardData = (req, res) => {
  try {
    db.query('SELECT COUNT(*) AS total FROM tbl_assign_task', (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching total tasks' });
      }
      const totalTasks = result[0].total || 0;

      db.query('SELECT COUNT(*) AS pending FROM tbl_assign_task WHERE status = "Pending"', (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error fetching pending tasks' });
        }
        const pendingTasks = result[0].pending || 0;

        db.query('SELECT COUNT(*) AS completed FROM tbl_assign_task WHERE status = "Completed"', (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching completed tasks' });
          }
          const completedTasks = result[0].completed || 0;

          db.query('SELECT SUM(renderedHours) AS totalHours FROM tbl_assign_task', (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Error fetching total logged hours' });
            }
            const totalLoggedHours = result[0].totalHours || 0;

            res.status(200).json({
              totalTasks,
              pendingTasks,
              completedTasks,
              totalLoggedHours
            });
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

exports.getStudentsNearCompletion = (req, res) => {
  try {
    const query = `
      SELECT 
        ats.student_id, 
        tsp.firstname AS first_name, 
        tsp.lastname AS last_name, 
        ats.dutyHours, 
        ats.renderedHours, 
        (ats.renderedHours / ats.dutyHours) * 100 AS completionPercentage
      FROM 
        tbl_assign_task ats
      JOIN 
        tbl_student_profiles tsp ON ats.student_id = tsp.id
      WHERE 
        ats.dutyHours IS NOT NULL AND ats.renderedHours IS NOT NULL
      HAVING 
        completionPercentage >= 75
      ORDER BY 
        completionPercentage DESC 
      LIMIT 0, 25;
    `;

    console.log("Running query:", query);  // Debugging line

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error in querying the database:', err);  // Log the error
        return res.status(500).json({ message: 'Error fetching students near completion', error: err.message });
      }

      console.log("Query results:", results);  // Log results

      const studentsNearCompletion = results.map(student => ({
        studentName: `${student.first_name} ${student.last_name}`,
        hoursCompleted: student.renderedHours,
        totalHours: student.dutyHours,
        completionPercentage: Math.round(student.completionPercentage),
      }));

      res.status(200).json(studentsNearCompletion);
    });
  } catch (error) {
    console.error("Unexpected error:", error);  // Log any unexpected errors
    res.status(500).json({ message: 'Error fetching students near completion', error: error.message });
  }
};




