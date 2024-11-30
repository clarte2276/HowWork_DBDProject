// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/LoginPage.css'; // LoginPage 스타일을 import

function LoginPage() {
  const [formData, setFormData] = useState({ user_id: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      navigate('/my-page');
    } catch (error) {
      alert('Login failed!');
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <input type="text" name="user_id" placeholder="User ID" onChange={handleChange} required /><br />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
          <button type="submit">Login</button>
          <button className="register-link" onClick={() => navigate('/register')}>Go to Register Page</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
