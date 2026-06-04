import { useExpenses } from "./hooks/useExpenses";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import SummaryPanel from "./components/SummaryPanel";
import ExpenseChart from "./components/ExpenseChart";
import Filters from "./components/Filters";
import BudgetSettings from "./components/BudgetSettings";
import { exportToCSV } from "./utils/helpers";
import React, { useState, useEffect } from "react";

export default function App() {
  const [filters, setFilters] = useState({
    category: "All",
    startDate: "",
    endDate: "",
  });
  const [addingExpense, setAddingExpense] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses"); // "expenses" | "settings"
  const [formLoading, setFormLoading] = useState(false);

  const {
    expenses,
    summary,
    budgets,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    saveBudgets,
  } = useExpenses(filters);

  async function handleCreate(data) {
    setFormLoading(true);
    try {
      await createExpense(data);
      setAddingExpense(false);
    } finally {
      setFormLoading(false);
    }
  }
  useEffect(() => {
  document.title = "Walletro — Expense Tracker";
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      {/* Header */}
      <header className="border-b border-white/5 sticky top-0 z-40 bg-[#0f0f13]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-base">
              💰
            </div>
            <h1 className="font-display font-bold text-xl text-white tracking-tight">Walletro</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCSV(expenses)}
              disabled={expenses.length === 0}
              className="btn-secondary text-sm flex items-center gap-1.5 hidden sm:flex"
            >
              <span>⬇</span> Export CSV
            </button>
            <button
              onClick={() => setAddingExpense((v) => !v)}
              className="btn-primary text-sm flex items-center gap-1.5"
            >
              <span className="text-lg leading-none">{addingExpense ? "✕" : "+"}</span>
              <span className="hidden sm:inline">{addingExpense ? "Cancel" : "Add Expense"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Error banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Add expense inline form */}
        {addingExpense && (
          <div className="card mb-6 border-purple-500/20">
            <p className="text-xs text-purple-400 font-medium mb-3 uppercase tracking-wider">
              New Expense
            </p>
            <ExpenseForm
              onSubmit={handleCreate}
              onCancel={() => setAddingExpense(false)}
              loading={formLoading}
            />
          </div>
        )}

        {/* Tab nav (mobile) */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 sm:hidden">
          {["expenses", "summary", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-sm rounded-lg font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "text-white/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — expenses */}
          <div className={`lg:col-span-2 space-y-4 ${activeTab !== "expenses" ? "hidden sm:block" : ""}`}>
            <Filters filters={filters} onChange={setFilters} />

            <div className="flex items-center justify-between">
              <p className="text-white/30 text-sm">
                {loading ? "Loading…" : `${expenses.length} expense${expenses.length !== 1 ? "s" : ""}`}
              </p>
              <button
                onClick={() => exportToCSV(expenses)}
                disabled={expenses.length === 0}
                className="btn-secondary text-xs sm:hidden flex items-center gap-1"
              >
                ⬇ CSV
              </button>
            </div>

            <ExpenseList
              expenses={expenses}
              onUpdate={updateExpense}
              onDelete={deleteExpense}
              loading={loading}
            />
          </div>

          {/* Right column — summary + chart + budgets */}
          <div className={`space-y-4 ${activeTab === "expenses" ? "hidden sm:block" : ""} ${activeTab === "settings" ? "hidden" : ""} lg:block`}>
            <SummaryPanel summary={summary} budgets={budgets} />
            <ExpenseChart summary={summary} />
          </div>

          {/* Settings tab (mobile only) */}
          <div className={`${activeTab !== "settings" ? "hidden sm:hidden" : "block"} lg:hidden`}>
            <BudgetSettings budgets={budgets} onSave={saveBudgets} />
          </div>
        </div>

        {/* Budget settings always visible on desktop, in right col */}
        <div className="hidden lg:block mt-6 max-w-sm ml-auto -mt-0">
        </div>
      </main>
    </div>
  );
}
