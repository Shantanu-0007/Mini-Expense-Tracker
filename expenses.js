const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readJSON, writeJSON } = require("../utils/storage");

const router = express.Router();
const FILE = "expenses.json";

const VALID_CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

function validateExpense(body) {
  const errors = [];
  const { amount, category, date, note } = body;

  if (amount === undefined || amount === null || amount === "") {
    errors.push("Amount is required.");
  } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push("Amount must be a positive number.");
  }

  if (!category) {
    errors.push("Category is required.");
  } else if (!VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(", ")}.`);
  }

  if (!date) {
    errors.push("Date is required.");
  } else {
    const expenseDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(expenseDate.getTime())) {
      errors.push("Date is invalid.");
    } else if (expenseDate > today) {
      errors.push("Date cannot be in the future.");
    }
  }

  if (note && note.length > 200) {
    errors.push("Note cannot exceed 200 characters.");
  }

  return errors;
}

// GET /api/expenses - get all with optional filters
router.get("/", (req, res) => {
  let expenses = readJSON(FILE);
  const { category, startDate, endDate } = req.query;

  if (category && category !== "All") {
    expenses = expenses.filter((e) => e.category === category);
  }

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    expenses = expenses.filter((e) => new Date(e.date) >= start);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    expenses = expenses.filter((e) => new Date(e.date) <= end);
  }

  // Sort by date descending
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(expenses);
});

// POST /api/expenses - create new expense
router.post("/", (req, res) => {
  const errors = validateExpense(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { amount, category, date, note } = req.body;
  const expense = {
    id: uuidv4(),
    amount: parseFloat(Number(amount).toFixed(2)),
    category,
    date,
    note: note || "",
    createdAt: new Date().toISOString(),
  };

  const expenses = readJSON(FILE);
  expenses.push(expense);
  writeJSON(FILE, expenses);

  res.status(201).json(expense);
});

// PUT /api/expenses/:id - update expense
router.put("/:id", (req, res) => {
  const errors = validateExpense(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const expenses = readJSON(FILE);
  const index = expenses.findIndex((e) => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Expense not found." });
  }

  const { amount, category, date, note } = req.body;
  expenses[index] = {
    ...expenses[index],
    amount: parseFloat(Number(amount).toFixed(2)),
    category,
    date,
    note: note || "",
    updatedAt: new Date().toISOString(),
  };

  writeJSON(FILE, expenses);
  res.json(expenses[index]);
});

// DELETE /api/expenses/:id - delete expense
router.delete("/:id", (req, res) => {
  const expenses = readJSON(FILE);
  const index = expenses.findIndex((e) => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Expense not found." });
  }

  expenses.splice(index, 1);
  writeJSON(FILE, expenses);
  res.json({ message: "Expense deleted successfully." });
});

// GET /api/expenses/summary - summary stats
router.get("/summary", (req, res) => {
  const expenses = readJSON(FILE);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonth = expenses.filter((e) => new Date(e.date) >= startOfMonth);
  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = {};
  VALID_CATEGORIES.forEach((cat) => {
    byCategory[cat] = thisMonth
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const highest = expenses.reduce(
    (max, e) => (e.amount > (max?.amount || 0) ? e : max),
    null
  );

  res.json({
    totalThisMonth: parseFloat(totalThisMonth.toFixed(2)),
    byCategory,
    highestExpense: highest,
  });
});

module.exports = router;