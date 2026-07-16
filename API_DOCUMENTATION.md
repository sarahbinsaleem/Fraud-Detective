# Fraud Detective — API Documentation

Base URL (local development):
```
http://localhost:5000/api
```

## Authentication

Most endpoints require a JSON Web Token (JWT), obtained from `/register` or `/login`.

Send it on every protected request as a Bearer token:
```
Authorization: Bearer <token>
```

Tokens expire based on `JWT_EXPIRES_IN` in `.env` (default: 7 days). If a token is missing, invalid, or expired, protected endpoints return:
```json
{ "message": "No token provided" }
```
or
```json
{ "message": "Invalid or expired token" }
```
with HTTP status `401`.

---

## Endpoints Overview

| Method | Endpoint                    | Auth required | Description                     |
|--------|------------------------------|:---:|----------------------------------|
| POST   | `/register`                  |     | Create a new account            |
| POST   | `/login`                     |     | Log in with username or email   |
| GET    | `/transactions/random`       | ✅  | Get a randomly generated transaction |
| POST   | `/game/answer`               | ✅  | Submit a SAFE/FRAUD answer      |
| POST   | `/game/finish`               | ✅  | Save the final result of a game |
| GET    | `/leaderboard`               | ✅  | Get top 10 highest scores       |
| GET    | `/statistics`                | ✅  | Get the logged-in user's stats  |

---

## POST `/register`

Creates a new user account and returns a JWT.

**Auth required:** No

**Request body**
```json
{
  "username": "sarah",
  "email": "sarah@example.com",
  "password": "mypassword123"
}
```

| Field    | Type   | Required | Notes                        |
|----------|--------|:---:|-------------------------------|
| username | string | ✅  | Must be unique                |
| email    | string | ✅  | Must be unique                |
| password | string | ✅  | Stored hashed (bcrypt)        |

**Success response — `201 Created`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "sarah",
    "email": "sarah@example.com"
  }
}
```

**Error responses**

| Status | Body | Cause |
|---|---|---|
| 400 | `{ "message": "username, email and password are required" }` | Missing a required field |
| 409 | `{ "message": "Email already registered" }` | Email already exists in the database |
| 500 | `{ "message": "Server error during registration" }` | Unexpected server/database error |

---

## POST `/login`

Logs in an existing user using **either their username or email**, plus password. Returns a JWT.

**Auth required:** No

**Request body**
```json
{
  "identifier": "sarah",
  "password": "mypassword123"
}
```

| Field      | Type   | Required | Notes                                  |
|------------|--------|:---:|------------------------------------------|
| identifier | string | ✅  | Accepts a username OR an email address   |
| password   | string | ✅  |                                           |

**Success response — `200 OK`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "sarah",
    "email": "sarah@example.com"
  }
}
```

**Error responses**

| Status | Body | Cause |
|---|---|---|
| 400 | `{ "message": "identifier and password are required" }` | Missing a required field |
| 401 | `{ "message": "Invalid credentials" }` | No matching user, or wrong password |
| 500 | `{ "message": "Server error during login" }` | Unexpected server/database error |

---

## GET `/transactions/random`

Generates and returns one random transaction to display in the game. Transactions are **not stored** — a new one is generated on every call.

**Auth required:** ✅ Yes

**Query parameters**

| Param | Type | Required | Values | Default |
|---|---|:---:|---|---|
| difficulty | string | No | `Easy`, `Medium`, `Hard` | `Easy` |

Example request:
```
GET /api/transactions/random?difficulty=Hard
Authorization: Bearer <token>
```

**Success response — `200 OK`**
```json
{
  "amount": 8750,
  "country": "Russia",
  "merchant": "Electronics Store",
  "transactionTime": "2026-07-16T02:14:00.000Z",
  "device": "Unknown Device",
  "cardPresent": false,
  "riskLevel": "Hard",
  "isFraud": true
}
```

| Field | Type | Notes |
|---|---|---|
| amount | number | Transaction amount in SAR |
| country | string | |
| merchant | string | |
| transactionTime | ISO date string | Random hour used to help determine fraud risk |
| device | string | `Known Device`, `New Device`, or `Unknown Device` |
| cardPresent | boolean | |
| riskLevel | string | Echoes the requested difficulty |
| isFraud | boolean | The correct answer — used by the frontend to check the player's guess via `/game/answer` |

> ⚠️ **Note:** `isFraud` is currently returned directly in this response so the frontend can check it client-side against the player's answer. In a stricter build, this value would be withheld here and only validated server-side.

---

## POST `/game/answer`

Checks whether the player's answer for a transaction was correct.

**Auth required:** ✅ Yes

**Request body**
```json
{
  "isFraud": true,
  "answer": "FRAUD"
}
```

| Field   | Type    | Required | Notes                          |
|---------|---------|:---:|----------------------------------|
| isFraud | boolean | ✅  | The transaction's actual fraud status (from `/transactions/random`) |
| answer  | string  | ✅  | The player's guess: `"SAFE"` or `"FRAUD"` |

**Success response — `200 OK`**
```json
{ "correct": true }
```

**Error responses**

| Status | Body | Cause |
|---|---|---|
| 400 | `{ "message": "isFraud (boolean) and answer are required" }` | Missing or wrong-typed field |

---

## POST `/game/finish`

Saves the result of a completed game (15 rounds) to the `Scores` table, and updates the user's `highestScore` if this game beat their previous best.

**Auth required:** ✅ Yes

**Request body**
```json
{
  "score": 13,
  "timeTaken": 145,
  "difficulty": "Medium"
}
```

| Field      | Type   | Required | Notes                          |
|------------|--------|:---:|----------------------------------|
| score      | number | ✅  | Number of correct answers (out of 15) |
| timeTaken  | number | ✅  | Total time in seconds            |
| difficulty | string | ✅  | `Easy`, `Medium`, or `Hard`       |

**Success response — `201 Created`**
```json
{
  "id": 42,
  "userId": 1,
  "score": 13,
  "timeTaken": 145,
  "difficulty": "Medium",
  "date": "2026-07-16T10:22:00.000Z",
  "createdAt": "2026-07-16T10:22:00.000Z",
  "updatedAt": "2026-07-16T10:22:00.000Z"
}
```

**Error responses**

| Status | Body | Cause |
|---|---|---|
| 500 | `{ "message": "Error saving game result" }` | Unexpected server/database error |

---

## GET `/leaderboard`

Returns the top 10 users ranked by their **highest score ever achieved** (not total games played).

**Auth required:** ✅ Yes

**Success response — `200 OK`**
```json
[
  { "username": "sarah", "highestScore": 15 },
  { "username": "ahmed", "highestScore": 14 },
  { "username": "lina", "highestScore": 13 }
]
```

**Error responses**

| Status | Body | Cause |
|---|---|---|
| 500 | `{ "message": "Error fetching leaderboard" }` | Unexpected server/database error |

---

## GET `/statistics`

Returns the logged-in user's personal game stats.

**Auth required:** ✅ Yes

**Success response — `200 OK`**
```json
{
  "gamesPlayed": 7,
  "highestScore": 14,
  "averageAccuracy": 78
}
```

| Field | Type | Notes |
|---|---|---|
| gamesPlayed | number | Total games this user has finished |
| highestScore | number | Best single-game score |
| averageAccuracy | number | Average % correct across all games, rounded |

**Error responses**

| Status | Body | Cause |
|---|---|---|
| 500 | `{ "message": "Error fetching statistics" }` | Unexpected server/database error |

---

## Common Error Format

All error responses follow the same shape:
```json
{ "message": "Human-readable error description" }
```

## Common Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request — missing/invalid input |
| 401 | Unauthorized — missing/invalid/expired token, or bad login credentials |
| 409 | Conflict — e.g. email already registered |
| 500 | Server error |
