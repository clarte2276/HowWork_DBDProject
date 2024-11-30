// TaskCreatePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/TaskCreatePage.css'; // TaskCreatePage 스타일을 import

function TaskCreatePage() {
  const [task, setTask] = useState({
    taskName: '',
    startDate: '',
    dueDate: '',
    importance: 5,
    urgency: 5,
    description: ''
  });

  const navigate = useNavigate();

  // 로그인 상태 확인 및 페이지 접근 제어
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // 로그인 상태가 아니라면 로그인 페이지로 이동
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // JWT 토큰을 가져옴

    // 요청 헤더에 토큰 추가
    axios.post('http://localhost:5000/tasks', task, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Task Created:', response.data);
        // 성공 팝업 띄우기
        alert('Task created successfully!');
      })
      .catch((error) => {
        console.error('There was an error creating the task!', error);
        // 실패 팝업 띄우기
        alert('Failed to create task. Please try again.');
      });
  };

  return (
    <div>
      <Header />
      <div className="task-create-container">
        <form className="task-create-form" onSubmit={handleSubmit}>
          <h1>Create Task</h1>
          <input type="text" name="taskName" placeholder="Task Name" onChange={handleChange} required /><br />
          <input type="date" name="startDate" onChange={handleChange} required /><br />
          <input type="date" name="dueDate" onChange={handleChange} required /><br />
          
          <label htmlFor="importance">Importance: {task.importance}</label>
          <input
            type="range"
            id="importance"
            name="importance"
            min="1"
            max="10"
            value={task.importance}
            onChange={handleChange}
          /><br />

          <label htmlFor="urgency">Urgency: {task.urgency}</label>
          <input
            type="range"
            id="urgency"
            name="urgency"
            min="1"
            max="10"
            value={task.urgency}
            onChange={handleChange}
          /><br />

          <textarea name="description" placeholder="Description" onChange={handleChange}></textarea><br />
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
}

export default TaskCreatePage;
