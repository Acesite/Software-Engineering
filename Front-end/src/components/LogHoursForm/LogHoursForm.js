import React, { useState } from 'react';

const LogHoursForm = ({ students, onSubmit }) => {
  const [studentId, setStudentId] = useState('');
  const [renderedHours, setRenderedHours] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId && renderedHours) {
      onSubmit({ studentId, renderedHours: parseInt(renderedHours, 10) });
      setRenderedHours(''); // Clear the input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Select Student:</label>
      <select
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
      >
        <option value="">Select a student</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700 mt-4">Log Rendered Hours:</label>
      <input
        type="number"
        value={renderedHours}
        onChange={(e) => setRenderedHours(e.target.value)}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        placeholder="Enter number of hours"
      />

      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Log Hours
      </button>
    </form>
  );
};

export default LogHoursForm;
