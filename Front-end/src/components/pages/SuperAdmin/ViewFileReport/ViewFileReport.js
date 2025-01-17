import React, { useState, useEffect } from 'react';
import SuperAdminSideBar from '../Sidebar/Super_admin_sidebar';
import axios from 'axios';

function ViewFileReport() {
  const [reports, setReports] = useState([]);
  const [students, setStudents] = useState([]);
  const [violations, setViolations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  // Fetch students from the server
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/filereport/students');
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
      setViolations(response.data);
    } catch (error) {
      console.error('Error fetching violations:', error);
      alert('Unable to load violations. Please try again later.');
    }
  };

  // Fetch and enrich reports
  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:3001/filereport/reports');
      const reportsData = response.data;

      const enrichedReports = reportsData.map(report => {
        const student = students.find(student => student.id === report.student_id);
        const violation = violations.find(violation => violation.id === report.violation_id);

        return {
          ...report,
          student_name: student ? `${student.firstname} ${student.lastname}` : 'Unknown Student',
          violation_name: violation ? violation.violation : 'Unknown Violation',
          track: report.track || 'N/A',
          strand: report.strand || 'N/A',
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
    if (students.length && violations.length) {
      fetchReports();
    }
  }, [students, violations]);

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
        <SuperAdminSideBar />
      </div>
      <div className="flex-1 bg-gray-100">
        <div className="flex flex-col md:flex-row justify-between ml-10 mt-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black-500">View Report</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              View reports for students based on their violations.
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Report List</h2>
              {reports.length === 0 ? (
                <p>No reports available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse">
                    <thead className="bg-gray-200 text-gray-800">
                      <tr>
                        <th className="px-6 py-3 border-b text-sm font-semibold text-center">Student</th>
                        <th className="px-6 py-3 border-b text-sm font-semibold text-center">Track</th>
                        <th className="px-6 py-3 border-b text-sm font-semibold text-center">Strand</th>
                        <th className="px-6 py-3 border-b text-sm font-semibold text-center">Violation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentReports.map((report) => (
                        <tr key={report.report_id} className="hover:bg-gray-100">
                          <td className="px-6 py-4 border-b text-sm text-center">{report.student_name}</td>
                          <td className="px-6 py-4 border-b text-sm text-center">{report.track}</td>  {/* Display Track */}
                          <td className="px-6 py-4 border-b text-sm text-center">{report.strand}</td>  {/* Display Strand */}
                          <td className="px-6 py-4 border-b text-sm text-center">{report.violation_name}</td>
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

export default ViewFileReport;
