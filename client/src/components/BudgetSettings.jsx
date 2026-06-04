import React, { useState, useEffect } from "react";
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from "../utils/helpers";

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
      alert("Failed to save: " + err.message);
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-[#1a1d2e] rounded-3xl p-6 text-white relative overflow-hidden shadow-card-lg">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5" />
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Settings</p>
        <p className="font-display font-bold text-2xl">Monthly Budgets</p>
        <p className="text-white/40 text-sm mt-2 font-medium leading-relaxed">
          Set a limit per category. We'll warn you when you're close.
        </p>
      </div>

      {/* Budget inputs */}
      <div className="card shadow-card space-y-3">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: `${CATEGORY_COLORS[cat]}18` }}>
              {CATEGORY_ICONS[cat]}
            </div>
            <span className="text-sm font-bold text-[#1a1d2e] w-28 flex-shrink-0">{cat}</span>
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input type="number" min="0" step="100" placeholder="No limit"
                className="input pl-8 font-bold"
                value={local[cat] ?? ""}
                onChange={(e) => { setLocal((l) => ({ ...l, [cat]: e.target.value })); setSaved(false); }}
              />
            </div>
          </div>
        ))}

        <button onClick={handleSave} disabled={saving}
          className={`btn-primary w-full h-12 mt-2 transition-all ${saved ? "!bg-green-500 hover:!bg-green-500" : ""}`}>
          {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Budgets"}
        </button>
      </div>
    </div>
  );
}
