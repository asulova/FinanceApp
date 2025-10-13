import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { register } from '../../authentication/api/authApi';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [message, setMessage] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorTitle(null);
    setErrorDetail(null);
    setErrorStatus(null);
    setValidationErrors([]);
    setLoading(true);
    try {
      await register(form);
      setMessage('Registration successful!');
      setForm({ email: '', password: '', firstName: '', lastName: '' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const apiError = err.response?.data;
        if (apiError) {
          setErrorTitle(apiError.title || null);
          setErrorDetail(apiError.detail || null);
          setErrorStatus(apiError.status || null);
          setMessage(apiError.title || apiError.detail || 'Registration failed');
          // Handle validation errors (errors property for ValidationProblemDetails)
          if (apiError.errors && typeof apiError.errors === 'object') {
            const errors: string[] = [];
            Object.values(apiError.errors).forEach((arr) => {
              if (Array.isArray(arr)) {
                arr.forEach((msg) => errors.push(msg));
              }
            });
            setValidationErrors(errors);
          }
        } else {
          setMessage('Registration failed');
        }
      } else {
        setMessage('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark" align="center" mb={2}>
          Create Your Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} fullWidth variant="outlined" />
          <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required fullWidth variant="outlined" />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth variant="outlined" />
          <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth variant="outlined" />
          <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={{ mt: 1 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </Box>
        {(message || errorTitle || errorDetail || validationErrors.length > 0) && (
          <Alert severity={message && message.includes('success') ? 'success' : 'error'} sx={{ mt: 2 }}>
            {message}
            {errorStatus && (
              <Typography variant="caption" color="text.secondary">Status: {errorStatus}</Typography>
            )}
            {errorDetail && (
              <Typography variant="body2" color="text.secondary">{errorDetail}</Typography>
            )}
            {validationErrors.length > 0 && (
              <List sx={{ pt: 1 }}>
                {validationErrors.map((err, idx) => (
                  <ListItem key={idx} sx={{ py: 0 }}>
                    <ListItemText primary={err} />
                  </ListItem>
                ))}
              </List>
            )}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default RegisterPage;
