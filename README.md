# 🕵️ Fraud Detective

Train your fraud detection skills by identifying suspicious banking transactions.
A 4-week internship project simulating real-world fraud indicators used in banking.

---

## Tech Stack

**Backend:** Node.js, Express, Sequelize, MySQL, JWT auth (bcryptjs + jsonwebtoken)
**Frontend:** Plain HTML, CSS, and JavaScript (no framework, no build step)
**Dev tools:** VS Code, nodemon, concurrently

---

## Project Structure

```
Fraud_Detective/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── gameController.js
│   ├── middleware/authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Score.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── gameRoutes.js
│   ├── utils/transactionGenerator.js
│   ├── .env               # not committed — see Setup
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/style.css
│   ├── js/api.js
│   ├── index.html          # login / register
│   ├── home.html            # welcome + difficulty picker
│   ├── game.html             # gameplay loop
│   ├── results.html           # score + accuracy
│   └── leaderboard.html        # top scores
└── .gitignore
```

---

## Setup

### 1. Install MySQL
Download from [dev.mysql.com](https://dev.mysql.com/downloads/installer/), install with the "Developer Default" option, and set a root password during setup.

Then create the database (via MySQL Workbench or `mysql -u root -p`):
```sql
CREATE DATABASE fraud_detective;
```

### 2. Configure environment variables
Create `backend/.env` (this file is git-ignored, so it won't be shared automatically):
```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=fraud_detective
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
```

### 3. Install dependencies
```powershell
# from the project root
npm install

# then inside backend
cd backend
npm install
```

### 4. Run the project
From the **project root**, one command starts both servers:
```powershell
npm run dev
```
- Backend → `http://localhost:5000`
- Frontend → `http://localhost:5500`

Open `http://localhost:5500` in your browser.

---

## How to Play

1. **Register** an account (username, email, password) or log in with an existing one — login accepts either your username or email.
2. Pick a **difficulty**: Easy, Medium, or Hard.
3. You'll see 15 randomly generated transactions, one at a time. Each shows amount, country, merchant, time, device, and card-present status.
4. Mark each one 🟢 **SAFE** or 🔴 **FRAUD**.
5. After 15 rounds, see your score and accuracy.
6. Check the **Leaderboard** for the top 10 highest scores across all players.

---

## How Fraud Is Determined

Transactions are generated randomly rather than stored, so every game is different. Risk is calculated from a combination of:
- Unusually large transaction amount (> SAR 5,000)
- Country other than Saudi Arabia
- Unusual hour (1 AM–5 AM)
- Unrecognized device
- Card not present

Harder difficulties raise the risk threshold, making fraud less obvious.

---

## API Endpoints

| Method | Endpoint                     | Auth required | Description                  |
|--------|-------------------------------|:---:|-------------------------------|
| POST   | `/api/register`               |     | Create a new account          |
| POST   | `/api/login`                  |     | Log in (username or email)    |
| GET    | `/api/transactions/random`    | ✅  | Get a random transaction      |
| POST   | `/api/game/answer`            | ✅  | Submit SAFE/FRAUD answer      |
| POST   | `/api/game/finish`            | ✅  | Save final game score         |
| GET    | `/api/leaderboard`            | ✅  | Top 10 highest scores         |
| GET    | `/api/statistics`             | ✅  | Personal game stats           |

---

## Roadmap / Still To Do

- [ ] Per-round countdown timer
- [ ] Achievement badges
- [ ] Dark/light mode toggle
- [ ] Admin panel for reviewing past game sessions

---

## Notes

- If `npm` commands fail in PowerShell with a script-execution error, run:
```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
  then restart the terminal.
- `node_modules/` and `.env` are git-ignored — never commit them.