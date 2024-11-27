const express = require('express');
const connectDB = require('./db/connection');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// MongoDB 연결
connectDB();

// Middleware 설정
app.use(cors());
app.use(bodyParser.json());

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 에러가 발생했습니다.' });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Express 서버 실행 중: http://localhost:${PORT}`);
});
