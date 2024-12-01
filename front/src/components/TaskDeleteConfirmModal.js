// src/components/TaskDeleteConfirmModal.js

import React from 'react';
import '../styles/Form.css'; // Form.css 파일 import

function TaskDeleteConfirmModal({ task, onClose, onConfirm }) {
  if (!task) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="form-container modal-content">
        <h2 className="form-title">Confirm Deletion</h2>
        <p>
          Are you sure you want to delete the task "<strong>{task.task_name}</strong>"?
        </p>
        <div className="modal-buttons">
          <button className="form-button confirm-button" onClick={handleConfirm}>
            Yes
          </button>
          <button className="modal-close-button" onClick={handleClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDeleteConfirmModal;
