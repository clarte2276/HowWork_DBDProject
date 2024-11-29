// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaList, FaUserCircle, FaHome } from 'react-icons/fa';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="home-button">
          <FaHome size={20} />
        </Link>
      </div>
      <div className="header-right">
        <Link to="/create-task" className="header-button">
          <FaPlus size={20} />
        </Link>
        <Link to="/tasks" className="header-button">
          <FaList size={20} />
        </Link>
        <Link to="/my-page" className="header-button">
          <FaUserCircle size={20} />
        </Link>
      </div>
    </header>
  );
}

export default Header;
