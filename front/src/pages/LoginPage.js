import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

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
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="user_id" placeholder="User ID" onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/register')}>Go to Register Page</button>
    </div>
  );
}

export default LoginPage;
