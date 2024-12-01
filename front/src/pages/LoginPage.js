// src/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css'; // Form.css 파일 import
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
      {/* 헤더를 별도의 div로 감쌈 */}
      <div className="header-container">
        <Header />
      </div>

      {/* Form.css의 form-container 클래스 적용 */}
      <div className="form-container">
        <h2 className="form-title">로그인</h2>
        <form className="form" onSubmit={handleLogin}>
          <label className="form-label">
            사용자 ID:
            <input
              type="text"
              className="form-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            비밀번호:
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="form-button">
            로그인
          </button>
          <button
            type="button"
            className="form-secondary-button"
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
