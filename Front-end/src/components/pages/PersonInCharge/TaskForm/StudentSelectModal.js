import React, { useState, useEffect } from "react";

const StudentSelectModal = ({ studentsData, isOpen, closeModal, onSelectStudent }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const studentsPerPage = 5; // Number of students per page

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  if (!isOpen) return null;

  // Filter students based on search
  const filteredStudents = studentsData.filter(
    (student) =>
      `${student.firstname} ${student.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      `${student.track}-${student.strand}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  // Generate page numbers for navigation
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Select a Student</h3>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} | Total Items: {filteredStudents.length}
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by name or track..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[300px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto max-h-[50vh]">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="w-1/2 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b ">
                  Full Name
                </th>
                <th className="w-1/2 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Track - Strand
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {currentStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => {
                    onSelectStudent(student);
                    closeModal();
                  }}
                  className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center  ">
                    {student.firstname} {student.lastname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center ">
                    {student.track}-{student.strand}
                  </td>
                </tr>
              ))}
              {currentStudents.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination and Close */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            {/* Pagination Buttons */}
            <div className="flex gap-2">{renderPageNumbers()}</div>
            <button
              onClick={closeModal}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSelectModal;
