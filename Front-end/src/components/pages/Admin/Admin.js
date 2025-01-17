import React, { useEffect, useState, useRef } from 'react';
import SidebarNavigation from '../../Sidebar/Sidebar';
import Clock from '../../Clock/Clock';
import Card from '../../Card/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Corrected imports
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

function Admin() {
  const [message, setMessage] = useState('Loading...');
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalLoggedHours: 0
  });
  const toastShown = useRef(false); // UseRef to track if toast has been shown
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');  // Get the token from localStorage

    if (!token) {
      // If no token is found, redirect to login
      navigate('/login');
    } else {
      // Make a request to the protected route to verify the token
      axios
        .get('http://localhost:3001/auth/admin/dashboard-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setDashboardData(response.data); // Set the fetched data to the state

          // Show toast only once using useRef  
          if (!toastShown.current) {
            toast.success('Successfully logged in as Faculty!');
            toastShown.current = true;  // Set ref to true after showing toast
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage('Invalid or expired token. Please log in again.');
          navigate('/login'); // Redirect to login if token is invalid or expired
        });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen">
        <SidebarNavigation />
      </div>

      {/* Main Content (scrollable) */}
      <div className="flex-1 bg-gray-100">
        {/* Header Section */}
        <div className="sticky top-0  flex items-center justify-between p-6 bg-[#f3f3f3] ">
          <h1 className="text-3xl font-bold text-black-500">Faculty Dashboard </h1>
          <Clock />
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6">
          <Card title="Total Tasks" value={dashboardData.totalTasks} />
          <Card title="Pending Tasks" value={dashboardData.pendingTasks} />
          <Card title="Completed Tasks" value={dashboardData.completedTasks} />
          <Card title="Total Logged Hours" value={`${dashboardData.totalLoggedHours} hrs`} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-md rounded-lg p-6 mx-6 mb-8 w-[50vh]">
          <h2 className="text-xl font-semibold mb-4 text-black-500">Quick Actions</h2>
          <div className="space-x-4">
            <Link to="/Manage-student">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Assign Task</button>
            </Link>
            <Link to="/Manage-student">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Log Hours</button>
            </Link>
            <Link to="/Manage-student">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg">Mark Complete</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Admin;
