const db = require('../db'); // Ensure this is the correct path to your database connection
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Get student profile by user ID
const getStudentProfile = (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }

  const sql = `
    SELECT firstName, lastName, username, track, strand, password, profile_picture 
    FROM tbl_student_profiles 
    WHERE id = ?
  `;

  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const profile = results[0];
    profile.profile_picture = profile.profile_picture
      ? `${req.protocol}://${req.get('host')}/uploads/${profile.profile_picture}`
      : null; // Include the full URL for the profile picture

    res.json(profile);
  });
};

const updateStudentProfile = (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, username, track, strand, password, currentPassword } = req.body;

  // Get the uploaded profile picture's file name
  const profilePicture = req.file ? req.file.filename : null;

  // Validate required fields
  if (!firstName || !lastName || !username || !track || !strand) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Query to get the current password and profile picture from the database
  const getPasswordSql = 'SELECT password, profile_picture FROM tbl_student_profiles WHERE id = ?';
  db.query(getPasswordSql, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching current password:', error);
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const storedPassword = results[0].password;
    const oldProfilePicture = results[0].profile_picture;

    // Compare the provided current password with the stored password
    bcrypt.compare(currentPassword, storedPassword, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: err.message });
      }

      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect current password' });
      }

      const updateFields = [
        firstName,
        lastName,
        username,
        track,
        strand,
      ];

      let updateSql = `
        UPDATE tbl_student_profiles 
        SET firstname = ?, lastname = ?, username = ?, track = ?, strand = ?
      `;

      if (profilePicture) {
        updateSql += ', profile_picture = ?';
        updateFields.push(profilePicture);

        // Delete the old profile picture if a new one is uploaded
        if (oldProfilePicture) {
          const oldFilePath = path.join(__dirname, '../../public/uploads', oldProfilePicture); // Ensure correct path to old image
          fs.unlink(oldFilePath, (unlinkError) => {
            if (unlinkError) {
              console.error('Error deleting old profile picture:', unlinkError);
            }
          });
        }
      }

      // If a password is provided, hash and update it
      if (password) {
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error('Error hashing password:', hashErr);
            return res.status(500).json({ error: hashErr.message });
          }

          updateSql += ', password = ?';
          updateFields.push(hashedPassword);

          updateSql += ' WHERE id = ?';
          updateFields.push(userId);

          // Update the profile with new details
          db.query(updateSql, updateFields, (updateError, updateResults) => {
            if (updateError) {
              console.error('Error updating profile:', updateError);
              return res.status(500).json({ error: updateError.message });
            }

            res.status(200).json({ message: 'Profile updated successfully' });
          });
        });
      } else {
        // If no password change, just update the other details and profile picture
        updateSql += ' WHERE id = ?';
        updateFields.push(userId);

        db.query(updateSql, updateFields, (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating profile:', updateError);
            return res.status(500).json({ error: updateError.message });
          }

          res.status(200).json({ message: 'Profile updated successfully' });
        });
      }
    });
  });
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
};
