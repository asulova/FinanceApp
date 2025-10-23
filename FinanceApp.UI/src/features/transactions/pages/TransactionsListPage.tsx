import React, { useEffect, useState } from 'react';
import type { Transaction } from '../types';
import { fetchTransactions } from '../api/transactionApi';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress, Alert, Button, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { INCOME } from '../../../constants/transactionTypes';

export const TransactionsListPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTransactions(page + 1, rowsPerPage, token);
        setTransactions(Array.isArray(data.items) ? data.items : []);
        setTotalCount(typeof data.totalCount === 'number' ? data.totalCount : 0);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load transactions.');
        } else {
          setError('Failed to load transactions.');
        }
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, rowsPerPage, token]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddTransaction = () => {
    navigate('/transactions/add');
  };

  if (!token) {
    return <Alert severity="warning">Please login to view your transactions.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6 }}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary.dark">
              My Transactions
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Track your incomes and expenses below.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddTransaction}
            sx={{ fontWeight: 600 }}
          >
            Add Transaction
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : transactions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No transactions found.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddTransaction}
            >
              Add your first transaction
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                    '& th': {
                      color: '#fff',
                      fontWeight: 700,
                      letterSpacing: 1,
                      fontSize: '1.05rem',
                      border: 0,
                    }
                  }}
                >
                  <TableCell sx={{ borderTopLeftRadius: 8 }}>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((t, idx) => (
                  <TableRow
                    key={t.id}
                    hover
                    sx={{
                      backgroundColor: idx % 2 === 0 ? 'background.paper' : 'grey.50',
                      transition: 'background 0.2s'
                    }}
                  >
                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: t.type === INCOME ? 'primary.main' : 'error.main' }}>
                      ${Math.abs(t.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>{t.categoryName}</TableCell>
                    <TableCell align="left">
                      <Box display="flex" alignItems="center">
                        {t.type === INCOME ? (
                          <ArrowUpwardIcon color="primary" fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon color="error" fontSize="small" />
                        )}
                        <Typography component="span" sx={{ ml: 1, fontWeight: 500 }}>
                          {t.type === INCOME ? 'INCOME' : 'EXPENSE'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{t.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Box>
  );
};
