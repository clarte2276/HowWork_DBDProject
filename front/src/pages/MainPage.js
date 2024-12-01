// src/pages/MainPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TaskDetailModal from '../components/TaskDetailModal';
import TaskEditModal from '../components/TaskEditModal';
import TaskDeleteConfirmModal from '../components/TaskDeleteConfirmModal';
import '../styles/MainPage.css'; // Import styles
import { calculateCalcUrgency } from '../utils/utils'; // Import the utility function

function MainPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch tasks on component mount and set up interval for dynamic urgency updates
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect unauthenticated users to login
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasksWithCalcUrgency = response.data.map(task => ({
          ...task,
          calc_urgency: calculateCalcUrgency(task.urgency, task.start_date, task.due_date)
        }));

        setTasks(tasksWithCalcUrgency);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to fetch tasks. Please try again.');
      }
    };

    fetchTasks();

    // Refresh tasks every hour to update urgency dynamically
    const interval = setInterval(fetchTasks, 60 * 60 * 1000);
    return () => clearInterval(interval); // Clean up on unmount
  }, [navigate]);

  // Handle sorting (if implemented)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedTasks = [...tasks].sort((a, b) => {
      // Handle date sorting
      if (key === 'start_date' || key === 'due_date') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        if (dateA < dateB) return direction === 'asc' ? -1 : 1;
        if (dateA > dateB) return direction === 'asc' ? 1 : -1;
        return 0;
      }

      // Handle string and number sorting
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setTasks(sortedTasks);
    setSortConfig({ key, direction });
  };

  // Open Task Detail Modal
  const openTaskDetailModal = (task) => {
    setSelectedTask(task);
  };

  // Close Task Detail Modal
  const closeTaskDetailModal = () => {
    setSelectedTask(null);
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setCurrentTask(null);
    setIsEditModalOpen(false);
  };

  // Open Delete Confirmation Modal
  const openDeleteConfirmModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmOpen(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteConfirmModal = () => {
    setTaskToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  // Handle Task Edit Submission
  const handleEditSubmit = async (updatedTask) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${currentTask.task_id}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedTaskFromServer = response.data.task;
        // Update task in state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === currentTask.task_id
              ? { ...task, ...updatedTaskFromServer, calc_urgency: calculateCalcUrgency(updatedTaskFromServer.urgency, updatedTaskFromServer.start_date, updatedTaskFromServer.due_date) }
              : task
          )
        );
        alert('Task updated successfully.');
        closeEditModal();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  // Handle Task Deletion
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/tasks/${taskToDelete.task_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Remove deleted task from state
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.task_id !== taskToDelete.task_id)
        );
        alert('Task deleted successfully.');
        closeDeleteConfirmModal();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.error(`Invalid date: ${dateString}`);
      return '';
    }
    return date.toLocaleDateString();
  };

  return (
    <div>
      <Header />
      <div className="matrix-container">
        <div className="axis-label importance-label">중요도</div>
        <div className="axis-label urgency-label">긴급도</div>
        <div className="matrix-grid">
          {tasks.map((task) => (
            <button
              key={task.task_id}
              className="task-button"
              data-urgency={task.calc_urgency} // Add data attribute for styling if needed
              style={{
                left: `${(task.calc_urgency / 10) * 95}%`, // 0-10 maps to 0%-100%
                bottom: `${(task.importance / 10) * 95}%`, // 0-10 maps to 0%-100%
              }}
              onClick={() => openTaskDetailModal(task)}
              title={`Importance: ${task.importance}, Urgency: ${task.calc_urgency}`}
            >
              {task.task_name}
            </button>
          ))}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={closeTaskDetailModal}
          onEdit={() => openEditModal(selectedTask)}
          onDelete={() => openDeleteConfirmModal(selectedTask)}
        />
      )}

      {/* Task Edit Modal */}
      {isEditModalOpen && currentTask && (
        <TaskEditModal
          task={currentTask}
          onClose={closeEditModal}
          onSave={handleEditSubmit}
        />
      )}

      {/* Task Delete Confirmation Modal */}
      {isDeleteConfirmOpen && taskToDelete && (
        <TaskDeleteConfirmModal
          task={taskToDelete}
          onClose={closeDeleteConfirmModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default MainPage;
