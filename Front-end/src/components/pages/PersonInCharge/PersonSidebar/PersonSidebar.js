import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import LogoutIcon from '@mui/icons-material/Logout';

const PersonSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the person's first and last name from localStorage
  const firstName = localStorage.getItem('firstName') || 'Person';
  const lastName = localStorage.getItem('lastName') || 'In Charge';

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  // Logout handler to destroy session
  const handleLogout = () => {
    // Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('userType');
    
    // Optionally check if token is still there (for debugging)
    if (!localStorage.getItem('token')) {
      console.log('Session successfully cleared');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="fixed bg-white w-64 min-h-screen border-r border-gray-200 p-4 flex flex-col">
        {/* Logo */}
        <div className="flex items-center mb-8 mr-10">
          <img
            src="/shslogo.jpg" // Replace with the correct path to your logo
            alt="Logo"
            className="h-16 w-auto" // Adjust the size as needed
          />
          <span className="ml-4 text-xl font-semibold text-gray-800">Senior Highschool</span>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 flex-grow">
          <Link
            to="/personincharge"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/personincharge') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <MdOutlineDashboardCustomize className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/personincharge/manage-student"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/personincharge/manage-student') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <GoTasklist className="h-6 w-6" />
            <span>Task</span>
          </Link>
        </nav>

        {/* User Info */}
        <div className="ml-2 mb-4">
          <div className="flex items-center">
            <img className="h-10 w-10 rounded-full" src="/lcc.jpg" alt="User avatar" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{`${firstName} ${lastName}`}</p>
            </div>
          </div>
        </div>

        {/* Logout Link */}
        <div className="mt-auto">
          <Link
            to="/login" // Link to the login page after logout
            onClick={handleLogout} // Trigger logout when clicked
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

export default PersonSidebar;
