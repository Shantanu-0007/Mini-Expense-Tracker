import React from "react";
import { CATEGORIES } from "../utils/helpers";

const today = new Date().toISOString().split("T")[0];

function getPreset(preset) {
  const now = new Date();
  if (preset === "this_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString().split("T")[0];
    return { startDate: start, endDate: today };
  }
  if (preset === "last_month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString().split("T")[0];
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
      .toISOString().split("T")[0];
    return { startDate: start, endDate: end };
  }
  if (preset === "last_7") {
    const start = new Date(now - 7 * 24 * 60 * 60 * 1000)
      .toISOString().split("T")[0];
    return { startDate: start, endDate: today };
  }
  return { startDate: "", endDate: "" };
}

export default function Filters({ filters, onChange }) {
  const { category, startDate, endDate } = filters;

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  function applyPreset(preset) {
    const { startDate: s, endDate: e } = getPreset(preset);
    onChange({ ...filters, startDate: s, endDate: e });
  }

  return (
    <div className="card space-y-3">
      <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Filters</p>

      {/* Category filter */}
      <div>
        <label className="label">Category</label>
        <select
          className="input"
          value={category}
          onChange={(e) => set("category", e.target.value)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Date presets */}
      <div>
        <label className="label">Quick Range</label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All time", value: "all" },
            { label: "This month", value: "this_month" },
            { label: "Last month", value: "last_month" },
            { label: "Last 7 days", value: "last_7" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => applyPreset(p.value)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-all border border-white/5"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom date range */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">From</label>
          <input
            type="date"
            className="input text-sm"
            value={startDate}
            max={endDate || today}
            onChange={(e) => set("startDate", e.target.value)}
          />
        </div>
        <div>
          <label className="label">To</label>
          <input
            type="date"
            className="input text-sm"
            value={endDate}
            min={startDate}
            max={today}
            onChange={(e) => set("endDate", e.target.value)}
          />
        </div>
      </div>

      {(category !== "All" || startDate || endDate) && (
        <button
          onClick={() => onChange({ category: "All", startDate: "", endDate: "" })}
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          ✕ Clear all filters
        </button>
      )}
    </div>
  );
}