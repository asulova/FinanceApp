

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../api/transactionApi';
import { getCategories } from '../../categories/api/categoryApi';
import type { Transaction } from '../types';
import { Box, TextField, Button, MenuItem, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import type { Category } from  '../../categories/types';
import type { AxiosError } from 'axios';

export const AddTransactionForm: React.FC = () => {
  const initialForm: Omit<Transaction, 'id'> = {
    amount: 0,
    date: '',
    description: '',
    categoryId: 0,
    categoryName: '',
    type: 'EXPENSE',
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    getCategories(token)
      .then(setCategories)
      .catch(() => setCategoriesError('Failed to load categories.'))
      .finally(() => setCategoriesLoading(false));
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'amount' || name === 'categoryId' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createTransaction(form, token as string);
      setSuccess('Transaction added successfully!');
      setForm(initialForm);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('Failed to add transaction.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h6" color="error" align="center">
            Please login to add a transaction.
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
          Add Transaction
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
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            aria-label="Date"
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            inputProps={{ maxLength: 250 }}
            fullWidth
            margin="normal"
            required
            aria-label="Description"
          />
          <TextField
            select
            label="Category"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={categoriesLoading || !!categoriesError}
            helperText={categoriesError ? categoriesError : ''}
            aria-label="Category"
          >
            {categoriesLoading ? (
              <MenuItem value="" disabled>Loading...</MenuItem>
            ) : categoriesError ? (
              <MenuItem value="" disabled>Error loading categories</MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))
            )}
          </TextField>
          <TextField
            select
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            aria-label="Type"
          >
            <MenuItem value="INCOME">Income</MenuItem>
            <MenuItem value="EXPENSE">Expense</MenuItem>
          </TextField>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} aria-label="Add Transaction">
              {loading ? <CircularProgress size={24} /> : 'Add Transaction'}
            </Button>
            <Button variant="outlined" color="primary" onClick={() => navigate('/transactions')} aria-label="Back to Transactions">
              Back to Transactions
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </form>
      </Paper>
    </Box>
  );
};
