import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function TaskCreatePage() {
  const [task, setTask] = useState({
    taskName: '',
    startDate: '',
    dueDate: '',
    importance: '',
    urgency: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/tasks', task)
      .then((response) => {
        console.log('Task Created:', response.data);
      })
      .catch((error) => {
        console.error('There was an error creating the task!', error);
      });
  };

  return (
    <div>
      <Header />
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="taskName" placeholder="Task Name" onChange={handleChange} required /><br />
        <input type="date" name="startDate" onChange={handleChange} required /><br />
        <input type="date" name="dueDate" onChange={handleChange} required /><br />
        <input type="number" name="importance" placeholder="Importance" onChange={handleChange} required /><br />
        <input type="number" name="urgency" placeholder="Urgency" onChange={handleChange} required /><br />
        <textarea name="description" placeholder="Description" onChange={handleChange}></textarea><br />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default TaskCreatePage;
