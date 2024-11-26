const express = require('express');
const Task = require('../models/task');

const router = express.Router();

// POST 요청: Task 추가
router.post('/add-task', async (req, res) => {
  try {
    console.log('데이터 요청 수신:', req.body); // 요청 데이터 확인
    const task = new Task(req.body);
    const savedTask = await task.save();
    console.log('저장된 데이터:', savedTask); // MongoDB에 저장된 데이터 확인
    res.status(201).send({ message: 'Task 추가 성공', task: savedTask });
  } catch (err) {
    console.error('Task 저장 실패:', err.message);
    res.status(400).send({ error: 'Task 추가 실패', message: err.message });
  }
});

module.exports = router;
