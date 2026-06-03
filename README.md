# Mini-Expense-Tracker
Build an expense tracker that lets a user log their daily spending across categories and see a summary of where their money is going.
# Spendly — Mini Expense Tracker

> Take-home assignment for Studio Graphene — Exercise 2: Mini Expense Tracker

A full-stack expense tracking application where users can log daily spending across categories, filter by date range or category, visualise breakdowns with charts, set monthly budgets per category, and export filtered expenses as CSV. Built with a Node.js/Express backend (JSON file persistence) and a React frontend styled with Tailwind CSS.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | _Add Vercel/Netlify link after deployment_ |
| Backend | _Add Render/Railway link after deployment_ |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Node.js + Express | Lightweight, unopinionated REST framework — ideal for a small API |
| Storage | JSON file via `fs` | Zero setup, persists across restarts, meets the brief's requirements |
| Frontend | React (Create React App) | Specified in the brief; hooks-based, no class components |
| Styling | Tailwind CSS | Utility-first — fast to build responsive UIs without fighting CSS specificity |
| Charts | Recharts | First-class React integration, declarative API, well-maintained |
| IDs | uuid v4 | Collision-proof unique IDs without a database |
| Testing | Jest + Supertest | Meaningful backend integration tests without mocking internals |

---

## How to Run Locally

> Assumes only Node.js (v18+) and npm are installed.

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev        # runs on http://localhost:5000
```

The server auto-creates `server/data/expenses.json` and `server/data/budgets.json` on first write.

### 3. Start the frontend (new terminal)

```bash
cd client
npm install
npm start          # runs on http://localhost:3000
```

The React app proxies `/api` requests to `localhost:5000` via the `"proxy"` field in `client/package.json` — no extra config needed.

### 4. Run backend tests

```bash
cd server
npm test
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Expenses

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/expenses` | — | `Expense[]` sorted by date desc |
| `GET` | `/expenses?category=Food&startDate=2024-06-01&endDate=2024-06-30` | — | Filtered `Expense[]` |
| `POST` | `/expenses` | `{ amount, category, date, note? }` | Created `Expense` (201) |
| `PUT` | `/expenses/:id` | `{ amount, category, date, note? }` | Updated `Expense` |
| `DELETE` | `/expenses/:id` | — | `{ message }` |
| `GET` | `/expenses/summary` | — | `{ totalThisMonth, byCategory, highestExpense }` |

**Expense shape:**
```json
{
  "id": "uuid-v4",
  "amount": 250.00,
  "category": "Food",
  "date": "2024-06-15",
  "note": "Lunch with team",
  "createdAt": "2024-06-15T10:30:00.000Z"
}
```

**Validation rules:**
- `amount`: required, positive number
- `category`: required, one of `Food | Transport | Bills | Entertainment | Other`
- `date`: required, cannot be in the future
- `note`: optional, max 200 characters

**Error shape (400):**
```json
{ "errors": ["Amount must be a positive number.", "Category is required."] }
```

### Budgets

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/budgets` | — | `{ Food: 5000, Transport: null, ... }` |
| `PUT` | `/budgets` | `{ budgets: { Food: 5000, Transport: null } }` | Saved budgets object |

`null` means no budget set for that category.

### Health

| Method | Path | Response |
|---|---|---|
| `GET` | `/health` | `{ status: "ok", timestamp }` |

---

## Project Structure

```
expense-tracker/
├── client/                    # React frontend (Create React App)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx      # Add/edit form with validation
│   │   │   ├── ExpenseList.jsx      # Table of expenses with inline edit/delete
│   │   │   ├── SummaryPanel.jsx     # Total, per-category, highest expense
│   │   │   ├── ExpenseChart.jsx     # Pie + Bar chart (Recharts)
│   │   │   ├── Filters.jsx          # Category + date range filters
│   │   │   └── BudgetSettings.jsx   # Per-category budget input
│   │   ├── hooks/
│   │   │   └── useExpenses.js       # Central data fetching + mutation hook
│   │   ├── utils/
│   │   │   ├── api.js               # fetch wrapper for all API calls
│   │   │   └── helpers.js           # formatCurrency, formatDate, exportToCSV, constants
│   │   ├── App.js                   # Root layout and tab navigation
│   │   └── index.css                # Tailwind directives + global styles
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Node.js + Express backend
│   ├── data/                  # Auto-created; gitignored
│   │   ├── expenses.json
│   │   └── budgets.json
│   ├── routes/
│   │   ├── expenses.js        # CRUD + summary for expenses
│   │   └── budgets.js         # Budget upsert
│   ├── utils/
│   │   └── storage.js         # readJSON / writeJSON helpers
│   ├── __tests__/
│   │   └── expenses.test.js   # Integration tests with Supertest
│   ├── index.js               # Express app entry point
│   └── package.json
│
└── README.md
```

---

## Features Implemented

### Must Have ✅
- Add expense: amount, category, date, optional note
- View all expenses sorted by date (newest first)
- Edit and delete expenses (with confirmation)
- Filter by category and date range (preset + custom)
- Summary panel: total this month, total per category, highest single expense

### Should Have ✅
- Pie and Bar chart (Recharts) with toggle
- Currency formatting using `Intl.NumberFormat` (₹ locale)
- Form validation: no negative amounts, no future dates, category required

### Bonus ✅
- **CSV export** of currently filtered expenses
- **Budget settings** per category with progress bar and over-budget warning
- **Persistence** to JSON files — survives server restarts

---

## Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Push to GitHub, import repo in vercel.com
# Set REACT_APP_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render

1. Create a new **Web Service** on render.com
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variable: `PORT=5000`

> Note: Render's free tier spins down after inactivity. The first request may take ~30s to wake.

---

## What I Would Improve With More Time

1. **SQLite instead of JSON** — concurrent writes to a JSON file are unsafe; SQLite handles this correctly and is still zero-config.
2. **Pagination** — loading all expenses at once won't scale; a `limit/offset` or cursor-based API would be better.
3. **Input debouncing on budget fields** — currently saves on button click; could auto-save with debounce.
4. **More tests** — I wrote backend integration tests; adding React Testing Library tests for the form and filter components would improve confidence.
5. **Error boundary** — a React error boundary would prevent the whole UI from crashing on an unexpected render error.
6. **Optimistic updates** — currently the UI waits for the server before updating; optimistic updates would feel faster.
7. **Authentication** — the brief says to assume one user, but even a simple PIN or localStorage token would make it usable in the real world.

---

## Honest Notes

- I used Claude (AI) to help scaffold boilerplate and review component structure. Every line was reviewed and I understand what it does — I expect to walk through it in the interview.
- The mobile layout uses tab-based navigation to avoid cramming three columns onto a small screen. It works but could be more polished with a slide-in drawer.
- The JSON file storage writes synchronously (`fs.writeFileSync`) which is fine for one user but would block the event loop under concurrent load.
