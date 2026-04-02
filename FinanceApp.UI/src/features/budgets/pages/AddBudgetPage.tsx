import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBudget } from '../api/budgetApi';
import type { Budget } from '../types';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';

// Budget Form Component (Vertical Slice)
// Vertical Slice Pattern: UI and logic for budget creation are isolated in the budgets feature
// SRP: Handles only budget creation UI and logic
// DRY: Reuses Material UI components and form logic
// Separation of Concerns: API logic is imported from api/budgetApi

const initialForm: Omit<Budget, 'id' | 'userId'> = {
  amount: 0,
  periodStart: '',
  periodEnd: ''
};

export const AddBudgetForm: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createBudget(form, token as string);
      setSuccess('Budget created successfully!');
      setForm(initialForm);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create budget.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h6" color="error" align="center">
            Please login to add a budget.
          </Typography>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box maxWidth={600} mx="auto" mt={6}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={700} color="primary.dark" align="center" mb={3}>
          Add Budget
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            inputProps={{ min: 0.01, step: 0.01 }}
            fullWidth
            margin="normal"
            required
            aria-label="Amount"
          />
          <TextField
            label="Period Start"
            name="periodStart"
            type="date"
            value={form.periodStart}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            aria-label="Period Start"
          />
          <TextField
            label="Period End"
            name="periodEnd"
            type="date"
            value={form.periodEnd}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            aria-label="Period End"
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} aria-label="Add Budget">
              {loading ? <CircularProgress size={24} /> : 'Add Budget'}
            </Button>
            <Button variant="outlined" color="primary" onClick={() => navigate('/budgets')} aria-label="Back to Budgets">
              Back to Budgets
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </form>
      </Paper>
    </Box>
  );
};
