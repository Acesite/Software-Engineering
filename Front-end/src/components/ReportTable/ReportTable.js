import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { RiFileExcel2Line } from 'react-icons/ri';

const Tooltip = ({ children, message, isVisible }) => {
  return (
    <div className="relative inline-block">
      {children}
      {isVisible && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 text-sm text-white bg-gray-500 rounded shadow-md">
          {message}
        </div>
      )}
    </div>
  );
};

const ReportTable = ({ tasks, onCellClick, sortBy, handleSort, formatDate, formatTime }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const rowsPerPage = 5;

  // Calculate pagination data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTasks = tasks.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(tasks.length / rowsPerPage);

  const exportToExcel = () => {
    const totalRenderedHours = tasks.reduce((total, task) => total + (task.renderedHours || 0), 0);

    const exportData = tasks.map((task) => ({
      'Student Name': task.studentName || '',
      'Track': task.track || '',
      'Strand': task.strand || '',
      'Task': task.taskName || '',
      'Violation': task.violation || '',
      'Duty Hours': task.dutyHours || 0,
      'Rendered Hours': task.renderedHours || 0,
      'Report Date': formatDate(task.date),
      'Time In': formatTime(task.inTime),
      'Time Out': formatTime(task.outTime),
      'Person In Charge': task.personInChargeName || '',
      'Current Status': task.status || '',
    }));

    exportData.push({
      'Student Name': 'Total',
      'Rendered Hours': totalRenderedHours,
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const colWidths = Object.keys(worksheet).reduce((acc, key) => {
      const col = worksheet[key];
      const colLength = col.v ? col.v.toString().length : 0;
      const colIndex = key.charAt(0);

      if (!acc[colIndex] || acc[colIndex] < colLength) {
        acc[colIndex] = colLength;
      }
      return acc;
    }, {});

    const wscols = Object.keys(colWidths).map(col => ({ wch: colWidths[col] + 2 }));
    worksheet['!cols'] = wscols;

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell) {
          cell.s = { alignment: { wrapText: true } };
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'Reports_with_Total_rendered_hours.xlsx');
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-500 font-semibold';
      case 'Pending':
        return 'text-yellow-500 font-semibold';
      default:
        return '';
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleMouseEnter = () => {
    setIsTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  // Helper function to get completion date (current date)
  const getCompletionDate = (status) => {
    if (status === 'Completed') {
      return formatDate(new Date());  // Return the current date if status is "Completed"
    }
    return ''; // If status is not completed, return empty
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <RiFileExcel2Line className="mr-2 w-5 h-5" />
          Export
        </button>
      </div>

      <table className="min-w-full border border-gray-300 table-auto">
        <thead>
          <tr className="bg-gray-100 text-center">
            {[
              'Student Name',
              'Track',
              'Strand',
              'Task Name',
              'Violation',
              'Duty Hours',
              'Rendered Hours',
              'Date',
              'Time In',
              'Time Out',
              'Person In Charge',
              'Status',
            ].map((column, index) => (
              <th
                key={index}
                className="py-3 px-4 border text-sm font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort(column.toLowerCase().replace(/ /g, ''))}
              >
                {column}
                {sortBy.column === column.toLowerCase().replace(/ /g, '') ? (
                  sortBy.direction === 'asc' ? ' 🔼' : ' 🔽'
                ) : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentTasks.length > 0 ? (
            currentTasks.map((task, index) => (
              <tr key={task.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {[
                  'studentName',
                  'track',
                  'strand',
                  'taskName',
                  'violation',
                  'dutyHours',
                  'renderedHours',
                  'date',
                  'inTime',
                  'outTime',
                  'personInChargeName',
                  'status',
                ].map((column) => (
                  <td
                  key={column}
                  onClick={() => onCellClick(task, column)}
                  className={`py-3 px-4 border text-sm text-center cursor-pointer hover:bg-gray-100 ${
                    column === 'status' ? getStatusTextColor(task[column]) : ''
                  }`}
                >
                  {column === 'status' ? (
                    <Tooltip
                      message={task.status === 'Completed' ? `Completed on: ${getCompletionDate(task.status)}` : ''}
                      isVisible={isTooltipVisible}
                    >
                      <span
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={`cursor-pointer ${
                          task.status === 'Completed' ? '' : 'hover:bg-gray-100'
                        }`}
                      >
                        {task[column] || 'N/A'}
                      </span>
                    </Tooltip>
                  ) : column === 'dutyHours' ? (
                    task[column] || 0
                  ) : column === 'date' ? (
                    formatDate(task[column])
                  ) : column === 'inTime' || column === 'outTime' ? (
                    formatTime(task[column])
                  ) : column === 'renderedHours' ? (
                    task[column] || 0
                  ) : (
                    task[column] || 'N/A'
                  )}
                </td>
                
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="py-4 text-center text-gray-300">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-gray-600 text-sm">
          Page {currentPage} of {totalPages} | Total Items: {tasks.length}
        </div>
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportTable;
