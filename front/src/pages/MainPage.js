// src/pages/MainPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import TaskDetailModal from '../components/TaskDetailModal';
import '../styles/MainPage.css'; // Import styles
import { calculateCalcUrgency } from '../utils/utils'; // Import the utility function

function MainPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/tasks', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const tasksWithCalcUrgency = response.data.map(task => ({
            ...task,
            calc_urgency: calculateCalcUrgency(task.urgency, task.start_date, task.due_date)
          }));

          setTasks(tasksWithCalcUrgency);
        } catch (error) {
          console.error('There was an error fetching the tasks!', error);
        }
      }
    };

    fetchTasks();

    // Optional: Refresh every hour to update urgency dynamically
    const interval = setInterval(fetchTasks, 60 * 60 * 1000);
    return () => clearInterval(interval); // Clean up on unmount
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
              data-urgency={task.calc_urgency} // Add data attribute for styling
              style={{
                left: `${((task.calc_urgency - 1) / 9) * 100}%`,
                bottom: `${((task.importance - 1) / 9) * 100}%`,
              }}
              onClick={() => handleTaskClick(task)}
              title={`Importance: ${task.importance}, Urgency: ${task.calc_urgency}`}
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
