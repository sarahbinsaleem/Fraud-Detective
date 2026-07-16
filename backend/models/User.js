const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING, // stored hashed
    allowNull: false,
  },
  highestScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;