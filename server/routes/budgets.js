const express = require("express");
const { readJSON, writeJSON } = require("../utils/storage");

const router = express.Router();
const FILE = "budgets.json";

const VALID_CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

// GET /api/budgets
router.get("/", (req, res) => {
  const budgets = readJSON(FILE);
  res.json(budgets);
});

// PUT /api/budgets - set budgets for categories (upsert)
router.put("/", (req, res) => {
  const { budgets } = req.body;

  if (!budgets || typeof budgets !== "object") {
    return res.status(400).json({ error: "budgets must be an object." });
  }

  const errors = [];
  for (const [category, amount] of Object.entries(budgets)) {
    if (!VALID_CATEGORIES.includes(category)) {
      errors.push(`Invalid category: ${category}`);
    }
    if (amount !== null && (isNaN(Number(amount)) || Number(amount) < 0)) {
      errors.push(`Budget for ${category} must be a non-negative number or null.`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const sanitized = {};
  for (const [cat, amt] of Object.entries(budgets)) {
    sanitized[cat] = amt === null || amt === "" ? null : parseFloat(Number(amt).toFixed(2));
  }

  writeJSON(FILE, sanitized);
  res.json(sanitized);
});

module.exports = router;
