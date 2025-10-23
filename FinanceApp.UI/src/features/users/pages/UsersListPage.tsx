import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import { getUsersList } from '../../users/api/userApi';
import type { User } from '../../users/types';

const UsersListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUsersList();
        // Defensive: ensure users is always an array
        console.log(response);
        const data = Array.isArray(response.data) ? response.data : [];
        setUsers(data);
      } catch {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark" align="center" mb={3}>
          Users List
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(users) && users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
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

export default UsersListPage;
