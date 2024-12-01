// src/pages/MyPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Form.css'; // Import Form.css for consistent styling

function MyPage() {
  const [username, setUsername] = useState('');
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 이동
    } else {
      // 유저 정보 가져오기
      axios.get('http://localhost:5000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => {
          if (response.data && response.data.username) {
            setUsername(response.data.username); // username 데이터 설정
          } else {
            console.error('User data does not include username.');
          }
        })
        .catch((error) => {
          console.error('Failed to fetch user information:', error);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
          }
        });

      // 일정 가져오기 (7일 이하로 남은 일정만)
      axios.get('http://localhost:5000/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => {
          const today = new Date();
          const tasksDueSoon = response.data.filter((task) => {
            const dueDate = new Date(task.due_date);
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0; // 7일 이하로 남은 일정만 필터링
          });
          setUpcomingTasks(tasksDueSoon);
        })
        .catch((error) => {
          console.error('Failed to fetch tasks:', error);
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <div> 
    <Header />
    <div className="mypage-container">
    
      <div className="mypage-content">
        <h1>마이 페이지</h1>
        <p className="welcome-message">
          {username ? `${username}님 안녕하세요!` : 'Loading user information...'}
        </p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <h2>가까운 일정 (7일 이내)</h2>
        {upcomingTasks.length === 0 ? (
          <p>7일 이내에 일정이 없습니다.</p>
        ) : (
          <ul className="tasks-list">
            {upcomingTasks.map((task) => (
              <li key={task.task_id} className="task-item">
                {task.task_name} - 기한 : {new Date(task.due_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </div>
  );
}

export default MyPage;
