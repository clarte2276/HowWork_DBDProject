// src/components/TaskDeleteConfirmModal.js

import React from 'react';
import '../styles/TaskDeleteConfirmModal.css'; // Import modal styles

function TaskDeleteConfirmModal({ task, onClose, onConfirm }) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete the task "<strong>{task.task_name}</strong>"?
        </p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={handleConfirm}>Yes</button>
          <button className="cancel-button" onClick={handleCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default TaskDeleteConfirmModal;
