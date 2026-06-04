import React, { useState } from "react";
import { formatCurrency, formatDate, CATEGORY_COLORS, CATEGORY_ICONS } from "../utils/helpers";
import ExpenseForm from "./ExpenseForm";

export default function ExpenseList({ expenses, onUpdate, onDelete, loading, compact }) {
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function handleUpdate(id, data) {
    setActionLoading(true);
    try { await onUpdate(id, data); setEditingId(null); }
    finally { setActionLoading(false); }
  }

  async function handleDelete(id) {
    setActionLoading(true);
    try { await onDelete(id); setDeletingId(null); }
    finally { setActionLoading(false); }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(compact ? 3 : 5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded-full w-2/5" />
              <div className="h-2 bg-gray-100 rounded-full w-1/4" />
            </div>
            <div className="h-4 bg-gray-100 rounded-full w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="text-5xl mb-3">💸</div>
        <p className="text-gray-400 font-bold text-base">No transactions yet</p>
        <p className="text-gray-300 text-sm mt-1 font-medium">Tap + to add your first expense</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {expenses.map((expense) => {
        const color = CATEGORY_COLORS[expense.category] || "#95A5A6";
        const icon = CATEGORY_ICONS[expense.category] || "📦";

        if (editingId === expense.id) {
          return (
            <div key={expense.id} className="bg-gray-50 rounded-2xl p-4 my-2">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Edit</p>
              <ExpenseForm
                initial={{ amount: expense.amount, category: expense.category, date: expense.date, note: expense.note || "" }}
                onSubmit={(data) => handleUpdate(expense.id, data)}
                onCancel={() => setEditingId(null)}
                loading={actionLoading}
              />
            </div>
          );
        }

        return (
          <div key={expense.id}
            className="flex items-center gap-3 py-3 px-2 rounded-2xl hover:bg-gray-50 group transition-all">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: `${color}18` }}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1a1d2e] text-sm truncate">
                {expense.note || expense.category}
              </p>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">{formatDate(expense.date)}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <p className="font-display font-bold text-[#1a1d2e] text-sm">
                -{formatCurrency(expense.amount)}
              </p>
              {!compact && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingId(expense.id)}
                    className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs transition-all">
                    ✏️
                  </button>
                  <button onClick={() => setDeletingId(expense.id)}
                    className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-xs transition-all">
                    🗑️
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Delete confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50 p-5">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-card-lg">
            <div className="w-14 h-14 bg-red-50 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
            <h3 className="font-display font-bold text-xl text-center text-[#1a1d2e] mb-1">Delete transaction?</h3>
            <p className="text-gray-400 text-sm text-center mb-6 font-medium">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button className="btn-danger flex-1 h-12" onClick={() => handleDelete(deletingId)} disabled={actionLoading}>
                {actionLoading ? "Deleting…" : "Delete"}
              </button>
              <button className="btn-secondary flex-1 h-12" onClick={() => setDeletingId(null)} disabled={actionLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
