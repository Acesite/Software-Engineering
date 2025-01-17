const db = require('../db'); // Ensure this is the correct path to your database connection

// Get all persons in charge
const getPersonsInCharge = (req, res) => {
  const sql = 'SELECT id, firstName, lastName, username, contactNumber FROM tbl_person_in_charge';
  db.query(sql, (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json(results); // Return the results of the query as JSON
  });
};

// Add a new person in charge
const addPersonInCharge = (req, res) => {
  const { firstName, lastName, username, password, contactNumber } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !username || !password || !contactNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO tbl_person_in_charge (firstName, lastName, username, password, contactNumber) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [firstName, lastName, username, password, contactNumber], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ personId: results.insertId, message: 'Person in charge added successfully' }); // Return the person ID and success message
  });
};

// Delete a person in charge by ID
const deletePersonInCharge = (req, res) => {
  const { id } = req.params;

  // Ensure the ID is a valid number
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid person in charge ID' });
  }

  const sql = 'DELETE FROM tbl_person_in_charge WHERE id = ?';
  
  db.query(sql, [id], (error) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Person in charge deleted successfully' });
  });
};


// Update a person in charge by ID
const updatePersonInCharge = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, username, contactNumber, password } = req.body;

  // Validate required fields
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid person in charge ID' });
  }
  if (!firstName || !lastName || !username || !contactNumber) {
    return res.status(400).json({ error: 'All fields except password are required' });
  }

  // Build the SQL query and values
  let sql = `UPDATE tbl_person_in_charge 
             SET firstName = ?, lastName = ?, username = ?, contactNumber = ?`;
  const values = [firstName, lastName, username, contactNumber];

  // Include the password in the query only if it is provided
  if (password) {
    sql += `, password = ?`;
    values.push(password);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  // Execute the query
  db.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error updating person in charge:', error);
      return res.status(500).json({ error: error.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Person in charge not found' });
    }
    res.json({ message: 'Person in charge updated successfully' });
  });
};


module.exports = {
  getPersonsInCharge,
  addPersonInCharge,
  deletePersonInCharge,
  updatePersonInCharge,
};
