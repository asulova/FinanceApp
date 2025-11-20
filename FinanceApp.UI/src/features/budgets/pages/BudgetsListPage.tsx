import React, { useEffect, useState } from 'react';
import { getBudgets } from '../api/budgetApi';
import type { Budget } from '../types';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Budget List Component (Vertical Slice)
// Vertical Slice Pattern: UI and logic for budget listing are isolated in the budgets feature
// SRP: Handles only budget listing UI and logic
// DRY: Reuses Material UI components and table logic
// Separation of Concerns: API logic is imported from api/budgetApi

export const BudgetsListPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    getBudgets(token)
      .then((result) => {
        setBudgets(result.data || result);
        setError(null);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to load budgets.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h6" color="error" align="center">
            Please login to view budgets.
          </Typography>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" mt={6}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            Budgets
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/budgets/add')}>
            Add Budget
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : budgets.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No budgets found.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Period Start</TableCell>
                  <TableCell>Period End</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell>{budget.amount}</TableCell>
                    <TableCell>{budget.periodStart}</TableCell>
                    <TableCell>{budget.periodEnd}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};
