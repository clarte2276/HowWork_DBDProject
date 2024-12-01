// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use environment variables for secrets
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

// In-memory store for refresh tokens (Consider using a database or Redis for production)
let refreshTokens = [];

app.use(cors());
app.use(express.json());

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);

  res.on('finish', () => {
    console.log(`Response: ${res.statusCode} ${res.statusMessage} - ${new Date().toISOString()}`);
  });

  next();
});

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASS || 'xendpep0097!@', // Use environment variable or default
  database: 'howwork'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.error('No token provided');
    return res.sendStatus(401); // No token, unauthorized
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => { // Use ACCESS_TOKEN_SECRET
    if (err) {
      console.error('Invalid token:', err);
      return res.sendStatus(403); // Invalid token, forbidden
    }
    req.user = user; // Store user info in request
    next();
  });
};

// Registration API
app.post('/register', (req, res) => {
  const { user_id, password, username } = req.body;

  // Check for duplicate user
  const checkUserQuery = `SELECT * FROM users WHERE user_id = ?`;
  db.query(checkUserQuery, [user_id], (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'User ID already exists' }); // 409: Conflict
    }

    // Hash password and register user
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const insertQuery = `INSERT INTO users (user_id, password, username) VALUES (?, ?, ?)`;
      db.query(insertQuery, [user_id, hash, username], (err, result) => {
        if (err) {
          console.error('Error in registering user:', err);
          return res.status(500).json({ error: 'Error in registering user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});

// Login API
app.post('/login', (req, res) => {
  const { user_id, password } = req.body;

  const query = `SELECT * FROM users WHERE user_id = ?`;
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = { user_id: results[0].user_id };

      // Generate Access Token
      const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      // Generate Refresh Token
      const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      refreshTokens.push(refreshToken); // Store refresh token

      res.json({ message: 'Login successful', accessToken, refreshToken });
    });
  });
});

// Token Refresh API
app.post('/token', (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken == null) {
    return res.status(401).json({ error: 'Refresh Token Required' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Invalid Refresh Token' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error('Invalid Refresh Token:', err);
      return res.status(403).json({ error: 'Invalid Refresh Token' });
    }

    const newAccessToken = jwt.sign({ user_id: user.user_id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ accessToken: newAccessToken });
  });
});

// Logout API
app.post('/logout', (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken == null) {
    return res.status(400).json({ error: 'Refresh Token Required' });
  }

  refreshTokens = refreshTokens.filter(token => token !== refreshToken);

  res.status(204).send(); // No Content
});

// Get User Info API (Protected Route)
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

// Create Task API (Protected Route)
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

  // Validate required fields
  if (!task_name || !start_date || !due_date || importance == null || urgency == null) {
    console.error('Missing required task fields');
    return res.status(400).json({ error: 'Missing required task fields' });
  }

  // Validate importance and urgency (0-10)
  if (importance < 0 || importance > 10 || urgency < 0 || urgency > 10) {
    console.error('Importance and Urgency must be between 0 and 10');
    return res.status(400).json({ error: 'Importance and Urgency must be between 0 and 10' });
  }

  // Validate dates
  const startDate = new Date(start_date);
  const dueDate = new Date(due_date);
  if (isNaN(startDate) || isNaN(dueDate)) {
    console.error('Invalid date format');
    return res.status(400).json({ error: 'Invalid date format' });
  }

  if (startDate > dueDate) {
    console.error('Start date cannot be after due date');
    return res.status(400).json({ error: 'Start date cannot be after due date' });
  }

  const insertQuery = `
    INSERT INTO tasks (user_id, task_name, start_date, due_date, importance, urgency, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(insertQuery, [user_id, task_name, start_date, due_date, importance, urgency, description], (err, result) => {
    if (err) {
      console.error('Error in creating task:', err);
      return res.status(500).json({ error: 'Error in creating task' });
    }
    res.status(201).json({ message: 'Task created successfully', task_id: result.insertId });
  });
});

// Get Tasks API (Protected Route)
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

// Update Task API (Protected Route)
app.put('/tasks/:task_id', authenticateToken, (req, res) => {
  const { task_id } = req.params;
  const { task_name, start_date, due_date, importance, urgency, description } = req.body;
  const user_id = req.user.user_id;

  // Check if the task exists and belongs to the user
  const checkTaskQuery = `SELECT * FROM tasks WHERE task_id = ? AND user_id = ?`;
  db.query(checkTaskQuery, [task_id, user_id], (err, results) => {
    if (err) {
      console.error('Error checking task existence:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      // Task does not exist or does not belong to the user
      console.warn(`Task with id ${task_id} not found or access denied for user ${user_id}`);
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    // Validate required fields
    if (!task_name || !start_date || !due_date || importance == null || urgency == null) {
      console.error('Missing required task fields');
      return res.status(400).json({ error: 'Missing required task fields' });
    }

    // Validate importance and urgency (0-10)
    if (importance < 0 || importance > 10 || urgency < 0 || urgency > 10) {
      console.error('Importance and Urgency must be between 0 and 10');
      return res.status(400).json({ error: 'Importance and Urgency must be between 0 and 10' });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const dueDate = new Date(due_date);
    if (isNaN(startDate) || isNaN(dueDate)) {
      console.error('Invalid date format');
      return res.status(400).json({ error: 'Invalid date format' });
    }

    if (startDate > dueDate) {
      console.error('Start date cannot be after due date');
      return res.status(400).json({ error: 'Start date cannot be after due date' });
    }

    // Update task in the database
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

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found or no changes made' });
      }

      // Fetch the updated task to return
      const fetchUpdatedTaskQuery = `SELECT * FROM tasks WHERE task_id = ? AND user_id = ?`;
      db.query(fetchUpdatedTaskQuery, [task_id, user_id], (err, updatedResults) => {
        if (err) {
          console.error('Error fetching updated task:', err);
          return res.status(500).json({ error: 'Error fetching updated task' });
        }

        if (updatedResults.length === 0) {
          return res.status(404).json({ error: 'Task not found after update' });
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedResults[0] });
      });
    });
  });
});

// Delete Task API (Protected Route)
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
