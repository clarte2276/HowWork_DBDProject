import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the tasks!', error);
      });
  }, []);

  return (
    <div>
      <Header />
      <h1>All Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.task_id}>
            {task.task_name} - {task.due_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskListPage;
