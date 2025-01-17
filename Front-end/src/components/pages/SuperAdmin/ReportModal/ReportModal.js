import React from 'react';

const ReportModal = ({ data, onClose, formatDate, formatTime }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-8xl max-h-[80vh] overflow-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Task Details</h2>
        
        {/* Table Layout in Landscape Style */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Student Name</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Track</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Strand</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Task</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Violation</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Duty Hours</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Rendered Hours</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Date</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Time In</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Time Out</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Person in Charge</th>
                <th className="py-3 px-4 border text-sm font-semibold text-gray-700 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="py-3 px-4 border text-sm">{data.studentName || 'N/A'}</td>
                <td className="py-3 px-4 border text-sm">{data.track || 'N/A'}</td>
                <td className="py-3 px-4 border text-sm">{data.strand || 'N/A'}</td>
                <td className="py-3 px-4 border text-sm">{data.taskName || 'N/A'}</td>
                <td className="py-3 px-4 border text-sm">{data.violation || 'N/A'}</td>
                <td className="py-3 px-4 border text-sm">{data.dutyHours || 0}</td>
                <td className="py-3 px-4 border text-sm">{data.renderedHours || 0}</td>
                <td className="py-3 px-4 border text-sm">{formatDate(data.date)}</td>
                <td className="py-3 px-4 border text-sm">{formatTime(data.inTime)}</td>
                <td className="py-3 px-4 border text-sm">{formatTime(data.outTime)}</td>
                <td className="py-3 px-4 border text-sm">{data.personInChargeName || 'N/A'}</td>
                <td className={`py-3 px-4 border text-sm font-semibold ${data.status === "Completed" ? "text-green-600" : data.status === "Pending" ? "text-yellow-600" : "text-gray-700"}`}>
                  {data.status}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Close Button Below the Table */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
