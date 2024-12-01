// src/components/TaskDetailModal.js

import React from 'react';
import '../styles/TaskDetailModal.css'; // Import modal styles

function TaskDetailModal({ task, onClose, onEdit, onDelete }) {
  if (!task) return null;

  const handleClose = () => {
    onClose();
  };

  const handleEdit = () => {
    onEdit();
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Task Details</h2>
        <table className="task-detail-table">
          <tbody>
            <tr>
              <td>일정 이름:</td>
              <td>{task.task_name}</td>
            </tr>
            <tr>
              <td>시작 날짜:</td>
              <td>{task.start_date ? new Date(task.start_date).toLocaleDateString() : ''}</td>
            </tr>
            <tr>
              <td>종료 날짜:</td>
              <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}</td>
            </tr>
            <tr>
              <td>중요도:</td>
              <td>{task.importance !== undefined && task.importance !== null ? task.importance : '0'}</td>
            </tr>
            <tr>
              <td>긴급도:</td>
              <td>{task.urgency !== undefined && task.urgency !== null ? task.urgency : '0'}</td>
            </tr>
            <tr>
              <td>내용:</td>
              <td>{task.description || ''}</td>
            </tr>
          </tbody>
        </table>
        <div className="modal-buttons">
          <button className="edit-button" onClick={handleEdit}>Edit</button>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
          <button className="close-button" onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;
