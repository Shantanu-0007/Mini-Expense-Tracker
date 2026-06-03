import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { CATEGORY_COLORS, CATEGORIES, formatCurrency } from "../utils/helpers";

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#24242f] border border-white/10 rounded-xl px-3 py-2 text-sm shadow-xl">
        <p className="text-white/70">{payload[0].name}</p>
        <p className="font-display font-semibold text-white">{formatCurrency(payload[0].value)}</p>
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
      <div className="card text-center py-8">
        <p className="text-white/30 text-sm">No data to chart yet</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">
          Spending Breakdown
        </p>
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
          <button
            onClick={() => setChartType("pie")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              chartType === "pie"
                ? "bg-purple-600 text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            Pie
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              chartType === "bar"
                ? "bg-purple-600 text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {chartType === "pie" ? (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => `₹${v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}