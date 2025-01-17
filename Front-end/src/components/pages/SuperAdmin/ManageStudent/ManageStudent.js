import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuperAdminSideBar from '../Sidebar/Super_admin_sidebar';
import TaskForm from '../TaskForm/TaskForm';
import TaskTable from '../TaskTable/TaskTable';
import LogHoursModal from '../LogHoursModal/LogHoursModal';

const ManageStudent = () => {
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loggedHours, setLoggedHours] = useState('');
  const [newTask, setNewTask] = useState({
    taskName: '',
    task_id: '',
    student_id: '',
    studentName: '',
    track: '',
    strand: '',
    violation: '',
    dutyHours: '',
    personInCharge: '',
    date: '',
    inTime: '',
    outTime: '',
    renderedHours: 0,
    status: 'Pending', 
  });

  useEffect(() => {
    fetchTasks();
    fetchStudents();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/assigntask/tasks/details');
      console.log(response.data); 
      setTasks(response.data); 
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleStudentChange = (studentId) => {
    const student = students.find((student) => student.id === studentId);
    setNewTask((prevTask) => ({
      ...prevTask,
      student_id: studentId,
      studentName: student?.name || '',
      track: student?.track || '',
      strand: student?.strand || '',
    }));
  };

  const handleEditTask = (task) => {
    setNewTask({
      id: task.id,
      student_id: task.student_id,
      track: task.track,
      strand: task.strand,
      task_id: task.task_id,
      taskName: task.taskName,
      violation: task.violation,
      dutyHours: task.dutyHours,
      date: task.date,
      inTime: task.inTime,  
      outTime: task.outTime,  
      personInCharge: task.personInChargeName,
      renderedHours: task.renderedHours,
      status: task.status,
    });
  };

  const handleLogHours = (task) => {
    setSelectedTask(task);
    setLoggedHours(''); 
    setShowLogModal(true);
  };

  const saveLoggedHours = async (taskId, renderedHours) => {
    console.log('Saving Task ID:', taskId, 'Rendered Hours:', renderedHours);
    try {
      const response = await axios.post('http://localhost:3001/assigntask/tasks/log-hours', {
        id: taskId,
        renderedHours: renderedHours,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === response.data.id
            ? {
                ...task,
                renderedHours: response.data.renderedHours, 
                dutyHours: response.data.dutyHours, 
                status: response.data.status, 
              }
            : task
        )
      );

      setShowLogModal(false);
    } catch (error) {
      console.error('Error logging hours:', error);
    }
  };

  const isFormValid = () => {
    return (
      newTask.student_id &&
      newTask.violation &&
      newTask.dutyHours &&
      newTask.personInCharge &&
      newTask.date &&
      newTask.inTime &&
      newTask.outTime
    );
  };

  const handleAddTask = async () => {
    const inTimeManila = moment(newTask.inTime, "HH:mm").tz("Asia/Manila").format("HH:mm");
    const outTimeManila = moment(newTask.outTime, "HH:mm").tz("Asia/Manila").format("HH:mm");

    try {
      if (newTask.id) {
        const response = await axios.put(`http://localhost:3001/assigntask/${newTask.id}`, {
          student_id: newTask.student_id,
          violation: newTask.violation,
          dutyHours: newTask.dutyHours,
          personInCharge: newTask.personInCharge,
          date: newTask.date,
          inTime: inTimeManila,
          outTime: outTimeManila,
          track: newTask.track,
          strand: newTask.strand,
          renderedHours: newTask.renderedHours,
          status: newTask.status,
        });

        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === response.data.id ? response.data : task))
        );
      } else {
        const response = await axios.post('http://localhost:3001/assigntask', {
          student_id: newTask.student_id,
          violation: newTask.violation,
          dutyHours: newTask.dutyHours,
          personInCharge: newTask.personInCharge,
          date: newTask.date,
          inTime: inTimeManila,
          outTime: outTimeManila,
          renderedHours: newTask.renderedHours,
          status: newTask.status,
          track: newTask.track,
          strand: newTask.strand,
        });

        setTasks((prevTasks) => [...prevTasks, response.data]);
      }
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3001/assigntask/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const resetForm = () => {
    setNewTask({
      student_id: '',
      studentName: '',
      track: '',
      strand: '',
      violation: '',
      dutyHours: '',
      date: '',
      inTime: '',
      outTime: '',
      personInCharge: '',
      renderedHours: 0, 
      status: 'Pending', 
    });
  };

  return (
    <div className="flex bg-[#f3f3f3]">
    <SuperAdminSideBar />
      <div className="w-full ml-64 p-6">
        <TaskForm 
          newTask={newTask} 
          handleChange={handleChange} 
          handleAddTask={handleAddTask} 
          handleStudentChange={handleStudentChange}
          students={students} 
          setNewTask={setNewTask} 
        />
        <TaskTable 
          tasks={tasks} // Directly pass all tasks instead of paginated tasks
          onLogHours={handleLogHours} 
          onEditTask={handleEditTask} 
          onDeleteTask={handleDeleteTask}
          fetchTasks={fetchTasks} 
          setNewTask={setNewTask} 
        />

        {showLogModal && (
          <LogHoursModal
            task={selectedTask}
            onClose={() => setShowLogModal(false)}
            onSave={saveLoggedHours}  
          />
        )}
      </div>
    </div>
  );
};

export default ManageStudent;
