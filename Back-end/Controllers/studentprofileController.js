// server/controllers/studentprofileController.js
const db = require('../db'); // Assuming you create a db.js file for database connection
const bcrypt = require('bcrypt'); // Import bcrypt

// Get all student profiles
exports.getStudents = (req, res) => {
  const sql = 'SELECT * FROM tbl_student_profiles';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
};

// Add a new student profile
exports.addStudent = (req, res) => {
  const { firstname, lastname, username, track, strand, password, confirm_password } = req.body;

  // Check if the passwords match
  if (password !== confirm_password) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Hash the password before saving it to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    const defaultProfilePicture = 'default_profile_picture.png'; // Specify your default profile picture

    // Update SQL to store the hashed password
    const sql = 'INSERT INTO tbl_student_profiles (firstname, lastname, username, track, strand, password, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [firstname, lastname, username, track, strand, hashedPassword, defaultProfilePicture], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Student added successfully', studentId: result.insertId });
    });
  });
};

// Update an existing student profile
// server/controllers/studentprofileController.js
exports.updateStudent = (req, res) => {
  const { id } = req.params; // Get student ID from URL
  const { firstname, lastname, username, track, strand, password, confirm_password } = req.body;

  // Check if the passwords match
  if (password !== confirm_password) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Prepare SQL query and params
  let sql = 'UPDATE tbl_student_profiles SET firstname = ?, lastname = ?, username = ?, track = ?, strand = ?';
  const params = [firstname, lastname, username, track, strand];

  // Hash the new password if provided
  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password' });
      }
      // Add the hashed password to the SQL update query and params
      sql += ', password = ?';
      params.push(hashedPassword); // Add hashed password to params

      // Finalize the SQL query
      sql += ' WHERE id = ?';
      params.push(id); // Add student ID to the params

      // Execute the SQL query
      db.query(sql, params, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        res.json({ message: 'Student updated successfully' });
      });
    });
  } else {
    // No password change, just update the other fields
    sql += ' WHERE id = ?';
    params.push(id);

    db.query(sql, params, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Student updated successfully' });
    });
  }
};

exports.deleteStudent = (req, res) => {
  const { id } = req.params; // Get student ID from URL

  const sql = 'DELETE FROM tbl_student_profiles WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting student' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  });
};
