import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../../Sidebar/Sidebar';
import axios from 'axios';
import { CiSaveUp2 } from 'react-icons/ci';

function FileReport() {
  const [students, setStudents] = useState([]);
  const [violations, setViolations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedViolation, setSelectedViolation] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedStrand, setSelectedStrand] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  // Fetch students from the server
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/filereport/students');
      console.log('Fetched Students:', response.data); // Debug log
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Unable to load students. Please try again later.');
    }
  };

  // Fetch violations from the server
  const fetchViolations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/filereport/violations');
      console.log('Fetched Violations:', response.data); // Debug log
      setViolations(response.data);
    } catch (error) {
      console.error('Error fetching violations:', error);
      alert('Unable to load violations. Please try again later.');
    }
  };

  // Fetch and enrich reports
  const fetchReports = async () => {
    if (!students.length || !violations.length) {
      console.log('Waiting for students and violations to load');
      return;  // Do not fetch reports until students and violations are loaded
    }

    try {
      const response = await axios.get('http://localhost:3001/filereport/reports');
      const reportsData = response.data;
      console.log('Fetched Reports:', reportsData); // Debug log

      const enrichedReports = reportsData.map(report => {
        const student = students.find(student => student.id === report.student_id);
        const violation = violations.find(violation => violation.id === report.violation_id);

        return {
          ...report,
          student_name: student ? `${student.firstname} ${student.lastname}` : 'Unknown Student',
          violation_name: violation ? violation.violation : 'Unknown Violation',
          track: report.track || 'N/A',  // Ensure track is included
          strand: report.strand || 'N/A', // Ensure strand is included
        };
      });

      setReports(enrichedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Unable to load reports. Please try again later.');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchViolations();
  }, []);

  useEffect(() => {
    // Fetch reports only when students and violations are loaded
    if (students.length && violations.length) {
      fetchReports();
    }
  }, [students, violations]);

  // Handle the report form submission (create or update)
  const handleReportSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are selected
    if (!selectedStudent || !selectedViolation) {
      alert('Please select both a student and a violation');
      return;
    }

    // Ensure report_id is included
    const reportId = editIndex !== null ? reports[editIndex]?.report_id : null;

    if (editIndex !== null && !reportId) {
      alert('Invalid report ID for editing.');
      return;
    }

    // Prepare the payload for the request
    const payload = {
      student_id: selectedStudent,
      violation_id: selectedViolation,
      report_id: reportId,  // include report_id if editing
      track: selectedTrack,
      strand: selectedStrand
    };

    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:3001/filereport/reports/${reportId}`, payload);
      } else {
        await axios.post('http://localhost:3001/filereport/file', payload);
      }
      fetchReports();
      resetForm();
    } catch (error) {
      console.error('Error processing report:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Error processing the request.');
    }
  };

  const handleReportDelete = async (index) => {
    const reportToDelete = reports[index];
    if (window.confirm(`Are you sure you want to delete the report for ${reportToDelete.student_name}?`)) {
      try {
        await axios.delete(`http://localhost:3001/filereport/reports/${reportToDelete.report_id}`);
        fetchReports();
      } catch (error) {
        console.error('Error deleting report:', error.response?.data || error.message);
        alert('Error deleting the report. Please try again later.');
      }
    }
  };

  // Fetch student details for track and strand when selecting a student
  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:3001/assigntask/students/${studentId}/details`);
      const { track, strand } = response.data;

      if (track !== undefined && strand !== undefined) {
        setSelectedTrack(track || '');
        setSelectedStrand(strand || '');
      } else {
        console.error('Track or strand is undefined in response');
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      alert('Failed to load student details');
    }
  };

  // Update track and strand when selecting a student
  const handleStudentChange = (studentId) => {
    setSelectedStudent(studentId);
    fetchStudentDetails(studentId);
  };

  const resetForm = () => {
    setSelectedStudent('');
    setSelectedViolation('');
    setSelectedTrack('');
    setSelectedStrand('');
    setEditIndex(null);
  };

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white min-h-screen">
        <SidebarNavigation />
      </div>
      <div className="flex-1 bg-gray-100">
        <div className="flex flex-col md:flex-row justify-between ml-10 mt-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black-500">File Report</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              File a report for students based on their violations.
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <form onSubmit={handleReportSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editIndex !== null ? 'Edit Report' : 'File Report'}
                </h2>

                <div className="mb-4">
                  <label htmlFor="student" className="block text-gray-700 font-bold mb-2">
                    Select Student
                  </label>
                  <select
                    id="student"
                    value={selectedStudent}
                    onChange={(e) => handleStudentChange(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select a Student --</option>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.firstname} {student.lastname}
                        </option>
                      ))
                    ) : (
                      <option value="">No students available</option>
                    )}
                  </select>
                </div>

                {/* Track and Strand fields */}
                <div className="mb-4">
                  <label htmlFor="track" className="block text-gray-700 font-bold mb-2">
                    Track
                  </label>
                  <input
                    type="text"
                    id="track"
                    value={selectedTrack}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="strand" className="block text-gray-700 font-bold mb-2">
                    Strand
                  </label>
                  <input
                    type="text"
                    id="strand"
                    value={selectedStrand}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="violation" className="block text-gray-700 font-bold mb-2">
                    Select Violation
                  </label>
                  <select
                    id="violation"
                    value={selectedViolation}
                    onChange={(e) => setSelectedViolation(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select a Violation --</option>
                    {violations.length > 0 ? (
                      violations.map((violation) => (
                        <option key={violation.id} value={violation.id}>
                          {violation.violation}
                        </option>
                      ))
                    ) : (
                      <option value="">No violations available</option>
                    )}
                  </select>
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Report List</h2>
              {reports.length === 0 ? (
                <p>No reports available. Please add a report.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse">
                    <thead className="bg-gray-200 text-gray-800">
                      <tr>
                        <th className="px-6 py-3 border-b text-sm font-semibold text-center">Student</th>
                        <th className="px-6 py-3 border-b text-sm font-semibold text-center">Track</th>
                        <th className="px-6 py-3 border-b text-sm font-semibold text-center">Strand</th>
                        <th className="px-6 py-3 border-b text-sm font-semibold text-center">Violation</th>
                        <th className="px-6 py-3 border-b text-sm font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentReports.map((report, index) => (
                        <tr key={report.report_id} className="hover:bg-gray-100">
                          <td className="px-6 py-4 border-b text-sm text-center">{report.student_name}</td>
                          <td className="px-6 py-4 border-b text-sm text-center">{report.track}</td>  {/* Display Track */}
                          <td className="px-6 py-4 border-b text-sm text-center">{report.strand}</td>  {/* Display Strand */}
                          <td className="px-6 py-4 border-b text-sm text-center">{report.violation_name}</td>
                          
                          <td className="px-6 py-4 border-b text-sm text-center">
                            <button
                              onClick={() => handleReportDelete(index)}
                              className="text-red-500"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 flex justify-end">
                    <nav>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </nav>
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

export default FileReport;
