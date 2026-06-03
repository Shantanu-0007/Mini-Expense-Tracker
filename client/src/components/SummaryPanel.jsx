import React from "react";
import { formatCurrency, CATEGORY_COLORS, CATEGORY_ICONS, CATEGORIES } from "../utils/helpers";

export default function SummaryPanel({ summary, budgets }) {
  if (!summary) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse h-16" />
        ))}
      </div>
    );
  }

  const { totalThisMonth, byCategory, highestExpense } = summary;

  return (
    <div className="space-y-4">
      {/* Total this month */}
      <div className="card bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/20">
        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">This Month</p>
        <p className="font-display text-3xl font-bold text-white mt-1">
          {formatCurrency(totalThisMonth)}
        </p>
      </div>

      {/* Highest single expense */}
      {highestExpense && (
        <div className="card">
          <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-2">
            Highest Expense
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{CATEGORY_ICONS[highestExpense.category]}</span>
              <span className="text-white/70 text-sm">{highestExpense.category}</span>
            </div>
            <span className="font-display font-semibold text-orange-400">
              {formatCurrency(highestExpense.amount)}
            </span>
          </div>
          {highestExpense.note && (
            <p className="text-white/30 text-xs mt-1">{highestExpense.note}</p>
          )}
        </div>
      )}

      {/* Per category with budget indicator */}
      <div className="card">
        <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-3">
          By Category
        </p>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const spent = byCategory[cat] || 0;
            const budget = budgets[cat];
            const hasBudget = budget !== null && budget !== undefined && budget > 0;
            const pct = hasBudget ? Math.min((spent / budget) * 100, 100) : 0;
            const over = hasBudget && spent > budget;
            const color = CATEGORY_COLORS[cat];

            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{CATEGORY_ICONS[cat]}</span>
                    <span className="text-white/60 text-sm">{cat}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${over ? "text-red-400" : "text-white/80"}`}
                    >
                      {formatCurrency(spent)}
                    </span>
                    {hasBudget && (
                      <span className="text-white/30 text-xs">
                        {" / "}{formatCurrency(budget)}
                      </span>
                    )}
                  </div>
                </div>
                {hasBudget && (
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: over ? "#ef4444" : color,
                      }}
                    />
                  </div>
                )}
                {over && (
                  <p className="text-red-400 text-xs mt-0.5">
                    Over budget by {formatCurrency(spent - budget)}
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