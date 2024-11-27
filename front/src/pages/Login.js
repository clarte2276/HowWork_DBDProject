import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 로그인 API 호출
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token); // 토큰 저장
      alert('로그인 성공!');
      navigate('/my-page'); // 로그인 후 마이페이지로 이동
    } catch (err) {
      alert('로그인 실패: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <button type="submit" className="login-button">로그인</button>
      </form>
      <div className="register-link">
        <p>계정이 없으신가요?</p>
        <Link to="/register">
          <button className="register-button">회원가입</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
