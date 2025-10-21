import React, { useEffect, useState } from 'react';
import type { Transaction } from '../types';
import { fetchTransactions } from '../api/transactionApi';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const TransactionsListPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    fetchTransactions(page + 1, rowsPerPage, token)
      .then((data) => {
        setTransactions(Array.isArray(data.items) ? data.items : []);
        setTotalCount(typeof data.totalCount === 'number' ? data.totalCount : 0);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load transactions.');
        setTransactions([]); // Ensure transactions is always an array on error
      })
      .finally(() => setLoading(false));
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
    <Box maxWidth={900} mx="auto" mt={6}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            My Transactions
          </Typography>
          <Button
            variant="contained"
                      color="primary"
                      onClick={handleAddTransaction}
          >
            Add Transaction
          </Button>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(transactions || []).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                      <TableCell>{t.amount}</TableCell>
                      <TableCell>{t.categoryName}</TableCell>
                      <TableCell>{t.type}</TableCell>
                      <TableCell>{t.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};
