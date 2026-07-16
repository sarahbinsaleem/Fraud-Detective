const API_BASE = 'http://localhost:5000/api';

// Generic request helper — attaches the JWT automatically if one is stored.
async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

const api = {
  register: (payload) => apiRequest('/register', { method: 'POST', body: payload }),
  login: (payload) => apiRequest('/login', { method: 'POST', body: payload }),
  getRandomTransaction: (difficulty) =>
    apiRequest(`/transactions/random?difficulty=${difficulty}`),
  submitAnswer: (payload) => apiRequest('/game/answer', { method: 'POST', body: payload }),
  finishGame: (payload) => apiRequest('/game/finish', { method: 'POST', body: payload }),
  getLeaderboard: () => apiRequest('/leaderboard'),
  getStatistics: () => apiRequest('/statistics'),
};

function requireAuth() {
  if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}