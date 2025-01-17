import React, { useState, useEffect, useRef } from 'react';
import SidebarNavigation from '../../Sidebar/Sidebar';
import axios from 'axios';
import { FaEllipsisH } from 'react-icons/fa';

export default function StudentProfile() {
  const [studentsData, setStudentsData] = useState([]);
  const [newStudent, setNewStudent] = useState({
    firstname: '',
    lastname: '',
    username: '',
    track: '',
    strand: '',
    password: '',
    confirmPassword: '',
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(null);  // Track which student's modal is open

  const actionModalRef = useRef(null);  // Reference for the modal

  // Define Track and Strand options
  const tracks = [
    { value: 'Academic Track', label: 'Academic Track' },
    { value: 'Technical Vocational Livelihood', label: 'Technical Vocational Livelihood' },
    { value: 'Arts & Design', label: 'Arts & Design' },
  ];

  const strands = {
    'Academic Track': [
      { value: 'STEM', label: 'Science, Technology, Engineering, and Mathematics (STEM)' },
      { value: 'ABM', label: 'Accountancy, Business, and Management (ABM)' },
      { value: 'HUMSS', label: 'Humanities and Social Sciences (HUMSS)' },
      { value: 'GAS', label: 'General Academic Strand (GAS)' },
    ],
    'Technical Vocational Livelihood': [
      { value: 'Home Economics', label: 'Home Economics Strand' },
      { value: 'Tourism', label: 'Tourism ' },
      { value: 'ICT', label: 'Information and Communication Technology (ICT) ' },
    ],
    'Arts & Design': [
      { value: 'Visual Arts', label: 'Visual Arts' },
      { value: 'Architectural Drafting', label: 'Architectural Drafting' },
    ],
  };

  // Fetch students from the backend
  useEffect(() => {
    axios.get('http://localhost:3001/students')
      .then((response) => {
        setStudentsData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (newStudent.password !== newStudent.confirmPassword) {
      alert("Passwords do not match");
      return; // Stop form submission
    }

    const studentData = {
      firstname: newStudent.firstname,
      lastname: newStudent.lastname,
      username: newStudent.username,
      track: newStudent.track,
      strand: newStudent.strand,
      password: newStudent.password,
      confirm_password: newStudent.confirmPassword,
    };

    if (editingStudent) {
      // If editing an existing student, send the updated data
      axios.put(`http://localhost:3001/students/${editingStudent.id}`, studentData)
        .then((response) => {
          console.log('Updated student:', response.data);
          setStudentsData((prevData) => {
            return prevData.map((student) =>
              student.id === editingStudent.id ? { ...student, ...studentData } : student
            );
          });

          setEditingStudent(null); // Clear the editing state
          setNewStudent({ firstname: '', lastname: '', username: '', track: '', strand: '', password: '', confirmPassword: '' });
        })
        .catch((error) => {
          console.error('Error updating student:', error);
        });
    } else {
      // Add new student
      axios.post('http://localhost:3001/students', studentData)
        .then((response) => {
          console.log('Response from server:', response.data);
          setStudentsData((prevData) => [
            ...prevData,
            { ...studentData, id: response.data.studentId }
          ]);
          setNewStudent({ firstname: '', lastname: '', username: '', track: '', strand: '', password: '', confirmPassword: '' });
        })
        .catch((error) => {
          console.error('Error adding student:', error);
        });
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setNewStudent({
      firstname: student.firstname,
      lastname: student.lastname,
      username: student.username,
      track: student.track,
      strand: student.strand,
      password: '',
      confirmPassword: '',
    });
    setActionModalOpen(null);  // Close the modal after edit
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      axios.delete(`http://localhost:3001/students/${id}`)
        .then((response) => {
          console.log('Student deleted:', response.data);
          setStudentsData(studentsData.filter(student => student.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting student:', error);
        });
    }
    setActionModalOpen(null);  // Close the modal after delete
  };

  const toggleActionModal = (id) => {
    setActionModalOpen(id === actionModalOpen ? null : id); // Toggle the modal visibility
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-64 bg-gray-800 text-white min-h-screen hidden md:block">
        <SidebarNavigation />
      </div>

      <div className="flex-1 bg-gray-100 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black-500">Manage Student</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              A list of students and their community service hours, status, and other details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow-md rounded-lg">
  <h2 className="text-lg font-semibold mb-4">{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
  <div className="flex flex-col gap-4">
    <input
      type="text"
      name="firstname"
      value={newStudent.firstname}
      onChange={handleChange}
      placeholder="First Name"
      required
      className="border rounded-lg p-2"
    />
    <input
      type="text"
      name="lastname"
      value={newStudent.lastname}
      onChange={handleChange}
      placeholder="Last Name"
      required
      className="border rounded-lg p-2"
    />
    <input
      type="text"
      name="username"
      value={newStudent.username}
      onChange={handleChange}
      placeholder="Username"
      required
      className="border rounded-lg p-2"
    />
    {/* Track and Strand dropdown */}
    <select
      name="track"
      value={newStudent.track}
      onChange={handleChange}
      required
      className="border rounded-lg p-2"
    >
      <option value="">Select Track</option>
      {tracks.map((track) => (
        <option key={track.value} value={track.value}>
          {track.label}
        </option>
      ))}
    </select>

    <select
      name="strand"
      value={newStudent.strand}
      onChange={handleChange}
      required
      className="border rounded-lg p-2"
      disabled={!newStudent.track}
    >
      <option value="">Select Strand</option>
      {newStudent.track && strands[newStudent.track]?.map((strand) => (
        <option key={strand.value} value={strand.value}>
          {strand.label}
        </option>
      ))}
    </select>

    <input
      type="password"
      name="password"
      value={newStudent.password}
      onChange={handleChange}
      placeholder="Password"
      required
      className="border rounded-lg p-2"
    />
    <input
      type="password"
      name="confirmPassword"
      value={newStudent.confirmPassword}
      onChange={handleChange}
      placeholder="Confirm Password"
      required
      className="border rounded-lg p-2"
    />
  </div>
  <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
    {editingStudent ? 'Update Student' : 'Add Student'}
  </button>

  {/* Add Cancel Button */}
  {editingStudent && (
    <button
      type="button"
      onClick={() => {
        setEditingStudent(null); // Reset editing state
        setNewStudent({ firstname: '', lastname: '', username: '', track: '', strand: '', password: '', confirmPassword: '' }); // Clear the form fields
      }}
      className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-800"
    >
      Cancel
    </button>
  )}
</form>


        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="text-center py-2 px-4 font-semibold text-gray-700">Profile Picture</th>
                <th className="text-center py-2 px-4 font-semibold text-gray-700">First Name</th>
                <th className="text-center py-2 px-4 font-semibold text-gray-700">Last Name</th>
                <th className="text-center py-2 px-4 font-semibold text-gray-700">Username</th>
                <th className="text-center py-2 px-4 font-semibold text-gray-700">Track</th>
                <th className="text-center py-2 px-4 font-semibold text-gray-700">Strand</th>
                <th className="text-center py-2 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
  {studentsData.length > 0 ? (
    studentsData.map((student, index) => (
      <tr key={index} className="border-t">
        <td className="py-4 px-4 flex justify-center text-center">
          <img 
            src={`http://localhost:3001/uploads/${student.profile_picture}`} 
            alt={`${student.firstname} ${student.lastname}'s profile`} 
            className="w-10 h-10 rounded-full object-cover" 
          />
        </td>
        <td className="text-center py-4 px-4">{student.firstname}</td>
        <td className="text-center py-4 px-4">{student.lastname}</td>
        <td className="text-center py-4 px-4">{student.username}</td>
        <td className="text-center py-4 px-4">{student.track}</td>
        <td className="text-center py-4 px-4">{student.strand}</td>
        <td className="text-center py-4 px-4">
          <button onClick={() => toggleActionModal(student.id)} className="text-black px-4 py-2 rounded">
            <FaEllipsisH className="w-4 h-4 inline-block text-black-400" />
          </button>
          {actionModalOpen === student.id && (
            <div ref={actionModalRef} className="absolute bg-white shadow-md rounded p-4 mt-2 w-40 z-10">
              <div className="flex flex-col">
                <button
                  onClick={() => handleEdit(student)}
                  className="text-blue-700 py-2 px-4 rounded mb-2 hover:bg-blue-100"
                >
                  Edit 
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  className="text-red-700 py-2 px-4 rounded hover:bg-red-100"
                >
                  Delete 
                </button>
              </div>
            </div>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="py-4 px-4 text-center">No students found.</td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

