import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../../Sidebar/Sidebar';
import axios from 'axios';
import { CiSaveUp2,  } from "react-icons/ci";


function CommunityService() {
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [taskname, setTaskname] = useState('');
  const [slots, setSlots] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/communityservice');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Initial fetch of tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskname || !slots) {
      alert("Please fill in all fields");
      return;
    }
  
    try {
      if (editIndex !== null) {
        // Updating an existing task
        await axios.put(`http://localhost:3001/communityservice/${tasks[editIndex].id}`, { taskname, slots });
      } else {
        // Adding a new task
        const response = await axios.post('http://localhost:3001/communityservice', { taskname, slots });
        // Optionally handle the response here if needed
      }
      // Fetch the updated list of tasks after add/update
      fetchTasks();

      // Reset form fields
      setTaskname('');
      setSlots('');
      setEditIndex(null);
    } catch (error) {
      console.error('Error processing task:', error);
    }
  };

  const handleTaskDelete = async (index) => {
    const taskToDelete = tasks[index];
    if (window.confirm(`Are you sure you want to delete the task: ${taskToDelete.taskname}?`)) {
      try {
        await axios.delete(`http://localhost:3001/communityservice/${taskToDelete.id}`);
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks); // Remove task from state
      } catch (error) {
        console.error('Error deleting task:', error);
        alert("There was an error deleting the task.");
      }
    }
  };

  const handleTaskEdit = (index) => {
    setEditIndex(index);
    setTaskname(tasks[index].taskname);
    setSlots(tasks[index].slots);
  };

  const resetForm = () => {
    setTaskname('');
    setSlots('');
    setEditIndex(null);
  };

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white min-h-screen">
        <SidebarNavigation />
      </div>
      <div className="flex-1 bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between  ml-10 mt-5">
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-black-500">Manage Community Service Task</h1>
    <p className="text-sm md:text-base text-gray-500 mt-1">
      Manage Community Service Task.
    </p>
   
  </div>
</div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">

              <form onSubmit={handleTaskSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
  <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? 'Edit Task' : 'Add Community Service'}</h2>

  <div className="mb-4">
    <label htmlFor="taskname" className="block text-gray-700 font-bold mb-2">Community Service</label>
    <input
      type="text"
      id="taskname"
      value={taskname}
      onChange={(e) => setTaskname(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div className="mb-4">
    <label htmlFor="slots" className="block text-gray-700 font-bold mb-2">Slots Needed</label>
    <input
      type="number"
      id="slots"
      value={slots}
      onChange={(e) => setSlots(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div className="flex items-center">
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
    >
      {editIndex !== null ? (
        <>
        
          <span>Update</span>
        </>
      ) : (
        <>
          <CiSaveUp2 className="w-5 h-5" />
          <span>Save</span>
        </>
      )}
    </button>

    {editIndex !== null && (
      <button
        type="button"
        onClick={resetForm}
        className="bg-red-500 text-white px-4 py-2 rounded-lg ml-4 flex items-center justify-center space-x-2"
      >
        <span>Cancel</span>
      </button>
    )}
  </div>
</form>
  </div>

  <div className="bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Task List</h2>
  {tasks.length === 0 ? (
    <p>No tasks available. Please add a task.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left border-collapse border border-gray-300 shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Task Name</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Slots Needed</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentTasks.map((task, index) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-center text-sm font-medium text-gray-900 border-b border-r border-gray-300">{task.taskname}</td>
              <td className="px-6 py-4 text-center text-sm text-gray-500 border-b border-r border-gray-300">{task.slots} slots</td>
              <td className="px-6 py-4 text-center border-b border-gray-300">
                <div className="flex justify-center space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-semibold px-4 py-2  border-blue-600 hover:bg-blue-100 transition ease-in-out duration-200"
                    onClick={() => handleTaskEdit(indexOfFirstTask + index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold px-4 py-2  border-red-600 hover:bg-red-100 transition ease-in-out duration-200"
                    onClick={() => handleTaskDelete(indexOfFirstTask + index)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
  {tasks.length > tasksPerPage && (
    <div className="flex justify-center items-center mt-6">
      <div className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded-md transition ease-in-out duration-150 ${
              currentPage === index + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )}
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityService;
