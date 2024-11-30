import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // 로그인 상태 확인 및 페이지 접근 제어
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // 로그인 상태가 아니라면 로그인 페이지로 이동
    } else {
      console.log('Token found:', token);
      // 로그인된 상태에서만 데이터 요청
      fetchTasks(token);
    }
  }, [navigate]);

  // Task를 불러오는 함수
  const fetchTasks = (token) => {
    axios.get('http://localhost:5000/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Tasks fetched:', response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the tasks!', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token'); // 토큰 삭제
          navigate('/login'); // 로그인 페이지로 이동
        }
      });
  };

  return (
    <div>
      <Header />
      <h1>All Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.task_id}>
              {task.task_name} - {task.due_date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskListPage;
