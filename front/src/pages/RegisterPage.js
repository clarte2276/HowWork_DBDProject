// src/pages/RegisterPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/RegisterPage.css'; // 스타일 파일 import

function RegisterPage() {
  const [formData, setFormData] = useState({ user_id: '', password: '', username: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      if (response.status === 201) { // 회원가입 성공 시 상태 코드 201 확인
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        navigate('/login'); // 로그인 페이지로 이동
      }
    } catch (error) {
      if (error.response) {
        alert(`회원가입 실패: ${error.response.data.error}`);
      } else {
        alert('회원가입 실패: 알 수 없는 오류가 발생했습니다.');
      }
      console.error('회원가입 오류:', error);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <div>
      <Header />

    <div className="register-container">
      
      <h2>회원가입</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          사용자 ID:
          <input
            type="text"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            placeholder="User ID"
            required
          />
        </label>
        <label>
          사용자 이름:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </label>
        <label>
          비밀번호:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </label>
        <button type="submit">회원가입</button>
        <button
          type="button"
          className="login-link"
          onClick={handleLoginRedirect}
        >
          로그인 페이지로 이동
        </button>
      </form>
    </div>
    </div>
  );
}

export default RegisterPage;
