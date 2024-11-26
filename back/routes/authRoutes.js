const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // JWT 시크릿 키

// 회원가입 API
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 이미 존재하는 이메일 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });

    // 새 유저 생성 및 저장
    const newUser = new User({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: '회원가입 성공!' });
  } catch (err) {
    res.status(500).json({ error: '회원가입 실패', message: err.message });
  }
});

// 로그인 API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 유저 확인
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: '등록되지 않은 이메일입니다.' });

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });

    // JWT 생성
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: '로그인 실패', message: err.message });
  }
});

module.exports = router;
