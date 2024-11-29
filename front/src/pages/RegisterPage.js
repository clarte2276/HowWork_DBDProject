import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function RegisterPage() {
  const [formData, setFormData] = useState({ user_id: '', password: '', username: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', formData);
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed!');
    }
  };

  return (
    <div>
      <Header />
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="user_id" placeholder="User ID" onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
