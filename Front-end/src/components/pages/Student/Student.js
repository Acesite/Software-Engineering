import React, { useEffect, useState } from 'react';
import SidebarNavigation from './Sidebar/StudentSidebar';
import Clock from '../../Clock/Clock';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';


function Student() {
  const [notification, setNotification] = useState('Loading notifications...');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:3001/auth/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setNotification(response.data.message || 'You have tasks nearing deadlines. Complete them as soon as possible!');
          const studentId = response.data.studentId || userId;
          fetchAssignedTasks(studentId, token);
        })
        .catch((error) => {
          console.error('Dashboard error:', error);
          localStorage.clear();
          navigate('/login');
        });
    }
  }, [navigate]);

  const fetchAssignedTasks = (studentId, token) => {
    axios
      .get(`http://localhost:3001/api/student/assigned-tasks/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTasks(res.data.tasks || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching assigned tasks:', err);
        setError('Failed to fetch assigned tasks.');
        setIsLoading(false);
      });
  };

  // Function to determine text color for the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600'; // Yellow text for Pending
      case 'Completed':
        return 'text-green-600'; // Green text for Completed
      default:
        return 'text-gray-600'; // Default color for other statuses
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen">
        <SidebarNavigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Header Section */}
        <div className="sticky top-0 flex items-center justify-between p-6 bg-[#f3f3f3] shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome to your Dashboard</h1>
          <Clock />
        </div>

        {/* Notifications */}
        <div className="mx-6 mb-6">
          <motion.div
            className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-md"
            initial={{ opacity: 0 }} // Initial state: fully transparent
            animate={{ opacity: 1 }} // Animate to fully visible
            exit={{ opacity: 0 }} // Exit state: fully transparent
            transition={{ duration: 1 }} // Duration of the animation
          >
            <p>{notification}</p>
          </motion.div>
        </div>

        {/* Assigned Tasks Section */}
        <div className="mx-6">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {isLoading ? (
            <div className="text-center py-4 text-gray-600">Loading tasks...</div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
              <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
                <table className="min-w-full table-auto bg-white rounded-lg">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 border-b text-center">Task Name</th>
                      <th className="px-4 py-2 border-b text-center">Violation</th>
                      <th className="px-4 py-2 border-b text-center">Duty Hours</th>
                      <th className="px-4 py-2 border-b text-center">Rendered Hours</th>
                      <th className="px-4 py-2 border-b text-center">Status</th>
                      <th className="px-4 py-2 border-b text-center">Date</th>
                      <th className="px-4 py-2 border-b text-center">Person In Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length > 0 ? (
                      tasks.map((task, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b text-center">{task.taskName}</td>
                          <td className="px-4 py-2 border-b text-center">{task.violation}</td>
                          <td className="px-4 py-2 border-b text-center">{task.dutyHours}</td>
                          <td className="px-4 py-2 border-b text-center">{task.renderedHours}</td>
                          <td className="px-4 py-2 border-b text-center">
                            <span className={getStatusColor(task.status)}>{task.status}</span>
                          </td>
                          <td className="px-4 py-2 border-b text-center">{task.date}</td>
                          <td className="px-4 py-2 border-b text-center">{task.personInChargeName}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                          No assigned tasks found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Student;
