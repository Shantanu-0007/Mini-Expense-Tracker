export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

export const CATEGORY_COLORS = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Bills: "#ef4444",
  Entertainment: "#a855f7",
  Other: "#6b7280",
};

export const CATEGORY_ICONS = {
  Food: "🍜",
  Transport: "🚌",
  Bills: "💡",
  Entertainment: "🎬",
  Other: "📦",
};

export function exportToCSV(expenses) {
  const headers = ["Date", "Category", "Amount (₹)", "Note"];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.amount.toFixed(2),
    `"${(e.note || "").replace(/"/g, '""')}"`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
