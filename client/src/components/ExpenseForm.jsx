import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/helpers";

const today = new Date().toISOString().split("T")[0];

const empty = { amount: "", category: "", date: today, note: "" };

export default function ExpenseForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial || empty);
    setErrors({});
  }, [initial]);

  function validate() {
    const errs = {};
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Enter a positive amount.";
    if (!form.category) errs.category = "Select a category.";
    if (!form.date) errs.date = "Pick a date.";
    else if (form.date > today) errs.date = "Date cannot be in the future.";
    return errs;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    try {
      await onSubmit({ ...form, amount: parseFloat(form.amount) });
      setForm(empty);
    } catch (err) {
      setErrors({ general: err.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-3 py-2">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Amount */}
        <div>
          <label className="label">Amount (₹) *</label>
          <input
            className={`input ${errors.amount ? "border-red-500/60" : ""}`}
            type="number"
            name="amount"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
          />
          {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="label">Category *</label>
          <select
            className={`input ${errors.category ? "border-red-500/60" : ""}`}
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="label">Date *</label>
        <input
          className={`input ${errors.date ? "border-red-500/60" : ""}`}
          type="date"
          name="date"
          max={today}
          value={form.date}
          onChange={handleChange}
        />
        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
      </div>

      {/* Note */}
      <div>
        <label className="label">Note (optional)</label>
        <input
          className="input"
          type="text"
          name="note"
          placeholder="What was this for?"
          maxLength={200}
          value={form.note}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? "Saving…" : initial ? "Update Expense" : "Add Expense"}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}