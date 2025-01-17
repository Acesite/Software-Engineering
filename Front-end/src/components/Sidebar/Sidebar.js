import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection after logout
import 'font-awesome/css/font-awesome.min.css';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { TbReportSearch } from "react-icons/tb";
import { GoTasklist } from "react-icons/go";
import { PiStudentLight } from "react-icons/pi";
import LogoutIcon from '@mui/icons-material/Logout';
import { MdOutlinePersonOutline } from "react-icons/md";
import { BsExclamationTriangle } from "react-icons/bs";
import { TbFileReport } from "react-icons/tb";

const SidebarNavigation = () => {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  // Logout handler function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    navigate('/login');
  };

  // Get the admin's first and last name from localStorage (defaults to 'Admin' if not found)
  const adminFirstName = localStorage.getItem('firstName') || 'Admin';
  const adminLastName = localStorage.getItem('lastName') || '';

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
          {/* Logo Name */}
          <span className="ml-4 text-xl font-semibold text-gray-800">Senior Highschool</span>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 flex-grow">
          <Link
            to="/admin"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/admin') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <MdOutlineDashboardCustomize className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>

          {/* <Link
            to="/manage-person-in-charge"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              location.pathname === '/super-admin/manage-admin' ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <MdOutlinePersonOutline className="h-6 w-6" />
            <span>Person In Charge</span>
          </Link> */}
{/* 
          <Link
            to="/Student-profile"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/Student-profile') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <PiStudentLight className="h-6 w-6" />
            <span>Student</span>
          </Link> */}
{/* 
          <Link
            to="/CommunityService"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/CommunityService') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <HiOutlineUserGroup className="h-6 w-6" />
            <span>Community Service</span>
          </Link> */}

          <Link
            to="/file-report"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/file-report') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <TbFileReport className="h-6 w-6" />
            <span>File Report</span>
          </Link>

          <Link
            to="/Manage-student"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/Manage-student') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <GoTasklist className="h-6 w-6" />
            <span>Sanctions</span>
          </Link>

          <Link
            to="/view-reports"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/view-reports') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <TbReportSearch className="h-6 w-6" />
            <span>Reports</span>
          </Link>
        </nav>

        {/* User Info */}
        <div className="ml-2 mb-4">
          <div className="flex items-center">
            <img className="h-10 w-10 rounded-full" src="/lcc.jpg" alt="User avatar" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{`${adminFirstName} ${adminLastName}`}</p> {/* Display full admin name */}
            </div>
          </div>
        </div>

        {/* Options (Log out) */}
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

export default SidebarNavigation;
