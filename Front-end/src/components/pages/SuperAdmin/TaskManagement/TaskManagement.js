import React, { useState } from 'react';
import Modal from 'react-modal';  // Import modal library

Modal.setAppElement('#root'); // For accessibility purposes

function TaskManagement() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Clean School Grounds', assignedStudents: ['John'], requiredHours: 8, renderedHours: 4, status: 'Pending' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal open state
  const [newTask, setNewTask] = useState({ name: '', assignedStudents: '', requiredHours: 0, renderedHours: 0 });

  // Handle Create Task Modal
  const handleOpenModal = () => {
    setNewTask({ name: '', assignedStudents: '', requiredHours: 0, renderedHours: 0 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTask = () => {
    setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Community Service Tasks</h2>

      {/* Create Task Button */}
      <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={handleOpenModal}>
        Create Task
      </button>

      {/* Task Table */}
      <table className="min-w-full bg-white">
        {/* ...same as before */}
      </table>

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className="modal">
        <h2 className="text-xl font-bold mb-4">Create Task</h2>
        <form>
          <label className="block mb-2">Task Name</label>
          <input type="text" value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} className="border p-2 w-full mb-4" />

          <label className="block mb-2">Assigned Students</label>
          <input type="text" value={newTask.assignedStudents} onChange={(e) => setNewTask({ ...newTask, assignedStudents: e.target.value.split(', ') })} className="border p-2 w-full mb-4" />

          <label className="block mb-2">Required Hours</label>
          <input type="number" value={newTask.requiredHours} onChange={(e) => setNewTask({ ...newTask, requiredHours: e.target.value })} className="border p-2 w-full mb-4" />

          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateTask}>
            Save Task
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default TaskManagement;
