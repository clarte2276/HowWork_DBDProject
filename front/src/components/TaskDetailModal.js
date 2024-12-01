//TaskDetailModal.js

import React from 'react';
import '../styles/TaskDetailModal.css'; // 모달 스타일 import

function TaskDetailModal({ task, onClose }) {
  if (!task) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Task Details</h2>
        <table className="task-detail-table">
          <tbody>
            <tr>
              <td>일정 이름:</td>
              <td>{task.task_name || ''}</td>
            </tr>
            <tr>
              <td>시작 날짜:</td>
              <td>{task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : ''}</td>
            </tr>
            <tr>
              <td>종료 날짜:</td>
              <td>{task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}</td>
            </tr>
            <tr>
              <td>중요도:</td>
              <td>{task.importance || ''}</td>
            </tr>
            <tr>
              <td>긴급도:</td>
              <td>{task.urgency || ''}</td>
            </tr>
            <tr>
              <td>내용:</td>
              <td>{task.description || ''}</td>
            </tr>
          </tbody>
        </table>
        <div className="modal-buttons">
          <button className="close-button" onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;
