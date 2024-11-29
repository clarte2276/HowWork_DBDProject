// src/pages/MainPage.js

import React from 'react';
import Header from '../components/Header';

function MainPage() {
  return (
    <div>
      <Header />
      <div className="main-content">
        <h1>Welcome to Main Page</h1>
        <p>여기에서 다양한 작업을 관리할 수 있습니다.</p>
      </div>
    </div>
  );
}

export default MainPage;
