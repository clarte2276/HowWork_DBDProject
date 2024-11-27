const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.error('Authorization 헤더 없음');
    return res.status(401).json({ error: '토큰이 없습니다.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = { userId: decoded.userId }; // userId만 저장
    next();
  } catch (err) {
    console.error('JWT 검증 실패:', err.message);
    res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
};

module.exports = auth;
