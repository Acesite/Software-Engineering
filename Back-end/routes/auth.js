const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import JWT package
const db = require('../db');
const router = express.Router();

// Login route to authenticate user
router.post('/login', async (req, res) => {
  const { username, password, userType } = req.body; // userType will determine which table to check

  // Determine the table based on userType
  let table = '';
  if (userType === 'admin') {
    table = 'tbl_admins';
  } else if (userType === 'person_in_charge') {
    table = 'tbl_person_in_charge';
  } else if (userType === 'super_admin') {
    table = 'tbl_super_admin';
  } else if (userType === 'student') {
    table = 'tbl_student_profiles';
  } else {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  // Query the database to find the user by username
  const query = `SELECT * FROM ${table} WHERE username = ?`;
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Compare provided password with the hashed password from the database
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Generate JWT token with user data (userId and username) in payload
      const token = jwt.sign(
        { userId: user.id, username: user.username, userType }, // Include userId in the payload
        'your_jwt_secret', // Secret key for signing the token
        { expiresIn: '1h' } // Token expiration time
      );

      // Respond with the token and user's first name, last name, userId, and profile picture
      return res.status(200).json({
        message: 'Login successful',
        token, // Send token to frontend
        firstName: user.firstName || user.firstname, // For student use firstname, else use firstName
        lastName: user.lastName || user.lastname,   // For student use lastname, else use lastName
        userId: user.id, // Send the userId as part of the response
        profilePicture: user.profile_picture || '/default-avatar.jpg', // Include the profile picture, fallback to default
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});


// Middleware to protect routes that require JWT token verification
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Verify the JWT token
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    // Store user data from the token for later use
    req.userId = decoded.userId;
    req.username = decoded.username;
    req.userType = decoded.userType;
    next(); // Allow the request to continue to the next middleware or route handler
  });
};

// Example of a protected route for admin
router.get('/admin/dashboard', verifyToken, (req, res) => {
  const { userId, userType } = req;
  if (userType !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  // Fetch additional user data if needed (e.g., from the database)
  const query = 'SELECT * FROM tbl_admins WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.status(200).json({
      message: `Welcome ${user.firstName} ${user.lastName} to the Admin Dashboard`,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  });
});

// Example of a protected route for person in charge
router.get('/personincharge/dashboard', verifyToken, (req, res) => {
  const { userId, userType } = req;
  if (userType !== 'person_in_charge') {
    return res.status(403).json({ message: 'Forbidden: Person in charge access required' });
  }

  const query = 'SELECT * FROM tbl_person_in_charge WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.status(200).json({
      message: `Welcome ${user.firstName} ${user.lastName} to the Person In Charge Dashboard`,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  });
});

// Example of a protected route for super admin
router.get('/superadmin/dashboard', verifyToken, (req, res) => {
  const { userId, userType } = req;
  if (userType !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden: Super Admin access required' });
  }

  const query = 'SELECT * FROM tbl_super_admin WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.status(200).json({
      message: `Welcome ${user.firstName} ${user.lastName} to the Super Admin Dashboard`,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  });
});

router.get('/student/dashboard', verifyToken, (req, res) => {
  const { userId, userType } = req;
  if (userType !== 'student') {
    return res.status(403).json({ message: 'Forbidden: Student access required' });
  }

  const query = 'SELECT * FROM tbl_student_profiles WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.status(200).json({
      message: `Welcome ${user.firstname} ${user.lastname} to the Student Dashboard`,
      user: {
        username: user.username,
        firstName: user.firstname,
        lastName: user.lastname,
        profilePicture: user.profile_picture || '/lcc.jpg',

      },
    });
  });
});

// Example of a new route for admin dashboard data
router.get('/admin/dashboard-data', verifyToken, (req, res) => {
  const { userType } = req;
  if (userType !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  // Fetch dashboard data (total tasks, pending tasks, etc.)
  const query1 = 'SELECT COUNT(*) AS total FROM tbl_assign_task';
  const query2 = 'SELECT COUNT(*) AS pending FROM tbl_assign_task WHERE status = "Pending"';
  const query3 = 'SELECT COUNT(*) AS completed FROM tbl_assign_task WHERE status = "Completed"';
  const query4 = 'SELECT SUM(renderedHours) AS totalHours FROM tbl_assign_task';

  db.query(query1, (err, totalResult) => {
    if (err) return res.status(500).json({ message: 'Error fetching total tasks' });

    db.query(query2, (err, pendingResult) => {
      if (err) return res.status(500).json({ message: 'Error fetching pending tasks' });

      db.query(query3, (err, completedResult) => {
        if (err) return res.status(500).json({ message: 'Error fetching completed tasks' });

        db.query(query4, (err, totalLoggedResult) => {
          if (err) return res.status(500).json({ message: 'Error fetching total logged hours' });

          res.status(200).json({
            totalTasks: totalResult[0].total || 0,
            pendingTasks: pendingResult[0].pending || 0,
            completedTasks: completedResult[0].completed || 0,
            totalLoggedHours: totalLoggedResult[0].totalHours || 0,
          });
        });
      });
    });
  });
});

// Example of a new route for admin dashboard data
router.get('/person/dashboard-data', verifyToken, (req, res) => {
  const { userType } = req;
  if (userType !== 'person_in_charge') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  // Fetch dashboard data (total tasks, pending tasks, etc.)
  const query1 = 'SELECT COUNT(*) AS total FROM tbl_assign_task';
  const query2 = 'SELECT COUNT(*) AS pending FROM tbl_assign_task WHERE status = "Pending"';
  const query3 = 'SELECT COUNT(*) AS completed FROM tbl_assign_task WHERE status = "Completed"';
  const query4 = 'SELECT SUM(renderedHours) AS totalHours FROM tbl_assign_task';

  db.query(query1, (err, totalResult) => {
    if (err) return res.status(500).json({ message: 'Error fetching total tasks' });

    db.query(query2, (err, pendingResult) => {
      if (err) return res.status(500).json({ message: 'Error fetching pending tasks' });

      db.query(query3, (err, completedResult) => {
        if (err) return res.status(500).json({ message: 'Error fetching completed tasks' });

        db.query(query4, (err, totalLoggedResult) => {
          if (err) return res.status(500).json({ message: 'Error fetching total logged hours' });

          res.status(200).json({
            totalTasks: totalResult[0].total || 0,
            pendingTasks: pendingResult[0].pending || 0,
            completedTasks: completedResult[0].completed || 0,
            totalLoggedHours: totalLoggedResult[0].totalHours || 0,
          });
        });
      });
    });
  });
});


// Example of a new route for admin dashboard data
router.get('/super/dashboard-data', verifyToken, (req, res) => {
  const { userType } = req;
  if (userType !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  // Fetch dashboard data (total tasks, pending tasks, etc.)
  const query1 = 'SELECT COUNT(*) AS total FROM tbl_assign_task';
  const query2 = 'SELECT COUNT(*) AS pending FROM tbl_assign_task WHERE status = "Pending"';
  const query3 = 'SELECT COUNT(*) AS completed FROM tbl_assign_task WHERE status = "Completed"';
  const query4 = 'SELECT SUM(renderedHours) AS totalHours FROM tbl_assign_task';

  db.query(query1, (err, totalResult) => {
    if (err) return res.status(500).json({ message: 'Error fetching total tasks' });

    db.query(query2, (err, pendingResult) => {
      if (err) return res.status(500).json({ message: 'Error fetching pending tasks' });

      db.query(query3, (err, completedResult) => {
        if (err) return res.status(500).json({ message: 'Error fetching completed tasks' });

        db.query(query4, (err, totalLoggedResult) => {
          if (err) return res.status(500).json({ message: 'Error fetching total logged hours' });

          res.status(200).json({
            totalTasks: totalResult[0].total || 0,
            pendingTasks: pendingResult[0].pending || 0,
            completedTasks: completedResult[0].completed || 0,
            totalLoggedHours: totalLoggedResult[0].totalHours || 0,
          });
        });
      });
    });
  });
});

router.get('/students-near-completion', verifyToken, (req, res) => {
  const { userType } = req;
  
  // Check if the user is an admin
  if (userType !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  // SQL query to get students near completion
  const query = `
    SELECT 
      ats.student_id, 
      tsp.first_name, 
      tsp.last_name, 
      ats.dutyHours, 
      ats.renderedHours, 
      (ats.renderedHours / ats.dutyHours) * 100 AS completionPercentage
    FROM 
      tbl_assign_task ats
    JOIN 
      tbl_student_profiles tsp ON ats.student_id = tsp.id  -- Correct table name
    WHERE 
      ats.dutyHours IS NOT NULL AND ats.renderedHours IS NOT NULL
    HAVING 
      completionPercentage >= 75  -- Filter for students with completion >= 75%
    ORDER BY 
      completionPercentage DESC;  -- Order by completion percentage
  `;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Map results into a cleaner structure for the response
    const studentsNearCompletion = results.map(student => ({
      studentName: `${student.first_name} ${student.last_name}`,
      hoursCompleted: student.renderedHours,
      totalHours: student.dutyHours,
      completionPercentage: Math.round(student.completionPercentage),
    }));

    // Send the response
    res.status(200).json(studentsNearCompletion);
  });
});

module.exports = router;

