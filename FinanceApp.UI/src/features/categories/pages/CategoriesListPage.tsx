import React, { useEffect, useState } from 'react';
import type { Category } from '../types';
import { getCategories, deleteCategory } from '../api/categoryApi';
import {
  Box, Typography, Paper, CircularProgress, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Snackbar, Alert, Stack, Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';

export const CategoriesListPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    async function fetchCategories() {
      try {
        const data = await getCategories(token as string);
        setCategories(data);
      } catch {
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [token]);

  const handleAddCategory = () => {
    navigate('/categories/add');
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId == null || !token) return;
    try {
      await deleteCategory(deleteId, token);
      setCategories(categories.filter(cat => cat.id !== deleteId));
      setSnackbar({ open: true, message: 'Category deleted successfully.', severity: 'success' });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setSnackbar({ open: true, message: err.response?.data?.message || 'Category has assigned transactions.', severity: 'error' });
        } else if (err.response?.status === 404) {
          setSnackbar({ open: true, message: err.response?.data?.message || 'Category not found.', severity: 'error' });
        } else {
          setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete category.', severity: 'error' });
        }
      } else {
        setSnackbar({ open: true, message: 'An unexpected error occurred.', severity: 'error' });
      }
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleEditRoute = (id: number) => {
    navigate(`/categories/edit/${id}`);
  };

  if (!token) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 10 }}>
        <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
          <Typography variant="h6" color="error" align="center">
            Please login to view categories.
          </Typography>
          <Button component={Link} to="/login" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6 }}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom fontWeight={700}>
              Categories
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your transaction categories below.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddCategory}
            sx={{ fontWeight: 600 }}
          >
            Add Category
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : categories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No categories found.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddCategory}
            >
              Create your first category
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
                  <TableCell sx={{ borderTopLeftRadius: 8 }}>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center" sx={{ borderTopRightRadius: 8, width: 180 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat, idx) => (
                  <TableRow
                    key={cat.id}
                    hover
                    sx={{
                      backgroundColor: idx % 2 === 0 ? 'background.paper' : 'grey.50',
                      transition: 'background 0.2s'
                    }}
                  >
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description || <span style={{ color: '#aaa' }}>No description</span>}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          color="primary"
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditRoute(cat.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          variant="Outlined"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(cat.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Dialog open={confirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
