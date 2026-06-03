import React, { useState, useEffect } from "react";
import { CATEGORIES, CATEGORY_ICONS } from "../utils/helpers";

export default function BudgetSettings({ budgets, onSave }) {
  const [local, setLocal] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const init = {};
    CATEGORIES.forEach((cat) => {
      init[cat] = budgets[cat] !== null && budgets[cat] !== undefined ? budgets[cat] : "";
    });
    setLocal(init);
  }, [budgets]);

  function handleChange(cat, val) {
    setLocal((l) => ({ ...l, [cat]: val }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const toSave = {};
      CATEGORIES.forEach((cat) => {
        toSave[cat] = local[cat] === "" ? null : parseFloat(local[cat]);
      });
      await onSave(toSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Failed to save budgets: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-3">
        Monthly Budgets
      </p>
      <div className="space-y-2">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-2">
            <span className="text-sm w-5 flex-shrink-0">{CATEGORY_ICONS[cat]}</span>
            <span className="text-white/60 text-sm w-28 flex-shrink-0">{cat}</span>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="No limit"
                className="input pl-7 text-sm"
                value={local[cat] ?? ""}
                onChange={(e) => handleChange(cat, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className={`btn-primary w-full mt-4 text-sm ${saved ? "bg-green-600 hover:bg-green-600" : ""}`}
      >
        {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Budgets"}
      </button>
    </div>
  );
}