// src/components/Header.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaList, FaUserCircle, FaHome } from 'react-icons/fa';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();

  // 로그인 여부 확인 함수
  const checkLoginAndNavigate = (path) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(path); // 로그인되어 있으면 해당 경로로 이동
    } else {
      navigate('/login'); // 로그인되어 있지 않으면 로그인 페이지로 이동
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="home-button">
          <FaHome size={20} />
        </Link>
      </div>
      <div className="header-right">
        <button onClick={() => checkLoginAndNavigate('/create-task')} className="header-button">
          <FaPlus size={20} />
        </button>
        <button onClick={() => checkLoginAndNavigate('/tasks')} className="header-button">
          <FaList size={20} />
        </button>
        <button onClick={() => checkLoginAndNavigate('/my-page')} className="header-button">
          <FaUserCircle size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
