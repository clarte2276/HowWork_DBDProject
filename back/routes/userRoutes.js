const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/mypage', auth, async (req, res) => {
  res.json({ message: 'Welcome to MyPage!', userId: req.user.userId });
});

module.exports = router;
