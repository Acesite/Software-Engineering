import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../../Sidebar/Sidebar';
import moment from 'moment-timezone';
import ReportTable from '../../ReportTable/ReportTable';
import ReportModal from '../../ReportModal/ReportModal';

function Reports() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ track: '', status: '' });
  const [sortBy, setSortBy] = useState({ column: '', direction: 'asc' });
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [uniqueYears, setUniqueYears] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:3001/reports');
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);

        const years = data.map(task => new Date(task.date).getFullYear());
        setUniqueYears([...new Set(years)]);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatTime = (timeString) => {
    if (timeString) {
      return moment(timeString, 'HH:mm').format('hh:mm A');
    }
    return 'N/A';
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSort = (column) => {
    const direction =
      sortBy.column === column && sortBy.direction === 'asc' ? 'desc' : 'asc';
    setSortBy({ column, direction });
  };

  const handleCellClick = (task, column) => {
    const data = {
      value: task[column],
      column: column,
      studentName: task.studentName,
      taskName: task.taskName,
      track: task.track,
      strand: task.strand,
      violation: task.violation,
      dutyHours: task.dutyHours,
      renderedHours: task.renderedHours,
      date: task.date,
      inTime: task.inTime,
      outTime: task.outTime,
      personInChargeName: task.personInChargeName,
      status: task.status
    };
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const handleYearFilterChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const filteredTasks = (tasks || [])
    .filter((task) => {
      const matchesSearch =
        !searchTerm || task.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTrack = !filters.track || task.track === filters.track;
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesYear = !selectedYear || new Date(task.date).getFullYear().toString() === selectedYear;

      return matchesSearch && matchesTrack && matchesStatus && matchesYear;
    })
    .sort((a, b) => {
      if (!sortBy.column) return 0;
      const aValue = a[sortBy.column];
      const bValue = b[sortBy.column];

      if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white min-h-screen">
        <SidebarNavigation />
      </div>
      <div className="flex-1 bg-gray-100">
        <div className="flex flex-col md:flex-row justify-between ml-10 mt-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black-500">Reports</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              A list of students and their community service hours, status, and other details.
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white p-6 rounded shadow-md overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Reports</h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by student name"
                className="px-4 py-2 border rounded"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex mb-4">
              <select
                name="track"
                className="mr-4 px-4 py-2 border rounded"
                onChange={handleFilterChange}
                value={filters.track}
              >
                <option value="">All Tracks</option>
                <option value="Academic Track">Academic Track</option>
                <option value="Technical Vocational Livelihood">TVL Track</option>
                <option value="Arts & Design">Arts & Design Track</option>
              </select>

              <select
                name="status"
                className="mr-4 px-4 py-2 border rounded"
                onChange={handleFilterChange}
                value={filters.status}
              >
                <option value="">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>

              {/* Year Filter Dropdown */}
              <select
                name="year"
                className="mr-4 px-4 py-2 border rounded"
                onChange={handleYearFilterChange}
                value={selectedYear}
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className="text-gray-500 text-center">Loading...</p>
            ) : (
              <ReportTable
                tasks={filteredTasks}
                onCellClick={handleCellClick}
                sortBy={sortBy}
                handleSort={handleSort}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ReportModal
          data={selectedData}
          onClose={() => setIsModalOpen(false)}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
    </div>
  );
}

export default Reports;
