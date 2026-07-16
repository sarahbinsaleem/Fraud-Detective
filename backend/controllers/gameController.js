const { generateTransaction } = require('../utils/transactionGenerator');
const Score = require('../models/Score');
const User = require('../models/User');

exports.getRandomTransaction = (req, res) => {
  const { difficulty = 'Easy' } = req.query;
  const transaction = generateTransaction(difficulty);
  res.json(transaction);
};

exports.checkAnswer = (req, res) => {
  const { isFraud, answer } = req.body; // answer: "FRAUD" | "SAFE"

  if (typeof isFraud !== 'boolean' || !answer) {
    return res.status(400).json({ message: 'isFraud (boolean) and answer are required' });
  }

  const userSaidFraud = answer === 'FRAUD';
  const correct = userSaidFraud === isFraud;

  res.json({ correct });
};

exports.finishGame = async (req, res) => {
  try {
    const { score, timeTaken, difficulty } = req.body;
    const userId = req.user.id;

    const savedScore = await Score.create({ userId, score, timeTaken, difficulty });

    const user = await User.findByPk(userId);
    if (score > user.highestScore) {
      user.highestScore = score;
      await user.save();
    }

    res.status(201).json(savedScore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving game result' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.findAll({
      attributes: ['username', 'highestScore'],
      order: [['highestScore', 'DESC']],
      limit: 10,
    });
    res.json(topUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const scores = await Score.findAll({ where: { userId } });

    const gamesPlayed = scores.length;
    const highestScore = gamesPlayed ? Math.max(...scores.map((s) => s.score)) : 0;
    const averageAccuracy = gamesPlayed
      ? scores.reduce((sum, s) => sum + s.score, 0) / gamesPlayed / 15 * 100
      : 0;

    res.json({ gamesPlayed, highestScore, averageAccuracy: Math.round(averageAccuracy) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};