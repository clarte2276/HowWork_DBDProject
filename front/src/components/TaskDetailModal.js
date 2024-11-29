import React from 'react';

function TaskDetailModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{task.taskName}</h2>
        <p>Start Date: {task.startDate}</p>
        <p>Due Date: {task.dueDate}</p>
        <p>Importance: {task.importance}</p>
        <p>Urgency: {task.urgency}</p>
        <p>Description: {task.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default TaskDetailModal;
