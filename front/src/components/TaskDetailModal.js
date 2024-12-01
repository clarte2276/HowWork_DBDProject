// src/components/TaskDetailModal.js

import React from 'react';
import '../styles/Form.css'; // Form.css 파일 import

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
      <div className="form-container modal-content">
        <h2 className="form-title">일정 상세 내용</h2>
        <table className="task-detail-table">
          <tbody>
            <tr>
              <td>일정 이름 : </td>
              <td>{task.task_name}</td>
            </tr>
            <tr>
              <td>시작 날짜 : </td>
              <td>{task.start_date ? new Date(task.start_date).toLocaleDateString() : ''}</td>
            </tr>
            <tr>
              <td>종료 날짜 : </td>
              <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}</td>
            </tr>
            <tr>
              <td>중요도 : </td>
              <td>{task.importance !== undefined && task.importance !== null ? task.importance : '0'}</td>
            </tr>
            <tr>
              <td>긴급도 : </td>
              <td>{task.urgency !== undefined && task.urgency !== null ? task.urgency : '0'}</td>
            </tr>
            <tr>
              <td>상세 정보 : </td>
              <td>{task.description || ''}</td>
            </tr>
          </tbody>
        </table>
        <div className="modal-buttons">
          <button className="form-button edit-button" onClick={handleEdit}>수정</button>
          <button className="form-button delete-button" onClick={handleDelete}>삭제</button>
          <button className="modal-close-button" onClick={handleClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;
