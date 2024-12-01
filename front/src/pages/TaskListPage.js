// src/pages/TaskListPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TaskEditModal from '../components/TaskEditModal';
import TaskDeleteConfirmModal from '../components/TaskDeleteConfirmModal';
import '../styles/Form.css';
import '../styles/TaskListPage.css';

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
        navigate('/login');
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

  // 정렬 아이콘을 렌더링하는 함수 추가
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return ''; // 정렬 중이지 않은 경우 아이콘 표시 안 함
    }
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  // 이하 코드 동일...

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

  // 수정 제출 처리 (TaskEditModal에서 처리)
  const handleEditSave = async (updatedTaskData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${currentTask.task_id}`,
        updatedTaskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === currentTask.task_id
              ? { ...task, ...updatedTaskData }
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

  // 삭제 처리 (TaskDeleteConfirmModal에서 처리)
  const handleDeleteConfirm = async () => {
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

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.error(`Invalid date: ${dateString}`);
      return '';
    }
    return date.toLocaleDateString();
  };

  return (
    <div>
      <Header />
      <div className="task-list-container">
        <h1>전체 일정 표</h1>
        <table className="task-list-table">
          <thead>
            <tr>
              {/* 수정된 부분: 정렬 아이콘 추가 */}
              <th onClick={() => handleSort('task_name')}>
                일정 이름 {getSortIcon('task_name')}
              </th>
              <th onClick={() => handleSort('start_date')}>
                시작 날짜 {getSortIcon('start_date')}
              </th>
              <th onClick={() => handleSort('due_date')}>
                종료 날짜 {getSortIcon('due_date')}
              </th>
              <th onClick={() => handleSort('importance')}>
                중요도 {getSortIcon('importance')}
              </th>
              <th onClick={() => handleSort('urgency')}>
                긴급도 {getSortIcon('urgency')}
              </th>
              <th>상세 정보</th>
              <th>편집</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="8">일정이 없습니다.</td>
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
                      className="form-button edit-button"
                      onClick={() => openEditModal(task)}
                    >
                      수정
                    </button>
                  </td>
                  <td>
                    <button
                      className="form-button delete-button"
                      onClick={() => openDeleteConfirm(task)}
                    >
                      삭제
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
        <TaskEditModal
          task={currentTask}
          onClose={closeEditModal}
          onSave={handleEditSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && taskToDelete && (
        <TaskDeleteConfirmModal
          task={taskToDelete}
          onClose={closeDeleteConfirm}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default TaskListPage;
