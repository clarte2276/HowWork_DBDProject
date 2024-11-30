//TaskListPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/TaskListPage.css'; // TaskListPage 스타일을 import

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const navigate = useNavigate();

  // 로그인 상태 확인 및 페이지 접근 제어
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // 로그인 상태가 아니라면 로그인 페이지로 이동
    } else {
      // tasks 데이터 가져오기
      axios
        .get('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setTasks(response.data);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          alert('Failed to fetch tasks. Please try again.');
        });
    }
  }, [navigate]);

  // 정렬 처리 함수
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedTasks = [...tasks].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setTasks(sortedTasks);
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <Header />
      <div className="task-list-container">
        <h1>Task List</h1>
        <table className="task-list-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('task_name')}>Task Name</th>
              <th onClick={() => handleSort('start_date')}>Start Date</th>
              <th onClick={() => handleSort('due_date')}>Due Date</th>
              <th onClick={() => handleSort('importance')}>Importance</th>
              <th onClick={() => handleSort('urgency')}>Urgency</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.task_id}>
                <td>{task.task_name}</td>
                <td>{new Date(task.start_date).toLocaleDateString()}</td>
                <td>{new Date(task.due_date).toLocaleDateString()}</td>
                <td>{task.importance}</td>
                <td>{task.urgency}</td>
                <td>{task.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskListPage;
