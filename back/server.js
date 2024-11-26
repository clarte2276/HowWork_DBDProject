const express = require('express');
const connectDB = require('./db/connection');
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

// Task 라우터 사용
app.use('/api/tasks', taskRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Express 서버 실행 중: http://localhost:${PORT}`);
});
