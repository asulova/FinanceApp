import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBudgetById } from '../api/budgetApi';
import type { Budget } from '../types';
import { Box, Typography, Paper, CircularProgress, Alert, Button } from '@mui/material';

// Budget Details Component (Vertical Slice)
// Vertical Slice Pattern: UI and logic for budget details are isolated in the budgets feature
// SRP: Handles only budget details UI and logic
// DRY: Reuses Material UI components
// Separation of Concerns: API logic is imported from api/budgetApi

export const BudgetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token || !id) return;
    getBudgetById(Number(id), token)
      .then((result) => {
        setBudget(result.data || result);
        setError(null);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to load budget details.');
      })
      .finally(() => setLoading(false));
  }, [token, id]);

  if (!token) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h6" color="error" align="center">
            Please login to view budget details.
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
        <Button variant="outlined" color="primary" onClick={() => navigate('/budgets')} sx={{ mb: 2 }}>
          Back to Budgets
        </Button>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : budget ? (
          <>
            <Typography variant="h5" fontWeight={700} color="primary.dark" align="center" mb={3}>
              Budget Details
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Amount:</strong> {budget.amount}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Period Start:</strong> {budget.periodStart}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Period End:</strong> {budget.periodEnd}
            </Typography>
          </>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Budget not found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
