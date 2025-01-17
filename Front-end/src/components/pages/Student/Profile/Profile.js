import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../Sidebar/StudentSidebar';
import Clock from '../Clock/Clock';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    track: '',
    strand: '',
    currentPassword: '', // Field for current password
    newPassword: '', // Field for new password
    confirmPassword: '', // Field for confirming the new password
  });
  const [profilePicture, setProfilePicture] = useState(null); // For profile picture file
  const [profilePicturePreview, setProfilePicturePreview] = useState(''); // For previewing the uploaded picture

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
  
    if (token && userId) {
      axios
        .get(`http://localhost:3001/api/student/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setProfile({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            username: response.data.username || '',
            track: response.data.track || '',
            strand: response.data.strand || '',
            currentPassword: '', // Reset password fields
            newPassword: '',
            confirmPassword: '',
          });
          setProfilePicturePreview(response.data.profile_picture || ''); // Set profile picture preview URL
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
          alert('Error fetching profile data');
        });
    } else {
      alert('User not logged in. Please login first.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file)); // Update preview with the file selected
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (profile.newPassword !== profile.confirmPassword) {
      alert("New password and confirm password don't match.");
      return;
    }

    const formData = new FormData();
    formData.append('firstName', profile.firstName);
    formData.append('lastName', profile.lastName);
    formData.append('username', profile.username);
    formData.append('track', profile.track);
    formData.append('strand', profile.strand);
    formData.append('currentPassword', profile.currentPassword);
    if (profile.newPassword) formData.append('password', profile.newPassword);
    if (profilePicture) formData.append('profilePicture', profilePicture);
  
    console.log([...formData.entries()]); // Log form data to debug
  
    axios.put(`http://localhost:3001/api/student/profile/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating profile:', error.response?.data || error.message);
        alert('Failed to update profile');
      });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-64 bg-gray-800 text-white min-h-screen hidden md:block">
        <SidebarNavigation />
      </div>

      <div className="flex-1 bg-gray-100 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black-500">Manage Profile</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">Update your profile information.</p>
          </div>
          <Clock />
        </div>

        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
          <div className="flex flex-col gap-4">
            {profilePicturePreview && (
              <img
                src={profilePicturePreview || 'path/to/default-image.jpg'} // Fallback to default image if no preview
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full mx-auto"
                onError={(e) => { e.target.src = 'path/to/default-image.jpg'; }} // Handle error gracefully
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="track"
              value={profile.track}
              onChange={handleChange}
              placeholder="Track"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="strand"
              value={profile.strand}
              onChange={handleChange}
              placeholder="Strand"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="password"
              name="currentPassword"
              value={profile.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              className="border rounded-lg p-2"
            />
            <input
              type="password"
              name="newPassword"
              value={profile.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="border rounded-lg p-2"
            />
            <input
              type="password"
              name="confirmPassword"
              value={profile.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className="border rounded-lg p-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
