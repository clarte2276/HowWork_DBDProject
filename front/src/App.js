import React from "react";
import "./App.css";
// react-icons에서 필요한 아이콘 가져오기
import { FaPlus, FaList, FaUserCircle } from "react-icons/fa";

// React Router import
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// 페이지 컴포넌트 import
import AddTask from "./pages/AddTask";
import TaskList from "./pages/TaskList";
import MyPage from "./pages/MyPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute"; // PrivateRoute 추가

function App() {
  return (
    <Router>
      {/* 라우팅에 따라 렌더링할 컴포넌트 */}
      <Routes>
        {/* 메인 페이지 */}
        <Route
          path="/"
          element={
            <div className="main-container">
              <div className="arrow up"></div>
              <div className="arrow right"></div>

              {/* Header Section with Buttons */}
              <div className="header">
                <Link to="/add-task">
                  <button className="header-button">
                    <FaPlus size={20} />
                  </button>
                </Link>
                <Link to="/task-list">
                  <button className="header-button">
                    <FaList size={20} />
                  </button>
                </Link>
                <Link to="/my-page">
                  <button className="header-button">
                    <FaUserCircle size={20} />
                  </button>
                </Link>
              </div>

              {/* Quadrant Layout */}
              <div className="quadrant-container">
                <div className="quadrant top-left">Top Left</div>
                <div className="quadrant top-right">Top Right</div>
                <div className="quadrant bottom-left">Bottom Left</div>
                <div className="quadrant bottom-right">Bottom Right</div>
              </div>
            </div>
          }
        />

        {/* 페이지 라우트 */}
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/task-list" element={<TaskList />} />
        <Route
          path="/my-page"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
