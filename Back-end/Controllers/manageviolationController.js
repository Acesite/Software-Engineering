const db = require('../db'); // Ensure this is the correct path to your database connection

// Get all violations
const getViolations = (req, res) => {
    const sql = 'SELECT id, violation, dutyhours FROM tbl_violation';
    db.query(sql, (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
  
      
      res.json(results);
    });
  };
  

// Add a new violation
const addViolation = (req, res) => {
   
    const { violation, dutyhours } = req.body;
  
    // Ensure both fields are present
    if (!violation || !dutyhours) {
      return res.status(400).json({
        error: 'Violation and duty hours are required',
      });
    }
  
    // Convert dutyhours to a number and check if it's a valid number
    const dutyHoursNumber = Number(dutyhours);
    if (isNaN(dutyHoursNumber)) {
      return res.status(400).json({
        error: 'Duty hours should be a valid number',
      });
    }
  
    const sql = 'INSERT INTO tbl_violation (violation, dutyhours) VALUES (?, ?)';
    
    db.query(sql, [violation, dutyHoursNumber], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ violationId: results.insertId, message: 'Violation added successfully' });
    });
  };
  
// Delete a violation by ID
const deleteViolation = (req, res) => {
  const { id } = req.params;

  // Ensure the ID is a valid number
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid violation ID' });
  }

  const sql = 'DELETE FROM tbl_violation WHERE id = ?';
  
  db.query(sql, [id], (error) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Violation deleted successfully' });
  });
};

// Update a violation by ID
const updateViolation = (req, res) => {
    const { id } = req.params;
    const { violation, dutyhours } = req.body;
  
    // Ensure data is valid
    if (!violation || !dutyhours || isNaN(dutyhours)) {
      return res.status(400).json({
        error: 'Violation and duty hours are required, and duty hours should be a valid number',
      });
    }
  
    const sql = 'UPDATE tbl_violation SET violation = ?, dutyhours = ? WHERE id = ?';
  
    db.query(sql, [violation, dutyhours, id], (error) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json({ message: 'Violation updated successfully' });
    });
  };
  

module.exports = {
  getViolations,
  addViolation,
  deleteViolation,
  updateViolation,
};
