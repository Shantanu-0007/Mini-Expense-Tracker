# Walletro — Mini Expense Tracker

I chose **Exercise 2: Mini Expense Tracker**. Walletro is a full-stack web application that lets a user log daily spending across five categories (Food, Transport, Bills, Entertainment, Other), filter expenses by category and date range, view a summary of monthly spending with a pie/bar chart breakdown, set per-category monthly budgets with visual over-budget indicators, and export filtered expenses as a CSV file. The backend is a Node.js/Express REST API that persists data to JSON files, and the frontend is a React single-page app styled with Tailwind CSS to look and feel like a modern mobile finance app.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://mini-expense-tracker-blue.vercel.app/ |
| Backend API | https://mini-expense-tracker-s28x.onrender.com/ |
| API Health Check | https://mini-expense-tracker-s28x.onrender.com/api/health |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend runtime | Node.js | Specified in the brief; non-blocking I/O suits a small REST API |
| Backend framework | Express.js | Minimal, unopinionated, easy to structure routes cleanly |
| Storage | JSON files via Node `fs` | Zero setup, survives server restarts, meets the brief's requirements |
| Unique IDs | uuid v4 | Collision-proof IDs without needing a database sequence |
| Frontend | React 18 (Create React App) | Specified in the brief; hooks-based, no class components |
| Styling | Tailwind CSS | Utility-first — fast to build a responsive, consistent UI |
| Charts | Recharts | First-class React integration, declarative API, good defaults |
| Fonts | Plus Jakarta Sans + Nunito | Clean, modern finance-app aesthetic without being generic |
| Testing | Jest + Supertest | Meaningful backend integration tests with real HTTP requests |

---

## How to Run Locally

> Assumes only Node.js (v18 or later) and npm are installed. No database setup required.

**1. Clone the repository**
```bash
git clone https://github.com/Shantanu-0007/Mini-Expense-Tracker.git
cd Mini-Expense-Tracker
```

**2. Start the backend**
```bash
cd server
npm install
npm run dev
```
Server runs at `http://localhost:5000`. The `data/` folder and JSON files are created automatically on first write.

**3. Start the frontend** (open a new terminal)
```bash
cd client
npm install
npm start
```
App opens at `http://localhost:3000`. The `"proxy"` field in `client/package.json` forwards all `/api` requests to `localhost:5000` — no extra config needed.

**4. Run backend tests**
```bash
cd server
npm test
```

---

## API Documentation

**Base URL (local):** `http://localhost:5000/api`

### Expenses

| Method | Path | Description |
|---|---|---|
| GET | `/expenses` | Get all expenses (supports filters) |
| POST | `/expenses` | Create a new expense |
| PUT | `/expenses/:id` | Update an existing expense |
| DELETE | `/expenses/:id` | Delete an expense |
| GET | `/expenses/summary` | Get monthly summary stats |

---

**GET `/expenses`**

Query params (all optional):
| Param | Example | Description |
|---|---|---|
| `category` | `Food` | Filter by category |
| `startDate` | `2024-06-01` | Include expenses on or after this date |
| `endDate` | `2024-06-30` | Include expenses on or before this date |

Response `200`:
```json
[
  {
    "id": "a1b2c3d4-...",
    "amount": 250.00,
    "category": "Food",
    "date": "2024-06-15",
    "note": "Lunch with team",
    "createdAt": "2024-06-15T10:30:00.000Z"
  }
]
```

---

**POST `/expenses`**

Request body:
```json
{
  "amount": 250,
  "category": "Food",
  "date": "2024-06-15",
  "note": "Lunch with team"
}
```

Validation rules:
- `amount` — required, must be a positive number
- `category` — required, one of: `Food`, `Transport`, `Bills`, `Entertainment`, `Other`
- `date` — required, cannot be a future date
- `note` — optional, max 200 characters

Response `201`:
```json
{
  "id": "a1b2c3d4-...",
  "amount": 250.00,
  "category": "Food",
  "date": "2024-06-15",
  "note": "Lunch with team",
  "createdAt": "2024-06-15T10:30:00.000Z"
}
```

Error response `400`:
```json
{
  "errors": ["Amount must be a positive number.", "Category is required."]
}
```

---

**PUT `/expenses/:id`**

Same request body and validation as POST. Returns the updated expense object.

Response `404` if ID not found:
```json
{ "error": "Expense not found." }
```

---

**DELETE `/expenses/:id`**

Response `200`:
```json
{ "message": "Expense deleted successfully." }
```

---

**GET `/expenses/summary`**

Response `200`:
```json
{
  "totalThisMonth": 4320.50,
  "byCategory": {
    "Food": 1200.00,
    "Transport": 850.00,
    "Bills": 2000.00,
    "Entertainment": 270.50,
    "Other": 0.00
  },
  "highestExpense": {
    "id": "a1b2c3d4-...",
    "amount": 2000.00,
    "category": "Bills",
    "date": "2024-06-01",
    "note": "Rent"
  }
}
```

---

### Budgets

| Method | Path | Description |
|---|---|---|
| GET | `/budgets` | Get all category budgets |
| PUT | `/budgets` | Save budgets for all categories |

---

**GET `/budgets`**

Response `200`:
```json
{
  "Food": 3000,
  "Transport": 1000,
  "Bills": 5000,
  "Entertainment": null,
  "Other": null
}
```
`null` means no budget set for that category.

---

**PUT `/budgets`**

Request body:
```json
{
  "budgets": {
    "Food": 3000,
    "Transport": 1000,
    "Bills": 5000,
    "Entertainment": null,
    "Other": null
  }
}
```

Response `200`: the saved budgets object.

---

### Health

**GET `/health`**

Response `200`:
```json
{ "status": "ok", "timestamp": "2024-06-15T10:30:00.000Z" }
```

---

## Project Structure

Mini-Expense-Tracker/
│
├── README.md
├── .gitignore
│
├── server/                        # Node.js + Express backend
│   ├── index.js                   # App entry point, middleware, error handler
│   ├── package.json
│   │
│   ├── routes/
│   │   ├── expenses.js            # CRUD endpoints + summary for expenses
│   │   └── budgets.js             # GET and PUT for per-category budgets
│   │
│   ├── utils/
│   │   └── storage.js             # readJSON / writeJSON helpers using fs
│   │
│   ├── __tests__/
│   │   └── expenses.test.js       # Integration tests with Jest + Supertest
│   │
│   └── data/                      # Auto-created at runtime, gitignored
│       ├── expenses.json
│       └── budgets.json
│
└── client/                        # React frontend (Create React App)
    ├── package.json               # includes "proxy" to backend
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env                       # REACT_APP_API_URL for production
    ├── .gitignore
    │
    ├── public/
    │   └── index.html
    │
    └── src/
        ├── App.js                 # Root layout, tab navigation, modal
        ├── index.js               # React DOM entry point
        ├── index.css              # Tailwind directives + global styles
        │
        ├── components/
        │   ├── ExpenseForm.jsx    # Add/edit form with client-side validation
        │   ├── ExpenseList.jsx    # Transaction list with inline edit + delete
        │   ├── SummaryPanel.jsx   # Monthly total, per-category, highest spend
        │   ├── ExpenseChart.jsx   # Pie and bar chart toggle (Recharts)
        │   ├── Filters.jsx        # Category pills + date range + quick presets
        │   └── BudgetSettings.jsx # Per-category budget inputs with save
        │
        ├── hooks/
        │   └── useExpenses.js     # Central data fetching and mutation hook
        │
        └── utils/
            ├── api.js             # fetch wrapper for all API calls
            └── helpers.js         # formatCurrency, formatDate, exportToCSV, constants

---

## Features Implemented

**Must Have ✅**
- Add expense: amount, category, date, optional note
- View all expenses sorted by date, newest first
- Edit and delete with confirmation prompt
- Filter by category and date range (preset + custom)
- Summary panel: total this month, per-category breakdown, highest single expense

**Should Have ✅**
- Pie and bar chart toggle (Recharts)
- Currency formatting with `Intl.NumberFormat` (₹ Indian locale)
- Form validation: no negative amounts, no future dates, category required

**Bonus ✅**
- CSV export of currently filtered expenses
- Per-category monthly budget with progress bar and over-budget warning
- JSON file persistence — data survives server restarts

---

## Next Steps

**What I chose not to build due to time:**


1. **React Testing Library tests** — I wrote backend integration tests but no frontend tests. Adding tests for `ExpenseForm` validation and the `useExpenses` hook would improve confidence.
2. **Error boundary** — a React error boundary would prevent the whole UI from crashing on an unexpected render error.
3. **Optimistic UI updates** — currently the UI waits for the server to respond before re-rendering. Optimistic updates would feel significantly faster.
4. **Authentication** — the brief says assume one user, but even a simple PIN or `localStorage` token would make it usable beyond a demo.
5. **installable app** — given the mobile-first UI, a service worker and web manifest would let users install it as a home screen app.

---

## Honest Notes

- I used Claude (AI assistant) to help scaffold boilerplate, review component structure, and suggest design patterns. Every line was read, understood, and where needed rewritten. I am fully prepared to walk through any part of the codebase in the follow-up interview.
- The JSON file storage writes synchronously (`fs.writeFileSync`) which is fine for a single user but would block the Node.js event loop under concurrent load — acknowledged as a known limitation above.
- Render's free tier spins down after inactivity, so the first API request after a period of no use may take 20–30 seconds to respond.
