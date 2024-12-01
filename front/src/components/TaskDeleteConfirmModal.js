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
        <h2 className="form-title">삭제 확인</h2>
        <p>
          "<strong>{task.task_name}</strong>"을 삭제 하시겠습니까?
        </p>
        <div className="modal-buttons">
          <button className="form-button confirm-button" onClick={handleConfirm}>
            예
          </button>
          <button className="modal-close-button" onClick={handleClose}>
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDeleteConfirmModal;
