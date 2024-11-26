import React, { useState } from 'react';
import axios from 'axios';

function AddTask() {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    importance: '',
    urgency: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/tasks/add-task', formData);
      alert('Task 추가 성공!');
      console.log(response.data);
    } catch (err) {
      alert('Task 추가 실패: ' + err.message);
    }
  };

  return (
    <div>
      <h1>Task 추가</h1>
      <form onSubmit={handleSubmit}>
        <label>이름: </label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <br />
        <label>시작 날짜: </label>
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        <br />
        <label>종료 날짜: </label>
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        <br />
        <label>중요도: </label>
        <input type="number" name="importance" value={formData.importance} onChange={handleChange} required />
        <br />
        <label>긴급도: </label>
        <input type="number" name="urgency" value={formData.urgency} onChange={handleChange} required />
        <br />
        <label>설명: </label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
        <br />
        <button type="submit">추가</button>
      </form>
    </div>
  );
}

export default AddTask;
