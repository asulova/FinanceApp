import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { addCategory } from '../api/categoryApi';
import type { Category } from '../types';

interface AddCategoryFormProps {
  onCategoryAdded?: (category: Category) => void;
}

export const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onCategoryAdded }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    setLoading(true);
    try {
      const category = await addCategory({ name, description });
      setSuccess('Category added successfully!');
      setName('');
      setDescription('');
      if (onCategoryAdded) onCategoryAdded(category);
    } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        if (axiosError.response?.data?.message) {
            setError(axiosError.response.data.message);
        } else {
            setError('Failed to add category.');
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
            Please login to add a category.
          </Typography>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add New Category
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Category Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          {success && <Typography color="primary" sx={{ mt: 1 }}>{success}</Typography>}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Category'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/categories')}
            >
              Back to Categories
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};