const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Score = sequelize.define('Score', {
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timeTaken: DataTypes.INTEGER, // seconds
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Associations
User.hasMany(Score, { foreignKey: 'userId' });
Score.belongsTo(User, { foreignKey: 'userId' });

module.exports = Score;