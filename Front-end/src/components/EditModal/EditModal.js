import React, { useState, useEffect } from 'react';

const EditModal = ({ isOpen, onClose, taskId, handleChange, handleSubmit, studentsData, tasksData, personsInCharge, handleStudentChange }) => {
  const [task, setTask] = useState(null); // Store fetched task data

  useEffect(() => {
    if (isOpen && taskId) {
      // Fetch task data when the modal opens
      fetch(`/api/tasks/${taskId}`)
        .then(response => response.json())
        .then(data => setTask(data))
        .catch(error => console.error('Error fetching task:', error));
    }
  }, [isOpen, taskId]); // Fetch data when modal is opened or taskId changes

  if (!isOpen || !task) return null; // Don't render if modal is closed or task data is not available

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[80%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Task</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">×</button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, task.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Student Name */}
            <div className="mb-4">
              <label className="block font-semibold">Student Name</label>
              <select
                name="student_id"
                value={task.student_id || ''}
                onChange={handleStudentChange}
                className="w-full border p-2 rounded box-border"
              >
                <option value="">Select Student</option>
                {Array.isArray(studentsData) && studentsData.length > 0 ? (
                  studentsData.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstname} {student.lastname}
                    </option>
                  ))
                ) : (
                  <option value="">Loading students...</option>
                )}
              </select>
            </div>

            {/* Track */}
            <div className="mb-4">
              <label className="block font-semibold">Track</label>
              <input
                type="text"
                name="track"
                value={task.track || ''}
                className="w-full border p-2 rounded box-border"
                disabled
              />
            </div>

            {/* Strand */}
            <div className="mb-4">
              <label className="block font-semibold">Strand</label>
              <input
                type="text"
                name="strand"
                value={task.strand || ''}
                className="w-full border p-2 rounded box-border"
                disabled
              />
            </div>

            {/* Task */}
            <div className="mb-4">
              <label className="block font-semibold">Task</label>
              <select
                name="task_id"
                value={task.task_id || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
              >
                <option value="">Select Task</option>
                {Array.isArray(tasksData) && tasksData.length > 0 ? (
                  tasksData.map((taskItem) => (
                    <option key={taskItem.id} value={taskItem.id}>
                      {taskItem.taskname}
                    </option>
                  ))
                ) : (
                  <option value="">Loading tasks...</option>
                )}
              </select>
            </div>

            {/* Violation */}
            <div className="mb-4">
              <label className="block font-semibold">Violation</label>
              <input
                type="text"
                name="violation"
                value={task.violation || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
                placeholder="Enter violation"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3.5">
            {/* Duty Hours */}
            <div className="mb-4">
              <label className="block font-semibold">Duty Hours</label>
              <input
                type="number"
                name="dutyHours"
                value={task.dutyHours || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
                placeholder="Enter duty hours"
              />
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block font-semibold">Date</label>
              <input
                type="date"
                name="date"
                value={task.date || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
              />
            </div>

            {/* Time In */}
            <div className="mb-4">
              <label className="block font-semibold">Time In</label>
              <input
                type="time"
                name="inTime"
                value={task.inTime || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
              />
            </div>

            {/* Time Out */}
            <div className="mb-4">
              <label className="block font-semibold">Time Out</label>
              <input
                type="time"
                name="outTime"
                value={task.outTime || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
              />
            </div>

            {/* Person in Charge */}
            <div className="mb-4">
              <label className="block font-semibold">Person in Charge</label>
              <select
                name="personInCharge"
                value={task.personInCharge || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
              >
                <option value="">Select Person</option>
                {Array.isArray(personsInCharge) && personsInCharge.length > 0 ? (
                  personsInCharge.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.firstName} {admin.lastName}
                    </option>
                  ))
                ) : (
                  <option value="">Loading admins...</option>
                )}
              </select>
            </div>
          </div>

          <div className="col-span-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
