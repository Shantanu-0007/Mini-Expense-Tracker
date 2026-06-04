import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { CATEGORY_COLORS, CATEGORIES, formatCurrency } from "../utils/helpers";

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-card-lg">
        <p className="text-gray-400 font-bold text-xs">{payload[0].name}</p>
        <p className="font-display font-bold text-[#1a1d2e]">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function ExpenseChart({ summary }) {
  const [chartType, setChartType] = useState("pie");
  if (!summary) return null;

  const data = CATEGORIES.map((cat) => ({
    name: cat,
    value: summary.byCategory[cat] || 0,
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="card shadow-card text-center py-10">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-gray-300 font-bold">No data yet</p>
      </div>
    );
  }

  return (
    <div className="card shadow-card">
      <div className="flex items-center justify-between mb-5">
        <p className="font-display font-bold text-[#1a1d2e] text-base">Breakdown</p>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {["pie", "bar"].map((t) => (
            <button key={t} onClick={() => setChartType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                chartType === t ? "bg-[#1a1d2e] text-white shadow-sm" : "text-gray-400 hover:text-[#1a1d2e]"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {chartType === "pie" ? (
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
              paddingAngle={4} dataKey="value">
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} width={55} tickFormatter={(v) => `₹${v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f6fa", radius: 8 }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-50">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[entry.name] }} />
            <span className="text-xs text-gray-500 font-bold">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
