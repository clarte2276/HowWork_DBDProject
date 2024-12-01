// src/pages/TaskListPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/TaskListPage.css'; // Import TaskListPage styles

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const navigate = useNavigate();

  // 로그인 상태 확인 및 페이지 접근 제어
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // 로그인 상태가 아니라면 로그인 페이지로 이동
      } else {
        try {
          const response = await axios.get('http://localhost:5000/tasks', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTasks(response.data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          alert('Failed to fetch tasks. Please try again.');
        }
      }
    };

    fetchTasks();
  }, [navigate]);

  // 정렬 처리 함수
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedTasks = [...tasks].sort((a, b) => {
      // Handle date sorting
      if (key === 'start_date' || key === 'due_date') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        if (dateA < dateB) return direction === 'asc' ? -1 : 1;
        if (dateA > dateB) return direction === 'asc' ? 1 : -1;
        return 0;
      }

      // Handle string and number sorting
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setTasks(sortedTasks);
    setSortConfig({ key, direction });
  };

  // 열기 함수: Edit Modal
  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  // 닫기 함수: Edit Modal
  const closeEditModal = () => {
    setCurrentTask(null);
    setIsEditModalOpen(false);
  };

  // 열기 함수: Delete Confirmation
  const openDeleteConfirm = (task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmOpen(true);
  };

  // 닫기 함수: Delete Confirmation
  const closeDeleteConfirm = () => {
    setTaskToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  // 수정 제출 처리
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      navigate('/login');
      return;
    }

    // 데이터 수집
    const updatedTask = {
      task_name: e.target.task_name.value,
      start_date: e.target.start_date.value,
      due_date: e.target.due_date.value,
      importance: parseInt(e.target.importance.value),
      urgency: parseFloat(e.target.urgency.value),
      description: e.target.description.value,
    };

    // 유효성 검사
    if (
      !updatedTask.task_name ||
      !updatedTask.start_date ||
      !updatedTask.due_date ||
      isNaN(updatedTask.importance) ||
      isNaN(updatedTask.urgency)
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${currentTask.task_id}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // 업데이트된 작업을 상태에 반영
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === currentTask.task_id
              ? { ...task, ...updatedTask }
              : task
          )
        );
        alert('Task updated successfully.');
        closeEditModal();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  // 삭제 처리
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/tasks/${taskToDelete.task_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // 삭제된 작업을 상태에서 제거
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.task_id !== taskToDelete.task_id)
        );
        alert('Task deleted successfully.');
        closeDeleteConfirm();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Helper function to validate and format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.error(`Invalid date: ${dateString}`);
      return '';
    }
    return date.toLocaleDateString();
  };

  // Handle change for range sliders (Optional: To display current value)
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  return (
    <div>
      <Header />
      <div className="task-list-container">
        <h1>Task List</h1>
        <table className="task-list-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('task_name')}>Task Name</th>
              <th onClick={() => handleSort('start_date')}>Start Date</th>
              <th onClick={() => handleSort('due_date')}>Due Date</th>
              <th onClick={() => handleSort('importance')}>Importance</th>
              <th onClick={() => handleSort('urgency')}>Urgency</th>
              <th>Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="8">No tasks available.</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.task_id}>
                  <td>{task.task_name}</td>
                  <td>{formatDate(task.start_date)}</td>
                  <td>{formatDate(task.due_date)}</td>
                  <td>{task.importance}</td>
                  <td>{task.urgency}</td>
                  <td>{task.description}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => openEditModal(task)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => openDeleteConfirm(task)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && currentTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                Task Name:
                <input
                  type="text"
                  name="task_name"
                  defaultValue={currentTask.task_name}
                  required
                />
              </label>
              <label>
                Start Date:
                <input
                  type="date"
                  name="start_date"
                  defaultValue={currentTask.start_date.slice(0, 10)} // Ensure YYYY-MM-DD format
                  required
                />
              </label>
              <label>
                Due Date:
                <input
                  type="date"
                  name="due_date"
                  defaultValue={currentTask.due_date.slice(0, 10)} // Ensure YYYY-MM-DD format
                  required
                />
              </label>
              <label htmlFor="importance">
                Importance: {currentTask.importance}
              </label>
              <input
                type="range"
                id="importance"
                name="importance"
                min="0"
                max="10"
                step="0.5"
                value={currentTask.importance}
                onChange={handleRangeChange}
                required
              />
              <br />
              <label htmlFor="urgency">
                Urgency: {currentTask.urgency}
              </label>
              <input
                type="range"
                id="urgency"
                name="urgency"
                min="0"
                max="10"
                step="0.5"
                value={currentTask.urgency}
                onChange={handleRangeChange}
                required
              />
              <br />
              <label>
                Description:
                <textarea
                  name="description"
                  defaultValue={currentTask.description}
                ></textarea>
              </label>
              <div className="modal-buttons">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && taskToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the task "
              <strong>{taskToDelete.task_name}</strong>"?
            </p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleDelete}>
                Yes
              </button>
              <button
                className="cancel-button"
                onClick={closeDeleteConfirm}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskListPage;
