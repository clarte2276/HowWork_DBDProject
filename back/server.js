//server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 모든 요청에 대해 로그를 남기는 미들웨어
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);

  res.on('finish', () => {
    console.log(`Response: ${res.statusCode} ${res.statusMessage} - ${new Date().toISOString()}`);
  });

  next();
});

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASS || 'xendpep0097!@', // 환경 변수 사용 또는 기본 값
  database: 'howwork'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.error('No token provided');
    return res.sendStatus(401); // 토큰이 없으면 접근 금지
  }

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) {
      console.error('Invalid token:', err);
      return res.sendStatus(403); // 유효하지 않은 토큰이면 접근 금지
    }
    req.user = user; // 사용자 정보를 요청 객체에 저장
    next();
  });
};

// 회원가입 API
app.post('/register', (req, res) => {
  const { user_id, password, username } = req.body;

  // 중복 사용자 확인
  const checkUserQuery = `SELECT * FROM users WHERE user_id = ?`;
  db.query(checkUserQuery, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'User ID already exists' }); // 409: Conflict
    }

    // 비밀번호 해싱 및 회원가입 처리
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }

      const insertQuery = `INSERT INTO users (user_id, password, username) VALUES (?, ?, ?)`;
      db.query(insertQuery, [user_id, hash, username], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error in registering user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});

// 로그인 API
app.post('/login', (req, res) => {
  const { user_id, password } = req.body;

  const query = `SELECT * FROM users WHERE user_id = ?`;
  db.query(query, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ user_id: results[0].user_id }, 'secret_key', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    });
  });
});

// 유저 정보 조회 API (보호된 라우트)
app.get('/users/me', authenticateToken, (req, res) => {
  const user_id = req.user.user_id;

  const query = `SELECT username FROM users WHERE user_id = ?`;
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching user information:', err);
      return res.status(500).json({ error: 'Error fetching user information' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ username: results[0].username });
  });
});

// Task 생성 API (보호된 라우트)
app.post('/tasks', authenticateToken, (req, res) => {
  const { task_name, start_date, due_date, importance, urgency, description } = req.body;
  const user_id = req.user.user_id;

  console.log('Task data received:', {
    user_id,
    task_name,
    start_date,
    due_date,
    importance,
    urgency,
    description
  });

  const insertQuery = `INSERT INTO tasks (user_id, task_name, start_date, due_date, importance, urgency, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(insertQuery, [user_id, task_name, start_date, due_date, importance, urgency, description], (err, result) => {
    if (err) {
      console.error('Error in creating task:', err);
      return res.status(500).json({ error: 'Error in creating task' });
    }
    res.status(201).json({ message: 'Task created successfully' });
  });
});

// Task 목록 조회 API (보호된 라우트)
app.get('/tasks', authenticateToken, (req, res) => {
  const user_id = req.user.user_id;

  const query = `SELECT * FROM tasks WHERE user_id = ?`;
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Error fetching tasks' });
    }

    console.log('Tasks fetched for user:', user_id, results);
    res.status(200).json(results);
  });
});

// Task 수정 API (보호된 라우트)
app.put('/tasks/:task_id', authenticateToken, (req, res) => {
  const { task_id } = req.params;
  const { task_name, start_date, due_date, importance, urgency, description } = req.body;
  const user_id = req.user.user_id;

  // 먼저, 해당 task가 존재하는지 확인하고 user_id가 일치하는지 검증
  const checkTaskQuery = `SELECT * FROM tasks WHERE task_id = ? AND user_id = ?`;
  db.query(checkTaskQuery, [task_id, user_id], (err, results) => {
    if (err) {
      console.error('Error checking task existence:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      // 해당 task가 없거나 user_id가 일치하지 않는 경우
      console.warn(`Task with id ${task_id} not found or access denied for user ${user_id}`);
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    // Task 업데이트 쿼리 실행
    const updateQuery = `
      UPDATE tasks
      SET task_name = ?, start_date = ?, due_date = ?, importance = ?, urgency = ?, description = ?
      WHERE task_id = ? AND user_id = ?
    `;
    db.query(updateQuery, [task_name, start_date, due_date, importance, urgency, description, task_id, user_id], (err, result) => {
      if (err) {
        console.error('Error updating task:', err);
        return res.status(500).json({ error: 'Error updating task' });
      }

      res.status(200).json({ message: 'Task updated successfully' });
    });
  });
});


// Task 삭제 API (보호된 라우트)
app.delete('/tasks/:task_id', authenticateToken, (req, res) => {
  const { task_id } = req.params;
  const user_id = req.user.user_id;

  const deleteQuery = `DELETE FROM tasks WHERE task_id = ? AND user_id = ?`;
  db.query(deleteQuery, [task_id, user_id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ error: 'Error deleting task' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
