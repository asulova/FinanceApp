import type { Budget } from '../types';
import api from '../../../config/axiosConfig';
import { API_URL } from '../../../config';

// Budget API Service (Vertical Slice)
// Vertical Slice Pattern: Each feature has its own API/service, keeping logic isolated and focused
// SRP: Handles only API calls for budget operations
// DRY: Centralizes all budget-related API logic
// Separation of Concerns: Keeps API logic out of UI components

export async function createBudget(budget: Budget, token: string) {
  // POST: Create a new budget
  // Result Pattern: Expects a result object from backend
  const response = await api.post(`${API_URL}/api/budgets`, budget, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function getBudgets(token: string) {
  // GET: Retrieve all budgets for the current user
  // Result Pattern: Expects a result object from backend
  const response = await api.get(`${API_URL}/api/budgets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function getBudgetById(id: number, token: string) {
  // GET: Retrieve a single budget by ID
  // Result Pattern: Expects a result object from backend
  const response = await api.get(`${API_URL}/api/budgets/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
