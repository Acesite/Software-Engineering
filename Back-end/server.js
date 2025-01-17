const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module
require('dotenv').config();

// Routes
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/auth');
const communityServiceRoutes = require('./routes/communityserviceRoutes');
const assigntaskRoutes = require('./routes/assigntaskRoutes');
const manageadminRoutes = require('./routes/manageadminRoutes'); // Add manage admin routes
const reportsRoutes = require('./routes/reportsRoutes');
const personInChargeRoutes = require('./routes/managepersonRoutes'); // Import person in charge routes
const violationRoutes = require('./routes/manageviolationRoutes');
const studentAccountRoutes = require('./routes/studentaccountRoutes'); 
const manageStudentProfileRoutes = require('./routes/managestudentprofileRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 
const fileReportRoutes = require('./routes/filereportRoutes');

const db = require('./db'); // Database connection

const app = express();
const port = 3001; 
const sessionSecret = 'your-secret-key'; // Hardcode your session secret key

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: sessionSecret, // Use the hardcoded session secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Use routes with unique prefixes
app.use('/students', studentRoutes); 
app.use('/auth', authRoutes);
app.use('/communityservice', communityServiceRoutes);
app.use('/assigntask', assigntaskRoutes); 
app.use('/superadmin', manageadminRoutes); 
app.use('/reports', reportsRoutes);
app.use('/personincharge', personInChargeRoutes);
app.use('/violations', violationRoutes); 
app.use('/api', studentAccountRoutes);
app.use('/api/student', manageStudentProfileRoutes);
app.use('/admin', adminRoutes);
app.use('/filereport', fileReportRoutes);

// Serve static files from Front-end/public
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
