import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function MyPageButton() {
  const navigate = useNavigate();

  const handleMyPageClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // 로그인 상태가 아니면 로그인 페이지로 이동
    } else {
      navigate("/my-page"); // 로그인 상태면 마이페이지로 이동
    }
  };

  return (
    <button className="header-button" onClick={handleMyPageClick}>
      <FaUserCircle size={20} />
    </button>
  );
}

export default MyPageButton;
