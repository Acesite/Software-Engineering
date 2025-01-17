import React, { useState, useEffect } from 'react';
import { CiSaveUp2 } from 'react-icons/ci';
import axios from 'axios';
import moment from 'moment-timezone';
import StudentSelectModal from './StudentSelectModal';
import ViolationSelectModal from "./ViolationSelectModal";
import Clock from '../../../Clock/Clock';

const TaskForm = ({ newTask, handleChange, handleAddTask, setNewTask }) => {
  const [studentsData, setStudentsData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [personsInCharge, setPersonsInCharge] = useState([]);
  const [violationsData, setViolationsData] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  

  useEffect(() => {
    // Fetch students
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/students');
        setStudentsData(response.data);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students');
      }
    };
  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/assigntask');
      // Filter tasks with available slots (greater than 0)
      const filteredTasks = response.data.filter(task => task.slots > 0);
      setTasksData(filteredTasks);  // Set filtered tasks
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    }
  };
 // Fetch person in charge
 const fetchPersonsInCharge = async () => {
  try {
    const response = await axios.get('http://localhost:3001/assigntask/person-in-charge');
    setPersonsInCharge(response.data);
  } catch (error) {
    console.error('Error fetching persons in charge:', error);
    setError('Failed to load persons in charge');
  }
};

const fetchViolations = async () => {
  try {
    const response = await axios.get("http://localhost:3001/violations");
    setViolationsData(response.data);
  } catch (error) {
    console.error("Error fetching violations:", error);
  }
};


    fetchStudents();
    fetchTasks();
    fetchPersonsInCharge();
    fetchViolations();
  }, []);

  // Fetch student details based on the selected student
  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:3001/assigntask/students/${studentId}/details`);
      const { track, strand } = response.data;

      if (track !== undefined && strand !== undefined) {
        handleChange({ target: { name: 'track', value: track || '' } });
        handleChange({ target: { name: 'strand', value: strand || '' } });
      } else {
        console.error('Track or strand is undefined in response');
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Failed to load student details');
    } 
  };

  const handleStudentChange = (student) => {
    if (!student) return;
  
    setNewTask((prevTask) => ({
      ...prevTask,
      student_id: student.id,
      student_firstname: student.firstname, // Use `firstname` from `student`
      student_lastname: student.lastname,   // Use `lastname` from `student`
    }));
  
    // Fetch additional details like track and strand if needed
    fetchStudentDetails(student.id);
  };

  const handleViolationChange = (violation) => {
    setNewTask((prevTask) => ({
      ...prevTask,
      violation: violation.violation,
      dutyHours: violation.dutyhours, // Pre-fill duty hours when a violation is selected
    }));
    setIsViolationModalOpen(false); // Close the modal after selecting
  };
  
  const validateForm = () => {
    const validations = [
      { field: 'student_id', message: 'Please select a student.' },
      { field: 'track', message: 'Track is required.' },
      { field: 'strand', message: 'Strand is required.' },
      { field: 'task_id', message: 'Task selection is required.' },
      { field: 'violation', message: 'Nature of the violation is required.' },
      { field: 'dutyHours', message: 'Duty hours are required.' },
      { field: 'date', message: 'Date selection is required.' },
       { field: 'inTime', message: 'Time-in selection is required.' },
       { field: 'outTime', message: 'Time-out selection is required.' },
      { field: 'personInCharge', message: 'Person in charge is required.' },
    ];

    for (let { field, message } of validations) {
      if (!newTask[field]) {
        setError(message);
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form before proceeding
    if (validateForm()) {
      try {
        
        const inTimeManila = moment(`1970-01-01T${newTask.inTime}`).tz("Asia/Manila", true).format("YYYY-MM-DDTHH:mm:ss"); 
        const outTimeManila = moment(`1970-01-01T${newTask.outTime}`).tz("Asia/Manila", true).format("YYYY-MM-DDTHH:mm:ss"); 
  
        // Log to check the converted times
        console.log("inTimeManila:", inTimeManila);
        console.log("outTimeManila:", outTimeManila);
  
        const taskData = {
          ...newTask,
          inTime: inTimeManila,
          outTime: outTimeManila,
        };

        // Create or update the task
        if (newTask.id) {
          const response = await axios.put(`http://localhost:3001/assigntask/${newTask.id}`, taskData);
          console.log('Task updated successfully:', response.data);
        } else {
          const response = await axios.post('http://localhost:3001/assigntask', taskData);
          console.log('Task added successfully:', response.data);
        }
  
        // Clear previous errors, reload the page or navigate to a new state
        alert(newTask.id ? "Task updated successfully!" : "Task added successfully!");
        setError('');
        window.location.reload();  
  
      } catch (err) {
        console.error('Error saving task:', err);
        setError(`Failed to ${newTask.id ? 'update' : 'add'} task: ${err.message}`);
      }
    }
  };
  
  const [previousTask, setPreviousTask] = useState(null);
  // Effect to fetch task data when editing
  useEffect(() => {
    console.log("New Task Updated:", newTask);  // Add this to see the updated values
  
    if (newTask.id) {
      if (previousTask && newTask.student_id !== previousTask.student_id) {
        handleChange({ target: { name: 'student_id', value: newTask.student_id } });
        handleChange({ target: { name: 'student_firstname', value: newTask.student_firstname || '' } });  // Ensure these fields are set
        handleChange({ target: { name: 'student_lastname', value: newTask.student_lastname || '' } });
        handleChange({ target: { name: 'track', value: newTask.track } });
        handleChange({ target: { name: 'strand', value: newTask.strand } });
        handleChange({ target: { name: 'task_id', value: newTask.task_id } });
        handleChange({ target: { name: 'violation', value: newTask.violation } });
        handleChange({ target: { name: 'dutyHours', value: newTask.dutyHours } });
        handleChange({ target: { name: 'date', value: newTask.date } });
        handleChange({ target: { name: 'inTime', value: newTask.inTime } });
        handleChange({ target: { name: 'outTime', value: newTask.outTime } });
        handleChange({ target: { name: 'personInCharge', value: newTask.personInCharge } });
        handleChange({ target: { name: 'student_firstname', value: newTask.student_firstname } });  // Add these
        handleChange({ target: { name: 'student_lastname', value: newTask.student_lastname } });
  
        setPreviousTask(newTask);
      }
    }
  }, [newTask, previousTask, handleChange]);
  

  
  return (
    <div className="bg-white p-6 rounded shadow-md mb-5">
       <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black-500">Assign Task</h2>
        <Clock />
      </div>


      {error && (
        <div className="bg-red-300 text-red-800 p-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Column: Student Name, Track, Strand, Task, and Violation */}
          <div className="space-y-4">
          <div className="mb-4">
              <label className="block font-semibold">Student Name</label>
             <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full border p-2 rounded box-border text-left"
          >
            {newTask.student_id ? (
              `${newTask.student_firstname || ''} ${newTask.student_lastname || ''}`.trim()
            ) : (
              "Select Student"
            )}
          </button>
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Track</label>
              <input
                type="text"
                name="track"
                value={newTask.track || ''}
                className="w-full border p-2 rounded box-border"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Strand</label>
              <input
                type="text"
                name="strand"
                value={newTask.strand || ''}
                className="w-full border p-2 rounded box-border"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Task</label>
              <select
             name="task_id"
            value={newTask.task_id || ''}
             onChange={handleChange}
             className="w-full border p-2 rounded box-border"
  >
             <option value="" hidden>Select Task</option>
             {tasksData.map((task) => (
            <option key={task.id} value={task.id}>
             {task.taskname}
            </option>
          ))}
         </select>
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Violation</label>
              <button
                type="button"
                onClick={() => setIsViolationModalOpen(true)} // Open the violation modal
                className="w-full border p-2 rounded box-border text-left"
              >
                {newTask.violation ? newTask.violation : "Select Violation"}
              </button>
            </div>
            
          </div>

          {/* Right Column: Duty Hours, Date, Time In, Time Out, Person in Charge */}
          <div className="space-y-3.5">


          <div className="mb-4">
              <label className="block font-semibold">Duty Hours</label>
              <input
                type="number"
                name="dutyHours"
                value={newTask.dutyHours || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Date</label>
              <input
                  type="date" 
                  name="date" 
                  value={newTask.date} 
                  onChange={handleChange} 
                className="w-full border p-2 rounded box-border"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Time In</label>
              <input
                type="time"
                name="inTime"
                value={newTask.inTime || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Time Out</label>
              <input
                type="time"
                name="outTime"
                value={newTask.outTime || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded box-border"
              />
            </div> 

          <div className="mb-4">
            <label className="block font-semibold">Person in Charge</label>
            <select
              name="personInCharge"
              value={newTask.personInCharge || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded box-border"
            >
              <option value="" hidden>Select Person</option>
              {personsInCharge.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.firstName} {person.lastName}
                </option>
              ))}
            </select>
          </div>

          </div>
        </div>

        <div className="mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none">
          <CiSaveUp2 className="inline-block mr-2" />
          {newTask.id ? 'Update Task' : 'Assign Task'}
        </button>

        {newTask.id && (
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800 focus:outline-none ml-4"
              onClick={() => {
                setNewTask({}); // Reset the task form
              }}
            >
              Cancel
            </button>
          )}
                </div>
              </form>
              <StudentSelectModal
          studentsData={studentsData}
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          onSelectStudent={handleStudentChange} // Ensure this function is called with the selected student
        />


         {/* Violation Select Modal */}
      <ViolationSelectModal
        violationsData={violationsData}
        isOpen={isViolationModalOpen}
        closeModal={() => setIsViolationModalOpen(false)}
        onSelectViolation={handleViolationChange}
      />
            </div>
          );
        };

        export default TaskForm;
