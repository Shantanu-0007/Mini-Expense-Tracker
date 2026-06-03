const BASE_URL = process.env.REACT_APP_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const message =
      data.errors?.join(", ") || data.error || "Something went wrong";
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Expenses
  getExpenses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/expenses${query ? `?${query}` : ""}`);
  },
  createExpense: (body) =>
    request("/expenses", { method: "POST", body: JSON.stringify(body) }),
  updateExpense: (id, body) =>
    request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteExpense: (id) =>
    request(`/expenses/${id}`, { method: "DELETE" }),
  getSummary: () => request("/expenses/summary"),

  // Budgets
  getBudgets: () => request("/budgets"),
  updateBudgets: (budgets) =>
    request("/budgets", { method: "PUT", body: JSON.stringify({ budgets }) }),
};
