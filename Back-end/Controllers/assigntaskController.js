const db = require('../db'); 


// Get all community service tasks
const getAllTasks = (req, res) => {
  const sql = 'SELECT * FROM tbl_community_service'; 
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Error fetching tasks');
    }
    res.status(200).json(results); 
  });
};

// Add task 
const addTask = (req, res) => {
  const { student_id, track, strand, task_id, violation, dutyHours, date, inTime, outTime, personInCharge } = req.body;

  if (!student_id || !task_id || !dutyHours || !date || !inTime || !outTime || !personInCharge || !track || !strand) {
    return res.status(400).send('All fields are required');
  }

  // Check available slots for the task
  const checkSlotsSql = 'SELECT slots FROM tbl_community_service WHERE id = ?';
  db.query(checkSlotsSql, [task_id], (err, results) => {
    if (err) {
      console.error('Error checking available slots:', err);
      return res.status(500).send('Error checking available slots');
    }

    if (results.length === 0) {
      return res.status(404).send('Task not found in community service');
    }

    const availableSlots = results[0].slots;

    if (availableSlots <= 0) {
      return res.status(400).send('No available slots for this task');
    }

    // Assign the task and decrement slots
    const assignTaskSql = 'INSERT INTO tbl_assign_task (student_id, track, strand, task_id, violation, dutyHours, date, inTime, outTime, personInCharge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(assignTaskSql, [student_id, track, strand, task_id, violation, dutyHours, date, inTime, outTime, personInCharge], (err, result) => {
      if (err) {
        console.error('Error adding task:', err);
        return res.status(500).send('Error adding task');
      }

      const updateSlotsSql = 'UPDATE tbl_community_service SET slots = slots - 1 WHERE id = ?';
      db.query(updateSlotsSql, [task_id], (err, updateResult) => {
        if (err) {
          console.error('Error updating slots:', err);
          return res.status(500).send('Error updating slots');
        }

        res.status(201).send('Task assigned successfully, and slots decremented');
      });
    });
  });
};



// Delete a task
const deleteTask = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tbl_assign_task WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).send('Error deleting task');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Task not found');
    }
    res.send('Task deleted successfully');
  });
};


// Get student details by student ID
const getStudentDetails = (req, res) => {
  const studentId = req.params.studentId; 
  const sql = 'SELECT id, firstname, lastname, track, strand FROM tbl_student_profiles WHERE id = ?';

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching student details:', err);
      return res.status(500).send('Error fetching student details');
    }
    if (results.length === 0) {
      return res.status(404).send('Student not found');
    }
   
    res.status(200).json(results[0]); // Send back the student details
  });
};


// Get all community service tasks
const getAllCommunityServiceTasks = (req, res) => {
  const sql = 'SELECT * FROM tbl_community_service'; 
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching community service tasks:', err);
      return res.status(500).send('Error fetching community service tasks');
    }
    res.status(200).json(results);
  });
};

// Get all person in charge for displaying in the dropdown
const getAllPersonsInCharge = (req, res) => {
  const sql = 'SELECT id, firstName, lastName FROM tbl_person_in_charge'; 
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching persons in charge:', err);
      return res.status(500).send('Error fetching persons in charge');
    }
    res.status(200).json(results); 
  });
};


// populate task
const displayTask = (req, res) => {
  const sql = `
    SELECT 
      t.id, 
      s.id AS student_id, 
      CONCAT(s.firstname, ' ', s.lastname) AS studentName, -- Concatenate first and last name
      s.track, 
      s.strand, 
      cs.taskname AS taskName, 
      t.violation, 
      t.dutyHours, 
      t.renderedHours,  -- Include renderedHours
      t.status,  -- Include status
      DATE_FORMAT(t.date, '%Y-%m-%d') AS date, 
      t.inTime, 
      t.outTime, 
      pic.id AS personInCharge,  -- Get person in charge id
      CONCAT(pic.firstName, ' ', pic.lastName) AS personInChargeName, -- Concatenate first and last name of the person in charge
      t.task_id  -- Make sure task_id is included
    FROM tbl_assign_task t
    JOIN tbl_student_profiles s ON t.student_id = s.id
    JOIN tbl_person_in_charge pic ON t.personInCharge = pic.id  -- Join with tbl_person_in_charge
    JOIN tbl_community_service cs ON t.task_id = cs.id
    ORDER BY FIELD(t.status, 'Pending', 'Completed') ASC, t.date;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Error fetching tasks');
    }
    res.status(200).json(results);  // Return the results with the person in charge names
  });
};



// Get update task
const updateTask = (req, res) => {
  const { id } = req.params; 
  const {
    student_id,
    track,
    strand,
    task_id,
    violation,
    dutyHours,
    date,
    inTime,
    outTime,
    personInCharge,
  } = req.body;

  // Ensure all required fields are provided
  if (
    !student_id ||
    !track ||
    !strand ||
    !task_id ||
    !violation ||
    !dutyHours ||
    !date ||
    !inTime ||
    !outTime ||
    !personInCharge
  ) {
    return res.status(400).send("Missing required fields.");
  }

 

  // Fetch the current task details first
  const selectSql = "SELECT * FROM tbl_assign_task WHERE id = ?";
  db.query(selectSql, [id], (err, rows) => {
    if (err) {
      console.error("Error fetching task:", err.message);
      return res.status(500).send("Error fetching task.");
    }

    if (rows.length === 0) {
      return res.status(404).send("Task not found.");
    }

    const currentTask = rows[0];

    // Calculate new status based on updated dutyHours and current renderedHours
    const newStatus = dutyHours > 0 ? "Pending" : currentTask.status;

    // Update the task in the database
    const updateSql = `
      UPDATE tbl_assign_task
      SET 
        student_id = ?, 
        track = ?, 
        strand = ?, 
        task_id = ?, 
        violation = ?, 
        dutyHours = ?, 
        date = ?, 
        inTime = ?, 
        outTime = ?, 
        personInCharge = ?,
        status = ?
      WHERE id = ?;
    `;

    db.query(
      updateSql,
      [
        student_id,
        track,
        strand,
        task_id,
        violation,
        dutyHours,
        date,
        inTime,
        outTime,
        personInCharge,
        newStatus, // Update status field
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("SQL Error:", err.message);
          return res.status(500).send("Database update failed.");
        }

        if (result.affectedRows === 0) {
          return res.status(404).send("Task not found."); // Task not found
        }

        res.status(200).json({ message: "Task updated successfully." }); // Success response
      }
    );
  });
};

const getTaskById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM tbl_assign_task WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching task:', err);
      return res.status(500).send('Error fetching task');
    }
    if (result.length === 0) {
      return res.status(404).send('Task not found');
    }
    res.status(200).json(result[0]); // Return the first task (in case there are multiple with the same ID)
  });
};

const validateTask = (taskData) => {
  const requiredFields = ['student_id', 'task_id', 'dutyHours', 'date', 'inTime', 'outTime', 'personInCharge', 'track', 'strand'];
  return requiredFields.every(field => taskData[field] && taskData[field].toString().trim());
};


const logTaskHours = (req, res) => {
  const { id, renderedHours } = req.body;

  if (!id || renderedHours === undefined) {
    return res.status(400).send('Task ID and hours to log are required.');
  }

  // Fetch the current task details
  const selectSql = 'SELECT * FROM tbl_assign_task WHERE id = ?';
  db.query(selectSql, [id], (err, rows) => {
    if (err) {
      console.error('Error fetching task:', err);
      return res.status(500).send('Error fetching task.');
    }

    if (rows.length === 0) {
      return res.status(404).send('Task not found.');
    }

    const task = rows[0];

    // Calculate new rendered and duty hours
    const newRenderedHours = task.renderedHours + renderedHours;
    let remainingDutyHours = task.dutyHours - renderedHours; // Reduce by logged hours

    if (remainingDutyHours < 0) {
      remainingDutyHours = 0; // Prevent negative duty hours
    }

    // Determine the status based on remaining duty hours
    const newStatus = remainingDutyHours === 0 ? 'Completed' : 'Pending';

    // Update the task with the new values
    const updateSql = `
      UPDATE tbl_assign_task
      SET 
        renderedHours = ?, 
        dutyHours = ?, 
        status = ?
      WHERE id = ?;
    `;

    db.query(updateSql, [newRenderedHours, remainingDutyHours, newStatus, id], (err, result) => {
      if (err) {
        console.error('Error updating task:', err);
        return res.status(500).send('Error updating task.');
      }

      if (result.affectedRows === 0) {
        return res.status(404).send('Task not found.');
      }

      // Return the updated task details
      const selectUpdatedTaskSql = 'SELECT * FROM tbl_assign_task WHERE id = ?';
      db.query(selectUpdatedTaskSql, [id], (err, updatedTask) => {
        if (err) {
          console.error('Error fetching updated task:', err);
          return res.status(500).send('Error fetching updated task.');
        }

        res.status(200).json(updatedTask[0]); 
      });
    });
  });
};

// Get all violations
const getAllViolations = (req, res) => {
  const sql = 'SELECT * FROM tbl_violations'; // Change table name if different
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching violations:', err);
      return res.status(500).send('Error fetching violations');
    }
    res.status(200).json(results); // Return all violations
  });
};



module.exports = {
  displayTask,
  getAllTasks,
  addTask,
  deleteTask,
  getStudentDetails,
  getAllCommunityServiceTasks,
  getAllPersonsInCharge, 
  updateTask,
  getTaskById,
  validateTask,
  logTaskHours,
  getAllViolations,
};
