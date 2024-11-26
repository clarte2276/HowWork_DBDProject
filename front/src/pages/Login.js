import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token); // 토큰 저장
      alert('로그인 성공!');
    } catch (err) {
      alert('로그인 실패: ' + err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
      <button type="submit">로그인</button>
    </form>
  );
}

export default Login;
