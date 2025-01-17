import React, { useState, useEffect } from 'react';

const LogHoursModal = ({ task, onClose, onSave }) => {
  const [renderedHours, setRenderedHours] = useState('');

  useEffect(() => {
    // Reset renderedHours to an empty string when the modal opens
    setRenderedHours('');
  }, [task]);

  const handleSave = async () => {
    // Validate the input to ensure it's a positive number
    const hours = parseFloat(renderedHours);
    if (isNaN(hours) || hours <= 0) {
      alert('Please enter a valid number of hours.');
      return;
    }

    // Call the parent function to save the rendered hours
    await onSave(task.id, hours);

    // Clear the input and close the modal after saving
    setRenderedHours('');
    onClose();
  };

  if (!task) return null; // Prevent rendering if no task is passed

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Log Hours</h2>
        <p className="mb-4">Task for: {task.studentName}</p>
        <div className="mb-4">
          <label className="block font-semibold">Rendered Hours</label>
          <input
            type="number"
            value={renderedHours}
            onChange={(e) => setRenderedHours(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter hours worked"
            min="0" // Prevent negative input
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => {
              setRenderedHours(''); // Clear input when closing
              onClose();
            }}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogHoursModal;
