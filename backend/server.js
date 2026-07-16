require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Models (imported so Sequelize registers them + associations run)
require('./models/User');
require('./models/Transaction');
require('./models/Score');

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fraud Detective API is running' });
});

app.use('/api', authRoutes);
app.use('/api', gameRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Unable to start server:', err);
  }
}

start();