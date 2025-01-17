import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import LogoutIcon from '@mui/icons-material/Logout';
import { IoPersonOutline } from "react-icons/io5";

const SidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState({ firstName: '', lastName: '', profilePicture: '' });

  useEffect(() => {
    // Retrieve the user's data from localStorage
    const firstName = localStorage.getItem('firstName') || 'First Name';
    const lastName = localStorage.getItem('lastName') || 'Last Name';
    const profilePictureHash = localStorage.getItem('profilePicture');
    const baseURL = 'http://localhost:3001/uploads/'; // Ensure this matches your backend server URL

    // Construct the full URL or fallback to a default image
    const profilePicture = profilePictureHash
      ? `${baseURL}${profilePictureHash}`
      : '/default-avatar.jpg';

    // Debug
    setStudentInfo({ firstName, lastName, profilePicture });
  }, []);

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  // Function to handle logout
  const handleLogout = () => {
    // Clear session storage or localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('userType');
    localStorage.removeItem('profilePicture');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <div className="fixed bg-white w-64 min-h-screen border-r border-gray-200 p-4 flex flex-col">
        {/* Logo */}
        <div className="flex items-center mb-8 mr-10">
          <img
            src="/shslogo.jpg"
            alt="Logo"
            className="h-16 w-auto"
          />
          <span className="ml-4 text-xl font-semibold text-gray-800">Senior Highschool</span>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 flex-grow">
          <Link
            to="/Student"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/Student') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <MdOutlineDashboardCustomize className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/Profile"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/Profile') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <IoPersonOutline className="h-6 w-6" />
            <span>Profile</span>
          </Link>
        </nav>

        {/* User Info */}
        <div className="ml-2 mb-4">
          <div className="flex items-center">
            <img
              className="h-10 w-10 rounded-full"
              src={studentInfo.profilePicture}
              alt="User avatar"
              onError={(e) => (e.target.src = '/default-avatar.jpg')} // Fallback for invalid image
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {studentInfo.firstName} {studentInfo.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Options (Log out) */}
        <div className="mt-auto">
          <Link
            to="/login"
            onClick={handleLogout}
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/login') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <LogoutIcon className="h-6 w-6" />
            <span>Log out</span>
          </Link>
        </div>
      </div>
    </div>  
  );
};

export default SidebarNavigation;
