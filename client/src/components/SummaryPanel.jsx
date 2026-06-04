import React from "react";
import { formatCurrency, CATEGORY_COLORS, CATEGORY_ICONS, CATEGORIES } from "../utils/helpers";

export default function SummaryPanel({ summary, budgets }) {
  if (!summary) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse h-24 shadow-card" />
        ))}
      </div>
    );
  }

  const { totalThisMonth, byCategory, highestExpense } = summary;

  return (
    <div className="space-y-4">
      {/* Total card */}
      <div className="bg-[#1a1d2e] rounded-3xl p-6 text-white relative overflow-hidden shadow-card-lg">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -right-2 -bottom-12 w-36 h-36 rounded-full bg-white/5" />
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">This Month</p>
        <p className="font-display text-4xl font-bold tracking-tight mt-1">{formatCurrency(totalThisMonth)}</p>
        {highestExpense && (
          <div className="mt-4 bg-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs font-bold">Highest Expense</p>
              <p className="text-white font-bold text-sm mt-0.5">
                {highestExpense.note || highestExpense.category}
              </p>
            </div>
            <p className="text-white font-display font-bold">{formatCurrency(highestExpense.amount)}</p>
          </div>
        )}
      </div>

      {/* Per category */}
      <div className="card shadow-card">
        <p className="font-display font-bold text-[#1a1d2e] text-base mb-4">Spending by Category</p>
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const spent = byCategory[cat] || 0;
            const budget = budgets[cat];
            const hasBudget = budget !== null && budget !== undefined && budget > 0;
            const pct = hasBudget ? Math.min((spent / budget) * 100, 100) : 0;
            const over = hasBudget && spent > budget;
            const color = CATEGORY_COLORS[cat];
            if (!spent && !hasBudget) return null;

            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${color}18` }}>
                      <span className="text-base">{CATEGORY_ICONS[cat]}</span>
                    </div>
                    <span className="text-sm font-bold text-[#1a1d2e]">{cat}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${over ? "text-red-500" : "text-[#1a1d2e]"}`}>
                      {formatCurrency(spent)}
                    </span>
                    {hasBudget && (
                      <span className="text-gray-400 text-xs font-medium"> / {formatCurrency(budget)}</span>
                    )}
                  </div>
                </div>
                {hasBudget && (
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: over ? "#ef4444" : color }} />
                  </div>
                )}
                {over && (
                  <p className="text-red-400 text-xs mt-1 font-bold">
                    Over by {formatCurrency(spent - budget)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
