import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function MyPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <div>
      <Header />
      <h1>My Page</h1>
      <p>Welcome to your profile page!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default MyPage;
