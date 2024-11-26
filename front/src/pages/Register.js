import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('회원가입 성공!');
    } catch (err) {
      alert('회원가입 실패: ' + err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
      <button type="submit">회원가입</button>
    </form>
  );
}

export default Register;
