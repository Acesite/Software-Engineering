import React, { useState, useEffect } from 'react';
import SuperAdminSideBar from '../Sidebar/Super_admin_sidebar';
import axios from 'axios';
import { CiSaveUp2, CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";

export default function ManageAdmin() {
  const [adminsData, setAdminsData] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    username: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/superadmin/admins')
      .then((response) => {
        setAdminsData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching admins:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const addedAdmin = {
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      username: newAdmin.username,
      contactNumber: newAdmin.contactNumber,
      password: newAdmin.password,
    };

    if (isEditing) {
      const confirmEdit = window.confirm('Are you sure you want to save the changes?');
      if (confirmEdit) {
        axios.put(`http://localhost:3001/superadmin/admins/${currentAdminId}`, addedAdmin)
          .then((response) => {
            setAdminsData((prevData) =>
              prevData.map((admin) =>
                admin.id === currentAdminId ? { ...admin, ...addedAdmin } : admin
              )
            );
            resetForm();
          })
          .catch((error) => {
            console.error('Error editing admin:', error);
          });
      }
    } else {
      const confirmAdd = window.confirm('Are you sure you want to add this admin?');
      if (confirmAdd) {
        axios.post('http://localhost:3001/superadmin/admins', addedAdmin)
          .then((response) => {
            setAdminsData((prevData) => [
              ...prevData,
              { ...addedAdmin, id: response.data.adminId }
            ]);
            resetForm();
          })
          .catch((error) => {
            console.error('Error adding admin:', error);
          });
      }
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this admin?');
    if (confirmDelete) {
      axios.delete(`http://localhost:3001/superadmin/admins/${id}`)
        .then(() => {
          setAdminsData(adminsData.filter(admin => admin.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting admin:', error);
        });
    }
  };

  const handleEdit = (admin) => {
    setIsEditing(true);
    setCurrentAdminId(admin.id);
    setNewAdmin({
      firstName: admin.firstName,
      lastName: admin.lastName,
      username: admin.username,
      contactNumber: admin.contactNumber,
      password: '',
      confirmPassword: '',
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentAdminId(null);
    setNewAdmin({
      firstName: '',
      lastName: '',
      username: '',
      contactNumber: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-64 bg-gray-800 text-white min-h-screen hidden md:block">
        <SuperAdminSideBar />
      </div>

      <div className="flex-1 bg-gray-100 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black-500">Manage Admins</h1>
            <p className="text-sm md:text-base text-gray-500">
              Add, edit, and remove admin accounts.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Admin' : 'Add Admin'}</h2>
          <div className="flex flex-col gap-4">
  <input
    type="text"
    name="firstName"
    value={newAdmin.firstName}
    onChange={handleChange}
    placeholder="First Name"
    required
    className="border rounded-lg p-2"
  />
  <input
    type="text"
    name="lastName"
    value={newAdmin.lastName}
    onChange={handleChange}
    placeholder="Last Name"
    required
    className="border rounded-lg p-2"
  />
  <input
    type="text"
    name="username"
    value={newAdmin.username}
    onChange={handleChange}
    placeholder="Username"
    required
    className="border rounded-lg p-2"
  />
  <input
    type="text"
    name="contactNumber"
    value={newAdmin.contactNumber}
    onChange={handleChange}
    placeholder="Contact Number"
    required
    className="border rounded-lg p-2"
  />

  {!isEditing && (
    <>
      <input
        type="password"
        name="password"
        value={newAdmin.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="border rounded-lg p-2"
      />
      <input
        type="password"
        name="confirmPassword"
        value={newAdmin.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
        className="border rounded-lg p-2"
      />
    </>
  )}
</div>

          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
            {isEditing ? 'Save Changes' : 'Add Admin'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
          <thead>
  <tr>
    <th className="text-center py-2 px-4 font-semibold text-gray-700">First Name</th>
    <th className="text-center py-2 px-4 font-semibold text-gray-700">Last Name</th>
    <th className="text-center py-2 px-4 font-semibold text-gray-700">Username</th>
    <th className="text-center py-2 px-4 font-semibold text-gray-700">Contact Number</th>
    <th className="text-center py-2 px-4 font-semibold text-gray-700">Actions</th>
  </tr>
</thead>
<tbody>
  {adminsData.length > 0 ? (
    adminsData.map((admin, index) => (
      <tr key={index} className="border-t">
        <td className="text-center py-4 px-4">{admin.firstName}</td>
        <td className="text-center py-4 px-4">{admin.lastName}</td>
        <td className="text-center py-4 px-4">{admin.username}</td>
        <td className="text-center py-4 px-4">{admin.contactNumber}</td>
        <td className="text-center py-4 px-4 flex justify-center space-x-4">
          <button 
            onClick={() => handleEdit(admin)} 
            className="text-blue-500 hover:text-blue-600 flex items-center">
      
            <span>Edit</span>
          </button>
          <button 
            onClick={() => handleDelete(admin.id)} 
            className="text-red-500 hover:text-red-600 flex items-center">
        
            <span>Delete</span>
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center py-4 text-gray-500">No admin accounts found.</td>
    </tr>
  )}
</tbody>




          </table>
        </div>
      </div>
    </div>
  );
}
