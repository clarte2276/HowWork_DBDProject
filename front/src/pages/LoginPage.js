// src/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // 스타일 파일 import
import Header from '../components/Header';

function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        user_id: userId,
        password: password,
      });

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;

        // 토큰을 localStorage에 저장
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        alert('로그인 성공!');
        navigate('/my-page'); // 로그인 후 마이 페이지로 이동
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // 회원가입 페이지로 이동
  };

  return (
    <div>
    <Header />
    <div className="login-container">
      <h2>로그인</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label>
          사용자 ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </label>
        <label>
          비밀번호:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">로그인</button>
        <button
          type="button"
          className="register-link"
          onClick={handleRegisterRedirect}
        >
          회원가입
        </button>
      </form>
    </div>
    </div>
  );
}

export default LoginPage;
