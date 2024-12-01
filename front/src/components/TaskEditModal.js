// src/components/TaskEditModal.js

import React, { useState } from 'react';
import '../styles/TaskEditModal.css'; // Import modal styles

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
    <div className="task-edit-container">
      <div className="task-edit-form">
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Task Name:
            <input
              type="text"
              name="task_name"
              value={formData.task_name}
              onChange={handleChange}
              placeholder="Task Name"
              required
            />
          </label>
          <label>
            Start Date:
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Due Date:
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="importance">
            Importance: {formData.importance}
          </label>
          <input
            type="range"
            id="importance"
            name="importance"
            min="0"
            max="10"
            step="1"
            value={formData.importance}
            onChange={handleChange}
            required
          />
          <br />
          <label htmlFor="urgency">
            Urgency: {formData.urgency}
          </label>
          <input
            type="range"
            id="urgency"
            name="urgency"
            min="0"
            max="10"
            step="1"
            value={formData.urgency}
            onChange={handleChange}
            required
          />
          <br />
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            ></textarea>
          </label>
          <div className="modal-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskEditModal;
