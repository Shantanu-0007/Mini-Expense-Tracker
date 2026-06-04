import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/helpers";

const today = new Date().toISOString().split("T")[0];
const empty = { amount: "", category: "", date: today, note: "" };

const ICONS = { Food:"🍜", Transport:"🚌", Bills:"💡", Entertainment:"🎬", Other:"📦" };

export default function ExpenseForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  useEffect(() => { setForm(initial || empty); setErrors({}); }, [initial]);

  function validate() {
    const errs = {};
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Enter a positive amount";
    if (!form.category) errs.category = "Select a category";
    if (!form.date) errs.date = "Pick a date";
    else if (form.date > today) errs.date = "Date cannot be in the future";
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
    try { await onSubmit({ ...form, amount: parseFloat(form.amount) }); setForm(empty); }
    catch (err) { setErrors({ general: err.message }); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.general && (
        <div className="bg-red-50 text-red-500 text-sm rounded-2xl px-4 py-3 font-semibold">
          {errors.general}
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="label">Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
          <input
            className={`input pl-9 text-2xl font-bold h-14 ${errors.amount ? "ring-2 ring-red-300" : ""}`}
            type="number" name="amount" step="0.01" min="0" placeholder="0.00"
            value={form.amount} onChange={handleChange}
          />
        </div>
        {errors.amount && <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.amount}</p>}
      </div>

      {/* Category pills */}
      <div>
        <label className="label">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} type="button"
              onClick={() => { setForm((f) => ({ ...f, category: c })); setErrors((er) => ({ ...er, category: undefined })); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                form.category === c
                  ? "bg-[#1a1d2e] text-white shadow-md"
                  : "bg-[#f5f6fa] text-gray-500 hover:bg-gray-100"
              }`}>
              <span>{ICONS[c]}</span> {c}
            </button>
          ))}
        </div>
        {errors.category && <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.category}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="label">Date</label>
        <input
          className={`input ${errors.date ? "ring-2 ring-red-300" : ""}`}
          type="date" name="date" max={today}
          value={form.date} onChange={handleChange}
        />
        {errors.date && <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.date}</p>}
      </div>

      {/* Note */}
      <div>
        <label className="label">Note (optional)</label>
        <input
          className="input" type="text" name="note"
          placeholder="e.g. Lunch with team" maxLength={200}
          value={form.note} onChange={handleChange}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button type="submit" className="btn-primary flex-1 h-12" disabled={loading}>
          {loading ? "Saving…" : initial ? "Update" : "Add Expense"}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary h-12" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
