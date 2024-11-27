const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // 인증 미들웨어

const router = express.Router();

// Task 추가
router.post('/add', auth, async (req, res) => {
  const { name, startDate, endDate, importance, urgency, description } = req.body;

  try {
    // 새로운 Task 생성
    const task = new Task({
      userId: req.user.userId, // 로그인된 유저 ID
      name,
      startDate,
      endDate,
      importance,
      urgency,
      description,
    });

    await task.save(); // MongoDB에 저장
    res.status(201).json({ message: 'Task 추가 성공', task });
  } catch (err) {
    console.error('Task 추가 실패:', err.message);
    res.status(500).json({ error: 'Task 추가 실패', message: err.message });
  }
});

// Task 조회
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }); // 로그인된 유저의 Task만 조회
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Task 조회 실패:', err.message);
    res.status(500).json({ error: 'Task 조회 실패', message: err.message });
  }
});

module.exports = router;
