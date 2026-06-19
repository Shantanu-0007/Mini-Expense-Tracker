import React from "react";
import { CATEGORIES } from "../utils/helpers";

const today = new Date().toISOString().split("T")[0];

function getPreset(preset) {
  const now = new Date();
  if (preset === "this_month") return {
    startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0],
    endDate: today,
  };
  if (preset === "last_month") return {
    startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0],
    endDate: new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0],
  };
  if (preset === "last_7") return {
    startDate: new Date(now - 7 * 86400000).toISOString().split("T")[0],
    endDate: today,
  };
  return { startDate: "", endDate: "" };
}

export default function Filters({ filters, onChange }) {
  const { category, startDate, endDate } = filters;
  const set = (key, val) => onChange({ ...filters, [key]: val });
  const applyPreset = (p) => { const { startDate: s, endDate: e } = getPreset(p); onChange({ ...filters, startDate: s, endDate: e }); };
  const hasFilters = category !== "All" || startDate || endDate;

  return (
    <div className="card shadow-card space-y-4">
      {/* Category */}
      <div>
        <label className="label">Category</label>
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => set("category", c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                category === c
                  ? "bg-[#1a1d2e] text-white shadow-sm"
                  : "bg-[#f5f6fa] text-gray-500 hover:bg-gray-200"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Date presets */}
      <div>
        <label className="label">Quick Range</label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All time",    value: "all" },
            { label: "This month",  value: "this_month" },
            { label: "Last month",  value: "last_month" },
            { label: "Last 7 days", value: "last_7" },
          ].map((p) => (
            <button key={p.value} onClick={() => applyPreset(p.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f5f6fa] text-gray-500 hover:bg-gray-200 transition-all">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">From</label>
          <input type="date" className="input text-sm" value={startDate} min="2000-01-01"
            max={endDate || today} onChange={(e) => set("startDate", e.target.value)} />
        </div>
        <div>
          <label className="label">To</label>
          <input type="date" className="input text-sm" value={endDate}
            min={startDate || "2000-01-01"} max={today} onChange={(e) => set("endDate", e.target.value)} />
        </div>
      </div>

      {hasFilters && (
        <button onClick={() => onChange({ category: "All", startDate: "", endDate: "" })}
          className="text-xs text-gray-400 font-bold hover:text-[#1a1d2e] transition-colors">
          ✕ Clear all filters
        </button>
      )}
    </div>
  );
}
