import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TbReportSearch } from "react-icons/tb";
import LogoutIcon from '@mui/icons-material/Logout';
import { GoTasklist } from "react-icons/go";
import { PiStudentLight } from "react-icons/pi";
import { MdOutlineAdminPanelSettings, MdOutlinePersonOutline } from "react-icons/md";
import { TbFileReport } from "react-icons/tb";
import { CiWarning } from "react-icons/ci";

const SuperAdminSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve user info from localStorage
  const firstName = localStorage.getItem('firstName') || 'Super';
  const lastName = localStorage.getItem('lastName') || 'Admin';

  // Function to check active link
  const isActive = (path) => location.pathname === path;

  // Logout handler to destroy session
  const handleLogout = () => {
    // Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('userType');
    
    // Redirect to login page
    navigate('/login');
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
            to="/super-admin"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/super-admin') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <MdOutlineDashboardCustomize className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/super-admin/manage-admin"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/super-admin/manage-admin') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <MdOutlineAdminPanelSettings className="h-6 w-6" />
            <span>Admins</span>
          </Link>

          <Link
            to="/super-admin/manage-person-in-charge"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/super-admin/manage-person-in-charge') ? 'bg-blue-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <MdOutlinePersonOutline className="h-6 w-6" />
            <span>Person In Charge</span>
          </Link>

          <Link
            to="/super-admin/student-profile"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/super-admin/student-profile') ? 'bg-indigo-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <PiStudentLight className="h-6 w-6" />
            <span>Student</span>
          </Link>
          
          <Link
            to="/super-admin/communityservice"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/super-admin/communityservice') ? 'bg-indigo-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <HiOutlineUserGroup className="h-6 w-6" />
            <span>Community Service</span>
          </Link>

          <Link
            to="/super-admin/manage-student"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/super-admin/manage-student') ? 'bg-indigo-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <GoTasklist className="h-6 w-6" />
            <span>Task</span>
          </Link>

          <Link
            to="/super-admin/reports"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/super-admin/reports') ? 'bg-indigo-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <TbReportSearch className="h-6 w-6" />
            <span>Reports</span>
          </Link>

          <Link
            to="/super-admin/view-file-report"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/super-admin/view-file-report') ? 'bg-indigo-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <TbFileReport className="h-6 w-6" />
            <span>View Filed Reports</span>
          </Link>

          
          <Link
            to="/super-admin/manage-violations"
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              isActive('/super-admin/manage-violations') ? 'bg-indigo-100 text-blue-600' : 'text-gray-900 hover:bg-blue-100'
            }`}
          >
            <CiWarning className="h-6 w-6" />
            <span>Manage Violations</span>
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

        {/* Log out */}
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
  
export default SuperAdminSideBar;
