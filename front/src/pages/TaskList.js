import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        alert('Task를 가져오는 데 실패했습니다: ' + err.message);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h2>나의 Task</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.name}</strong> - {task.startDate} ~ {task.endDate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
