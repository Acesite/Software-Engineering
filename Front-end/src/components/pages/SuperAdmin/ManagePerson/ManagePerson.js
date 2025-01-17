import React, { useState, useEffect } from 'react';
import SuperAdminSideBar from '../Sidebar/Super_admin_sidebar';
import axios from 'axios';

export default function ManagePerson() {
  const [personsData, setPersonsData] = useState([]);
  const [newPerson, setNewPerson] = useState({
    firstName: '',
    lastName: '',
    username: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentPersonId, setCurrentPersonId] = useState(null);

  // Fetch persons in charge
  useEffect(() => {
    axios
      .get('http://localhost:3001/personincharge/person-in-charge')
      .then((response) => {
        setPersonsData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching persons in charge:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPerson((prevPerson) => ({
      ...prevPerson,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPerson.password !== newPerson.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const personData = {
      firstName: newPerson.firstName,
      lastName: newPerson.lastName,
      username: newPerson.username,
      contactNumber: newPerson.contactNumber,
      password: newPerson.password,
    };

    if (isEditing) {
      const confirmEdit = window.confirm('Are you sure you want to save the changes?');
      if (confirmEdit) {
        axios
          .put(`http://localhost:3001/personincharge/person-in-charge/${currentPersonId}`, personData)
          .then(() => {
            setPersonsData((prevData) =>
              prevData.map((person) =>
                person.id === currentPersonId ? { ...person, ...personData } : person
              )
            );
            resetForm();
          })
          .catch((error) => {
            console.error('Error editing person in charge:', error);
          });
      }
    } else {
      const confirmAdd = window.confirm('Are you sure you want to add this person in charge?');
      if (confirmAdd) {
        axios
          .post('http://localhost:3001/personincharge/add-person-in-charge', personData)
          .then((response) => {
            setPersonsData((prevData) => [
              ...prevData,
              { ...personData, id: response.data.personId },
            ]);
            resetForm();
          })
          .catch((error) => {
            console.error('Error adding person in charge:', error);
          });
      }
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this person in charge?');
    if (confirmDelete) {
      axios
        .delete(`http://localhost:3001/personincharge/${id}`)
        .then(() => {
          setPersonsData((prevData) => prevData.filter((person) => person.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting person in charge:', error);
        });
    }
  };

  const handleEdit = (person) => {
    setIsEditing(true);
    setCurrentPersonId(person.id);
    setNewPerson({
      firstName: person.firstName,
      lastName: person.lastName,
      username: person.username,
      contactNumber: person.contactNumber,
      password: '',
      confirmPassword: '',
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentPersonId(null);
    setNewPerson({
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
            <h1 className="text-2xl md:text-3xl font-bold text-black-500">Manage Person In Charge</h1>
            <p className="text-sm md:text-base text-gray-500">
              Add, edit, and remove person in charge accounts.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Person In Charge' : 'Add Person In Charge'}
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="firstName"
              value={newPerson.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="lastName"
              value={newPerson.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="username"
              value={newPerson.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="contactNumber"
              value={newPerson.contactNumber}
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
                  value={newPerson.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="border rounded-lg p-2"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={newPerson.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  className="border rounded-lg p-2"
                />
              </>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            {isEditing ? 'Save Changes' : 'Add Person In Charge'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 ml-3"
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
              {personsData.length > 0 ? (
                personsData.map((person, index) => (
                  <tr key={index} className="border-t">
                    <td className="text-center py-4 px-4">{person.firstName}</td>
                    <td className="text-center py-4 px-4">{person.lastName}</td>
                    <td className="text-center py-4 px-4">{person.username}</td>
                    <td className="text-center py-4 px-4">{person.contactNumber}</td>
                    <td className="text-center py-4 px-4 flex justify-center space-x-4">
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No persons in charge found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
