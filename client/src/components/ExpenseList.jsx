import React, { useState } from "react";
import { formatCurrency, formatDate, CATEGORY_COLORS, CATEGORY_ICONS } from "../utils/helpers";
import ExpenseForm from "./ExpenseForm";

export default function ExpenseList({ expenses, onUpdate, onDelete, loading }) {
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function handleUpdate(id, data) {
    setActionLoading(true);
    try {
      await onUpdate(id, data);
      setEditingId(null);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id) {
    setActionLoading(true);
    try {
      await onDelete(id);
      setDeletingId(null);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/5 rounded w-1/3" />
                <div className="h-2 bg-white/5 rounded w-1/4" />
              </div>
              <div className="h-4 bg-white/5 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="text-5xl mb-4">💸</div>
        <p className="text-white/40 font-display text-lg">No expenses yet</p>
        <p className="text-white/25 text-sm mt-1">Add your first expense above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => {
        const color = CATEGORY_COLORS[expense.category] || "#6b7280";
        const icon = CATEGORY_ICONS[expense.category] || "📦";

        if (editingId === expense.id) {
          return (
            <div key={expense.id} className="card border-purple-500/30">
              <p className="text-xs text-purple-400 font-medium mb-3 uppercase tracking-wider">
                Editing expense
              </p>
              <ExpenseForm
                initial={{
                  amount: expense.amount,
                  category: expense.category,
                  date: expense.date,
                  note: expense.note || "",
                }}
                onSubmit={(data) => handleUpdate(expense.id, data)}
                onCancel={() => setEditingId(null)}
                loading={actionLoading}
              />
            </div>
          );
        }

        return (
          <div
            key={expense.id}
            className="card flex items-center gap-3 group hover:border-white/10 transition-all"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: `${color}18` }}
            >
              {icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {expense.category}
                </span>
                {expense.note && (
                  <span className="text-white/40 text-sm truncate">{expense.note}</span>
                )}
              </div>
              <p className="text-white/30 text-xs mt-0.5">{formatDate(expense.date)}</p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-display font-semibold text-white">
                {formatCurrency(expense.amount)}
              </p>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingId(expense.id)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-all text-sm"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => setDeletingId(expense.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all text-sm"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}

      {/* Delete confirmation modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-sm w-full border-red-500/20 shadow-2xl">
            <h3 className="font-display font-semibold text-lg mb-2">Delete expense?</h3>
            <p className="text-white/50 text-sm mb-5">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                className="btn-danger flex-1"
                onClick={() => handleDelete(deletingId)}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                className="btn-secondary flex-1"
                onClick={() => setDeletingId(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}