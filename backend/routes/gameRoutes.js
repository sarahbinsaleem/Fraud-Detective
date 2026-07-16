const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const {
  getRandomTransaction,
  checkAnswer,
  finishGame,
  getLeaderboard,
  getStatistics,
} = require('../controllers/gameController');

router.get('/transactions/random', requireAuth, getRandomTransaction);
router.post('/game/answer', requireAuth, checkAnswer);
router.post('/game/finish', requireAuth, finishGame);
router.get('/leaderboard', requireAuth, getLeaderboard);
router.get('/statistics', requireAuth, getStatistics);

module.exports = router;
