// server.js

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

      const token = jwt.sign({ id: results[0].id }, 'secret_key', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    });
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
