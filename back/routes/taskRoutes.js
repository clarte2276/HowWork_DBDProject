const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // 인증 미들웨어

const router = express.Router();

// Task 생성
router.post('/add-task', auth, async (req, res) => {
  try {
    const task = new Task({
      userId: req.user.userId, // 로그인된 유저 ID 추가
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      importance: req.body.importance,
      urgency: req.body.urgency,
      description: req.body.description,
    });
    await task.save();
    res.status(201).json({ message: 'Task 추가 성공', task });
  } catch (err) {
    res.status(500).json({ error: 'Task 추가 실패', message: err.message });
  }
});

// 특정 유저의 Task 조회
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }); // 로그인된 유저 ID로 필터링
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Task 조회 실패', message: err.message });
  }
});

module.exports = router;
