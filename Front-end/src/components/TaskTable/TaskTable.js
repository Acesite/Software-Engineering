import React, { useState, useEffect, useRef } from 'react';
import { FaEllipsisH } from 'react-icons/fa'; 
import moment from 'moment-timezone';

// Helper functions to format the date and time
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');
};

const formatTime = (timeString) => {
  if (timeString) {
    return moment(timeString, 'HH:mm').format('hh:mm A');
  }
  return '';
};

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="bg-gray-300 text-gray-800 py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-600 text-white py-2 px-4 rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskTable = ({ tasks, onLogHours, setNewTask, onDeleteTask, fetchTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filter, setFilter] = useState('All'); // "All", "Pending", or "Completed"
  const [actionModalOpen, setActionModalOpen] = useState(null); // State for managing the action modal visibility
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false); // State for the "View All" modal

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const actionModalRef = useRef(null); // Ref for the action modal container

  const openModal = (task) => {
    setTaskToDelete(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToDelete(null);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await onDeleteTask(taskToDelete.id); // Call the delete handler
      fetchTasks(); // Refresh the tasks after deletion
      closeModal(); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (taskData) => {
    setNewTask({
      ...taskData,
      student_firstname: taskData.studentName.split(' ')[0], // Assuming full name is a single string
      student_lastname: taskData.studentName.split(' ')[1] || '', // Handle cases with a single name
    });
  };
  

  // Filter tasks based on the current filter state
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Toggle the visibility of the action modal
  const toggleActionModal = (taskId) => {
    if (actionModalOpen === taskId) {
      setActionModalOpen(null); // Close the modal if it's already open
    } else {
      setActionModalOpen(taskId); // Open the modal for the clicked task
    }
  };

  // Close the action modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionModalRef.current && !actionModalRef.current.contains(e.target)) {
        setActionModalOpen(null); // Close the action modal if click is outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow-md overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        {filteredTasks.length > 0 && (
          <h1 className="text-xl font-semibold text-black-500">Assigned Sanction for Students</h1>
        )}
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-center mb-10">No Sanction available for the selected filter.</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300  table-fixed">
            <thead>
              <tr className="text-center bg-blue-600 text-white">
                <th className="py-2 px-4 border-b text-sm ">Student Name</th>
                <th className="py-2 px-4 border-b text-sm">Track - Stand</th>
                {/* <th className="py-2 px-4 border-b text-sm"></th> */}
                <th className="py-2 px-4 border-b text-sm">Task - Violation</th>
                {/* <th className="py-2 px-4 border-b text-sm"></th> */}
                <th className="py-2 px-4 border-b text-sm">Duty Hours</th>
                <th className="py-2 px-4 border-b text-sm">Rendered Hours</th>
                <th className="py-2 px-4 border-b text-sm">Date</th>
                {/* <th className="py-2 px-4 border-b text-sm">Time In - Time Out</th> */}
                {/* <th className="py-2 px-4 border-b text-sm"></th> */}
                <th className="py-2 px-4 border-b text-sm">Person in Charge</th>
                <th className="py-2 px-4 border-b text-sm">Status</th>
                {/* <th className="py-2 px-4 border-b text-sm">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b border-r text-sm align-middle">{task.studentName}</td>
                  <td className="py-2 px-4 border-b border-r text-sm align-middle">{task.track} - {task.strand}</td>
                  {/* <td className="py-2 px-4 border-b text-sm align-middle"></td> */}
                  <td className="py-2 px-4 border-b border-r text-sm align-middle">{task.taskName} - {task.violation}</td>
                  {/* <td className="py-2 px-4 border-b text-sm align-middle">}</td> */}
                  <td className="py-2 px-4 border-b border-r text-sm align-middle">{task.dutyHours}</td>
                  <td className="py-2 px-4 border-b border-r text-sm align-middle">{task.renderedHours}</td>
                  <td className="py-2 px-4 border-b border-r text-sm align-middle">{formatDate(task.date)}</td>
                  {/* <td className="py-2 px-4 border-b border-r text-sm align-middle">{formatTime(task.inTime)} - {formatTime(task.outTime)}</td> */}
                  {/* <td className="py-2 px-4 border-b text-sm align-middle bg-gray-100"></td> */}
                  <td className="py-2 px-4 border-b border-r text-sm align-middle">{task.personInChargeName}</td>
                  <td className={`py-2 px-4 border-b border-r text-sm align-middle  ${task.status === "Completed" ? "text-green-500 font-semibold" : ""} ${task.status === "Pending" ? "text-yellow-500 font-semibold" : ""}`} >{task.status}
                    {/* <div className='container w-8 h-8 bg-green-50 display-none'>Test</div> onMouseEnter={onMouseEnterStatus} */}
                  </td>
                  {/* <td className=" text-sm align-middle">
                    <div className="flex flex-row items-center justify-center ">
                      {/* <button onClick={() => toggleActionModal(task.id)} className="text-black px-4 py-2 rounded">
                        <FaEllipsisH className="w-4 h-4 inline-block text-black-400" />
                      </button> */}

                      {/* Action Modal */}
                      {/** 
                      {actionModalOpen === task.id && (
                        <div ref={actionModalRef} className="absolute bg-white shadow-md rounded p-4 mt-2 w-40 z-10">
                          <div className="flex flex-col">
                            {task.status === "Pending" && (
                              <button onClick={() => onLogHours(task)} className="text-green-700 py-2 px-4 rounded mb-2 hover:bg-green-100">
                                Log Hours
                              </button>
                            )}
                            <button onClick={() => handleEditTask(task)} className="text-blue-700 py-2 px-4 rounded mb-2 hover:bg-blue-100">
                              Edit Task
                            </button>
                            <button onClick={() => openModal(task)} className="text-red-700 py-2 px-4 rounded hover:bg-red-100">
                              Delete Task
                            </button>
                          </div>
                        </div>
                      )}
                      */}
                    {/* </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      
      <div className="flex justify-between items-center mt-4">
  {/* Pagination Info on the Left */}
  <div className="text-sm text-gray-600">
    Page {currentPage} of {totalPages} | Total Items: {filteredTasks.length}
  </div>

  {/* Page Number Buttons on the Right */}
  <div className="ml-4 flex items-center">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => paginate(index + 1)}
        className={`py-1 px-3 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {index + 1}
      </button>
    ))}
  </div>
</div>



      <ConfirmationModal isOpen={isModalOpen} onConfirm={confirmDelete} onCancel={closeModal} message="Are you sure you want to delete this task?" />
    </div>
  );
};

export default TaskTable;
