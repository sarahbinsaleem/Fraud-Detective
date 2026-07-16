const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Optional table — transactions are generated on the fly by
// utils/transactionGenerator.js. This model exists if you later
// want to log/replay specific rounds (e.g. for an admin panel).
const Transaction = sequelize.define('Transaction', {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  country: DataTypes.STRING,
  merchant: DataTypes.STRING,
  transactionTime: DataTypes.DATE,
  device: DataTypes.STRING,
  cardPresent: DataTypes.BOOLEAN,
  riskLevel: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    defaultValue: 'Easy',
  },
  isFraud: DataTypes.BOOLEAN,
});

module.exports = Transaction;