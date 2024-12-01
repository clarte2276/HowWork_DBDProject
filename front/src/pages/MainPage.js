//MainPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import TaskDetailModal from '../components/TaskDetailModal';
import '../styles/MainPage.css'; // 스타일 import

function MainPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
                left: `${(task.urgency / 10) * 90}%`,
                bottom: `${(task.importance / 10) * 90}%`
              }}
              onClick={() => handleTaskClick(task)}
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
