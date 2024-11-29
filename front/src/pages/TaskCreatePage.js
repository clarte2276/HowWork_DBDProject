import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
        // 생성 후 다른 페이지로 이동
        navigate('/tasks');
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
