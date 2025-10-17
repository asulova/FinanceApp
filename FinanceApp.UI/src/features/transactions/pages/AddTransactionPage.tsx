

import React, { useState, useEffect } from 'react';
import { createTransaction } from '../api/transactionApi';
import type { Transaction } from '../types';
import { Box, TextField, Button, MenuItem, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { getCategories, Category } from '../../categories/api/categoryApi';

const initialForm: Omit<Transaction, 'id'> = {
  amount: 0,
  date: '',
  description: '',
  categoryId: 0,
  type: 'EXPENSE',
};

export const AddTransactionForm: React.FC = () => {

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'amount' || name === 'categoryId' ? Number(value) : value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createTransaction(form);
      setSuccess('Transaction added successfully!');
      setForm(initialForm);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={6}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
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
          >
            <MenuItem value="INCOME">Income</MenuItem>
            <MenuItem value="EXPENSE">Expense</MenuItem>
          </TextField>
          <Box mt={2} display="flex" justifyContent="center">
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Add Transaction'}
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </form>
      </Paper>
    </Box>
  );
};
