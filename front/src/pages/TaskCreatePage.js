// TaskCreatePage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/TaskCreatePage.css'; // Import styles

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

    // Transform camelCase to snake_case
    const formattedTask = {
      task_name: task.taskName,
      start_date: task.startDate,
      due_date: task.dueDate,
      importance: task.importance,
      urgency: task.urgency,
      description: task.description
    };

    // 요청 헤더에 토큰 추가
    axios.post('http://localhost:5000/tasks', formattedTask, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Task Created:', response.data);
        // 성공 팝업 띄우기
        alert('Task created successfully!');
        navigate('/'); // Redirect to main page or another appropriate page
      })
      .catch((error) => {
        console.error('There was an error creating the task!', error);
        if (error.response && error.response.data && error.response.data.error) {
          alert(`Failed to create task: ${error.response.data.error}`);
        } else {
          alert('Failed to create task. Please try again.');
        }
      });
  };

  return (
    <div>
      <Header />
      <div className="task-create-container">
        <form className="task-create-form" onSubmit={handleSubmit}>
          <h1>일정 만들기</h1>
          <input
            type="text"
            name="taskName"
            placeholder="일정 이름"
            value={task.taskName}
            onChange={handleChange}
            required
          /><br />
          <input
            type="date"
            name="startDate"
            value={task.startDate}
            onChange={handleChange}
            required
          /><br />
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            required
          /><br />

          <label htmlFor="importance">중요도: {task.importance}</label>
          <input
            type="range"
            id="importance"
            name="importance"
            min="1"
            max="10"
            value={task.importance}
            onChange={handleChange}
          /><br />

          <label htmlFor="urgency">긴급도: {task.urgency}</label>
          <input
            type="range"
            id="urgency"
            name="urgency"
            min="1"
            max="10"
            value={task.urgency}
            onChange={handleChange}
          /><br />

          <textarea
            name="description"
            placeholder="일정 상세 설명"
            value={task.description}
            onChange={handleChange}
          ></textarea><br />
          <button type="submit">만들기</button>
        </form>
      </div>
    </div>
  );
}

export default TaskCreatePage;
