import React, { useState, useEffect } from "react";
import { useExpenses } from "./hooks/useExpenses";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import SummaryPanel from "./components/SummaryPanel";
import ExpenseChart from "./components/ExpenseChart";
import Filters from "./components/Filters";
import BudgetSettings from "./components/BudgetSettings";
import { exportToCSV, formatCurrency } from "./utils/helpers";

const NAV_TABS = [
  { id: "home",     icon: "⊞", label: "Home" },
  { id: "expenses", icon: "↕", label: "Expenses" },
  { id: "stats",    icon: "◎", label: "Stats" },
  { id: "settings", icon: "◈", label: "Budget" },
];

export default function App() {
  const [filters, setFilters] = useState({ category: "All", startDate: "", endDate: "" });
  const [activeTab, setActiveTab] = useState("home");
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { document.title = "Walletro — Expense Tracker"; }, []);

  const {
    expenses, summary, budgets, loading, error,
    createExpense, updateExpense, deleteExpense, saveBudgets,
  } = useExpenses(filters);

  async function handleCreate(data) {
    setFormLoading(true);
    try { await createExpense(data); setShowForm(false); }
    finally { setFormLoading(false); }
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning!" : hour < 17 ? "Good Afternoon!" : "Good Evening!";

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex flex-col">

      {/* ── TOP BAR ── */}
      <header className="bg-[#f0f2f8] px-5 pt-8 pb-2 flex items-center justify-between max-w-lg mx-auto w-full">
        <div>
          <p className="text-xs text-gray-400 font-semibold">{greeting}</p>
          <h1 className="font-display font-bold text-2xl text-[#1a1d2e] tracking-tight">Walletro</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-11 h-11 rounded-2xl bg-[#1a1d2e] text-white flex items-center justify-center text-2xl font-light shadow-card-lg hover:bg-[#2a2d3e] transition-all active:scale-95"
        >
          +
        </button>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 px-5 pb-32 max-w-lg mx-auto w-full space-y-4 mt-3">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl px-4 py-3 font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* ── HOME ── */}
        {activeTab === "home" && (
          <>
            {/* Balance card */}
            <div className="bg-[#1a1d2e] rounded-3xl p-6 text-white relative overflow-hidden shadow-card-lg">
              <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5" />
              <div className="absolute -right-2 -bottom-12 w-36 h-36 rounded-full bg-white/5" />
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Total This Month</p>
              <p className="font-display text-4xl font-bold tracking-tight mt-1">
                {summary ? formatCurrency(summary.totalThisMonth) : "—"}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-2xl px-4 py-3">
                  <p className="text-white/50 text-xs font-bold">Transactions</p>
                  <p className="text-white font-bold text-base mt-0.5">{expenses.length} items</p>
                </div>
                <div className="bg-white/10 rounded-2xl px-4 py-3">
                  <p className="text-white/50 text-xs font-bold">Highest</p>
                  <p className="text-white font-bold text-base mt-0.5">
                    {summary?.highestExpense ? formatCurrency(summary.highestExpense.amount) : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Category quick-tiles */}
            {summary && Object.entries(summary.byCategory).some(([, v]) => v > 0) && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(summary.byCategory)
                  .filter(([, v]) => v > 0)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4)
                  .map(([cat, amt]) => {
                    const icons = { Food:"🍜", Transport:"🚌", Bills:"💡", Entertainment:"🎬", Other:"📦" };
                    const colors = { Food:"#FF6B6B", Transport:"#4ECDC4", Bills:"#FFB347", Entertainment:"#A855F7", Other:"#95A5A6" };
                    return (
                      <div key={cat} className="card shadow-card flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ backgroundColor: `${colors[cat]}18` }}>
                          {icons[cat]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 font-bold">{cat}</p>
                          <p className="font-display font-bold text-sm text-[#1a1d2e] truncate">{formatCurrency(amt)}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Recent transactions */}
            <div className="card shadow-card">
              <div className="flex items-center justify-between mb-4">
                <p className="font-display font-bold text-[#1a1d2e] text-base">Recent</p>
                <button onClick={() => setActiveTab("expenses")}
                  className="text-xs text-gray-400 font-bold hover:text-[#1a1d2e] transition-colors">
                  See all →
                </button>
              </div>
              <ExpenseList
                expenses={expenses.slice(0, 5)}
                onUpdate={updateExpense}
                onDelete={deleteExpense}
                loading={loading}
                compact
              />
            </div>
          </>
        )}

        {/* ── EXPENSES ── */}
        {activeTab === "expenses" && (
          <>
            <Filters filters={filters} onChange={setFilters} />
        
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-gray-400 font-semibold">
                {loading ? "Loading…" : `${expenses.length} transaction${expenses.length !== 1 ? "s" : ""}`}
              </p>
              <button
                onClick={() => exportToCSV(expenses)}
                disabled={expenses.length === 0}
                className="flex items-center gap-2 bg-[#1a1d2e] disabled:opacity-40 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-card hover:bg-[#2a2d3e] transition-all active:scale-95"
              >
                <span>⬇</span> Export CSV
              </button>
            </div>
        
            <div className="card shadow-card">
              <ExpenseList
                expenses={expenses}
                onUpdate={updateExpense}
                onDelete={deleteExpense}
                loading={loading}
              />
            </div>
          </>
        )}

        {/* ── STATS ── */}
        {activeTab === "stats" && (
          <>
            <SummaryPanel summary={summary} budgets={budgets} />
            <ExpenseChart summary={summary} />
          </>
        )}

        {/* ── BUDGET ── */}
        {activeTab === "settings" && (
          <BudgetSettings budgets={budgets} onSave={saveBudgets} />
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto px-5 pb-6 pt-2">
          <div className="bg-white rounded-3xl shadow-card-lg px-4 py-3 flex items-center justify-around">
            {NAV_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1a1d2e] text-white"
                    : "text-gray-400 hover:text-[#1a1d2e]"
                }`}>
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── ADD EXPENSE MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-card-lg"
            style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <p className="font-display font-bold text-xl text-[#1a1d2e] mb-5">Add Expense</p>
            <ExpenseForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
