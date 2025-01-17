// server/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your XAMPP MySQL username
  password: '', // Your XAMPP MySQL password
  database: 'db_shs', // Your database name
});

// Check database connection
db.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db; // Export the db connection
