import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import TaskCreatePage from './pages/TaskCreatePage';
import TaskListPage from './pages/TaskListPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/create-task" element={<TaskCreatePage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/my-page" element={<MyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
