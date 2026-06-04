const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expenses");
const budgetRoutes = require("./routes/budgets");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Spendly API is running 🚀",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      expenses: "/api/expenses",
      budgets: "/api/budgets",
    },
  });
});

app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
