// server/controllers/communityserviceController.js

const db = require('../db'); // Assuming you create a db.js file for database connection

// Get all community service tasks
exports.getCommunityServiceTasks = (req, res) => {
  const sql = 'SELECT * FROM tbl_community_service';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
};

// Add a new community service task
exports.addCommunityServiceTask = (req, res) => {
  const { taskname, slots } = req.body; // Required fields

  // SQL to insert a new community service task
  const sql = 'INSERT INTO tbl_community_service (taskname, slots) VALUES (?, ?)';
  db.query(sql, [taskname, slots], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Community service task added successfully', taskId: result.insertId });
  });
};

// Delete a community service task
exports.deleteCommunityServiceTask = (req, res) => {
  const { id } = req.params; // Extracting id from the request parameters

  // SQL to delete a community service task by ID
  const sql = 'DELETE FROM tbl_community_service WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Community service task deleted successfully' });
  });
};

// Update a community service task
exports.updateCommunityServiceTask = (req, res) => {
  const { id } = req.params;
  const { taskname, slots } = req.body;

  const sql = 'UPDATE tbl_community_service SET taskname = ?, slots = ? WHERE id = ?';
  db.query(sql, [taskname, slots, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Community service task updated successfully' });
  });
};
