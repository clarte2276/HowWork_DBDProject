export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // 토큰이 있으면 true 반환
  };
