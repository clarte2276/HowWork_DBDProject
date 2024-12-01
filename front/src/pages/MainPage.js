// MainPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import TaskDetailModal from '../components/TaskDetailModal';
import '../styles/MainPage.css'; // Import styles

function MainPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5000/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTasks(response.data);
        })
        .catch((error) => {
          console.error('There was an error fetching the tasks!', error);
        });
    }
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  // Helper function to validate and format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.error(`Invalid date: ${dateString}`);
      return '';
    }
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      <Header />
      <div className="matrix-container">
        <div className="axis-label importance-label">중요도 (Importance)</div>
        <div className="axis-label urgency-label">긴급도 (Urgency)</div>
        <div className="matrix-grid">
          {tasks.map((task) => (
            <button
              key={task.task_id}
              className="task-button"
              style={{
                left: `${(((task.urgency - 1) / 9) * 100) * 0.95}%`,
                bottom: `${(((task.importance - 1) / 9) * 100) * 0.95}%`,
              }}
              onClick={() => handleTaskClick(task)}
              title={`Importance: ${task.importance}, Urgency: ${task.urgency}`}
            >
              {task.task_name}
            </button>
          ))}
        </div>
      </div>
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default MainPage;
