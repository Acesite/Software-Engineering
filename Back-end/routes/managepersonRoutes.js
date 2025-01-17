const express = require('express');
const { 
  getPersonsInCharge, 
  addPersonInCharge, 
  deletePersonInCharge, 
  updatePersonInCharge // Add this
} = require('../Controllers/managepersonController');
const router = express.Router();

router.get('/person-in-charge', getPersonsInCharge);
router.post('/add-person-in-charge', addPersonInCharge);
router.delete('/:id', deletePersonInCharge);
router.put('/person-in-charge/:id', updatePersonInCharge); // Add this

module.exports = router;
