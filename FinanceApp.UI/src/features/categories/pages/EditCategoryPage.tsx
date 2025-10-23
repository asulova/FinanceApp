import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { getCategories, editCategory } from '../api/categoryApi';
import type { Category } from '../types';
import axios from 'axios';

export const EditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  React.useEffect(() => {
    async function fetchCategory() {
      if (!token || !categoryId) return;
      setLoading(true);
      try {
        const categories = await getCategories(token);
        const found = categories.find(c => c.id === categoryId);
        if (found) {
          setCategory(found);
          setDescription(found.description || '');
        } else {
          setSnackbar({ open: true, message: 'Category not found.', severity: 'error' });
        }
      } catch {
        setSnackbar({ open: true, message: 'Failed to load category.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [token, categoryId]);

  const handleSave = async () => {
    if (!token || !categoryId) return;
    setSaving(true);
    try {
      const result = await editCategory(categoryId, description, token);
      setSnackbar({ open: true, message: result.message || 'Category updated successfully.', severity: 'success' });
      setTimeout(() => navigate('/categories'), 1200);
      // Do not set setSaving(false) here; let redirect happen
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update category.', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'An unexpected error occurred.', severity: 'error' });
      }
      setSaving(false); // Only re-enable on error
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  if (!category) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>Edit Category</Typography>
        <Typography variant="subtitle1" gutterBottom>Name: {category.name}</Typography>
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 200 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/categories')} disabled={saving}>Cancel</Button>
        </Box>
      </Paper>
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
