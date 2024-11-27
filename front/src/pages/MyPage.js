import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/MyPage.css"; // 스타일 파일 연결

function MyPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    navigate("/login"); // 로그인 페이지로 리디렉션
  };

  const handleBackToMain = () => {
    navigate("/"); // 메인 페이지로 리디렉션
  };

  return (
    <div className="my-page-container">
      <h1>My Page</h1>
      <p>Welcome to your personal page!</p>
      <div className="button-container">
        <button className="logout-button" onClick={handleLogout}>
          로그아웃
        </button>
        <button className="main-page-button" onClick={handleBackToMain}>
          메인 페이지로
        </button>
      </div>
    </div>
  );
}

export default MyPage;