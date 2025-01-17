const db = require('../db'); // Make sure this is the correct path to your database connection

// Get all admins
const getAdmins = (req, res) => {
  const sql = 'SELECT id, firstName, lastName, username, contactNumber FROM tbl_admins';
  db.query(sql, (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json(results); // Return the results of the query as JSON
  });
};

// Add a new admin
const addAdmin = (req, res) => {
  const { firstName, lastName, username, password, contactNumber } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !username || !password || !contactNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO tbl_admins (firstName, lastName, username, password, contactNumber) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [firstName, lastName, username, password, contactNumber], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ adminId: results.insertId, message: 'Admin added successfully' });  // Return the admin ID and success message
  });
};

// Delete an admin by ID
const deleteAdmin = (req, res) => {
  const { id } = req.params;
  
  // Ensure the ID is a valid number
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid admin ID' });
  }

  const sql = 'DELETE FROM tbl_admins WHERE id = ?';
  
  db.query(sql, [id], (error) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Admin deleted successfully' });
  });
};

module.exports = {
  getAdmins,
  addAdmin,
  deleteAdmin,
};
