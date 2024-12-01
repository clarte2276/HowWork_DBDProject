// src/components/TaskEditModal.js

import React, { useState } from 'react';
import '../styles/Form.css'; // Form.css 파일 import

function TaskEditModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    task_name: task.task_name || '',
    start_date: task.start_date ? task.start_date.slice(0, 10) : '',
    due_date: task.due_date ? task.due_date.slice(0, 10) : '',
    importance: task.importance !== undefined && task.importance !== null ? task.importance : 0,
    urgency: task.urgency !== undefined && task.urgency !== null ? task.urgency : 0,
    description: task.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 중요도와 긴급도는 정수로 변환
    const newValue = (name === 'importance' || name === 'urgency') ? parseInt(value, 10) : value;
    setFormData(prevData => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="form-container modal-content">
        <h2 className="form-title">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            일정 이름 : 
            <input
              type="text"
              name="task_name"
              className="form-input"
              value={formData.task_name}
              onChange={handleChange}
              placeholder="Task Name"
              required
            />
          </label>
          <label className="form-label">
            시작 날짜 : 
            <input
              type="date"
              name="start_date"
              className="form-input"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-label">
            종료 날짜 : 
            <input
              type="date"
              name="due_date"
              className="form-input"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-label" htmlFor="importance">
            중요도 : {formData.importance}
          </label>
          <input
            type="range"
            id="importance"
            name="importance"
            className="form-range"
            min="0"
            max="10"
            step="1"
            value={formData.importance}
            onChange={handleChange}
            required
          />
          <label className="form-label" htmlFor="urgency">
            시급도 : {formData.urgency}
          </label>
          <input
            type="range"
            id="urgency"
            name="urgency"
            className="form-range"
            min="0"
            max="10"
            step="1"
            value={formData.urgency}
            onChange={handleChange}
            required
          />
          <label className="form-label">
            상세 정보 : 
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            ></textarea>
          </label>
          <div className="modal-buttons">
            <button type="submit" className="form-button">Save</button>
            <button type="button" className="form-secondary-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskEditModal;
