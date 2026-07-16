const merchants = ['Amazon', 'Apple Store', 'Electronics Store', 'Local Bakery', 'Gas Station', 'Jewelry Store', 'Online Casino', 'Grocery Store'];
const countries = ['Saudi Arabia', 'Russia', 'Brazil', 'Nigeria', 'UAE', 'USA', 'Germany', 'India'];
const devices = ['Known Device', 'New Device', 'Unknown Device'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Core fraud-probability logic — mirrors the rules described in the project spec.
function calculateFraudRisk({ amount, country, hour, device, cardPresent }) {
  let riskScore = 0;

  if (amount > 5000) riskScore += 2;
  if (country !== 'Saudi Arabia') riskScore += 1;
  if (hour >= 1 && hour <= 5) riskScore += 2;
  if (device === 'Unknown Device') riskScore += 2;
  if (!cardPresent) riskScore += 1;

  // riskScore ranges roughly 0-8; convert to a probability
  const probability = Math.min(riskScore / 8, 0.95);
  return probability;
}

function generateTransaction(difficulty = 'Easy') {
  const amount = randomInt(50, 15000);
  const country = randomFrom(countries);
  const merchant = randomFrom(merchants);
  const hour = randomInt(0, 23);
  const device = randomFrom(devices);
  const cardPresent = Math.random() > 0.5;

  const fraudProbability = calculateFraudRisk({ amount, country, hour, device, cardPresent });

  // Harder difficulties get a lower threshold, so fraud is less "obvious"
  const thresholds = { Easy: 0.5, Medium: 0.55, Hard: 0.6 };
  const isFraud = fraudProbability >= (thresholds[difficulty] ?? 0.5);

  const now = new Date();
  now.setHours(hour, randomInt(0, 59), 0, 0);

  return {
    amount,
    country,
    merchant,
    transactionTime: now,
    device,
    cardPresent,
    riskLevel: difficulty,
    isFraud,
  };
}

module.exports = { generateTransaction, calculateFraudRisk };