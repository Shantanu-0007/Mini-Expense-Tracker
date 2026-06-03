import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

export function useExpenses(filters) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.category && filters.category !== "All") params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const [expData, sumData, budgetData] = await Promise.all([
        api.getExpenses(params),
        api.getSummary(),
        api.getBudgets(),
      ]);
      setExpenses(expData);
      setSummary(sumData);
      setBudgets(budgetData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createExpense = async (data) => {
    const newExpense = await api.createExpense(data);
    await fetchAll();
    return newExpense;
  };

  const updateExpense = async (id, data) => {
    const updated = await api.updateExpense(id, data);
    await fetchAll();
    return updated;
  };

  const deleteExpense = async (id) => {
    await api.deleteExpense(id);
    await fetchAll();
  };

  const saveBudgets = async (newBudgets) => {
    const saved = await api.updateBudgets(newBudgets);
    setBudgets(saved);
    return saved;
  };

  return {
    expenses,
    summary,
    budgets,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    saveBudgets,
    refetch: fetchAll,
  };
}
