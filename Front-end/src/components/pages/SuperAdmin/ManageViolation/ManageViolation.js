import React, { useState, useEffect } from 'react';
import SuperAdminSideBar from '../Sidebar/Super_admin_sidebar';
import axios from 'axios';
import { CiSaveUp2 } from "react-icons/ci";

function ManageViolations() {
  const [violations, setViolations] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [violation, setViolation] = useState('');
  const [dutyhours, setDutyhours] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const violationsPerPage = 5;

  // Fetch violations from the server
  const fetchViolations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/violations');
      setViolations(response.data);
    } catch (error) {
      console.error('Error fetching violations:', error);
    }
  };

  // Initial fetch of violations
  useEffect(() => {
    fetchViolations();
  }, []);

  const handleViolationSubmit = async (e) => {
    e.preventDefault();
    if (!violation || !dutyhours) {
      alert("Please fill in all fields");
      return;
    }
  
    try {
      if (editIndex !== null) {
        // Updating an existing violation
        await axios.put(`http://localhost:3001/violations/${violations[editIndex].id}`, { violation, dutyhours });
      } else {
        // Adding a new violation
        const response = await axios.post('http://localhost:3001/violations', { violation, dutyhours });
      }
      // Fetch the updated list of violations after add/update
      fetchViolations();

      // Reset form fields
      setViolation('');
      setDutyhours('');
      setEditIndex(null);
    } catch (error) {
      console.error('Error processing violation:', error);
    }
  };

  const handleViolationDelete = async (index) => {
    const violationToDelete = violations[index];
    if (window.confirm(`Are you sure you want to delete the violation: ${violationToDelete.violation}?`)) {
      try {
        await axios.delete(`http://localhost:3001/violations/${violationToDelete.id}`);
        const updatedViolations = violations.filter((_, i) => i !== index);
        setViolations(updatedViolations); // Remove violation from state
      } catch (error) {
        console.error('Error deleting violation:', error);
        alert("There was an error deleting the violation.");
      }
    }
  };

  const handleViolationEdit = (index) => {
    setEditIndex(index);
    setViolation(violations[index].violation);
    setDutyhours(violations[index].dutyhours);
  };

  const resetForm = () => {
    setViolation('');
    setDutyhours('');
    setEditIndex(null);
  };

  // Pagination logic
  const indexOfLastViolation = currentPage * violationsPerPage;
  const indexOfFirstViolation = indexOfLastViolation - violationsPerPage;
  const currentViolations = violations.slice(indexOfFirstViolation, indexOfLastViolation);
  const totalPages = Math.ceil(violations.length / violationsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white min-h-screen">
        <SuperAdminSideBar/>
      </div>
      <div className="flex-1 bg-gray-100">
        <div className="flex flex-col md:flex-row justify-between ml-10 mt-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black-500">Manage Violations</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Manage Community Service Violations.
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <form onSubmit={handleViolationSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? 'Edit Violation' : 'Add Violation'}</h2>

                <div className="mb-4">
                  <label htmlFor="violation" className="block text-gray-700 font-bold mb-2">Violation</label>
                  <input
                    type="text"
                    id="violation"
                    value={violation}
                    onChange={(e) => setViolation(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="dutyhours" className="block text-gray-700 font-bold mb-2">Duty Hours</label>
                  <input
                    type="number"
                    id="dutyhours"
                    value={dutyhours}
                    onChange={(e) => setDutyhours(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                  >
                    {editIndex !== null ? <span>Update</span> : <><CiSaveUp2 className="w-5 h-5" /><span>Save</span></>}
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Violation List</h2>
              {violations.length === 0 ? (
                <p>No violations available. Please add a violation.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left border-collapse border border-gray-300 shadow-md">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Violation</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Duty Hours</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentViolations.map((violation, index) => (
                        <tr key={violation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-center text-sm font-medium text-gray-900 border-b border-r border-gray-300">{violation.violation}</td>
                          <td className="px-6 py-4 text-center text-sm text-gray-500 border-b border-r border-gray-300">{violation.dutyhours} hours</td>
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            <div className="flex justify-center space-x-4">
                              <button
                                className="text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 border-blue-600 hover:bg-blue-100 transition ease-in-out duration-200"
                                onClick={() => handleViolationEdit(indexOfFirstViolation + index)}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 font-semibold px-4 py-2 border-red-600 hover:bg-red-100 transition ease-in-out duration-200"
                                onClick={() => handleViolationDelete(indexOfFirstViolation + index)}
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
              {violations.length > violationsPerPage && (
                <div className="flex justify-center items-center mt-6">
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded-md transition ease-in-out duration-150 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-600 hover:bg-blue-200'}`}
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

export default ManageViolations;
