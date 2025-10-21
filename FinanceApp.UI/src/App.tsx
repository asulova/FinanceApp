import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import RegisterPage from './features/users/pages/RegisterPage';
import HomePage from './features/home/HomePage';
import UsersListPage from './features/users/pages/UsersListPage';
import { AppBar, Toolbar, Typography, Button, Box, Container, Paper } from '@mui/material';
import { AddTransactionForm } from './features/transactions/pages/AddTransactionPage';
import { TransactionsListPage } from './features/transactions/pages/TransactionsListPage';
import './App.css';
import { AddCategoryForm } from './features/categories/pages/AddCategoryPage';
import { CategoriesListPage } from './features/categories/pages/CategoriesListPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('token'));
    }
    return false;
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('token')));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
              Personal Finances
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            {isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/transactions">Transactions</Button>
                <Button color="inherit" component={Link} to="/categories">Categories</Button>
                <Button color="inherit" component={Link} to="/users">Users</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/register">Register</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box className="main-content" sx={{ bgcolor: 'transparent', boxShadow: 'none', borderRadius: 0 }}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPageWrapper onLogin={handleLogin} />} />
          <Route path="/users" element={<ProtectedUsersListPage />} />
          <Route path="/transactions" element={<TransactionsListPage />} />
          <Route path="/transactions/add" element={<AddTransactionForm />} />
          <Route path="/categories" element={<CategoriesListPage />} />
          <Route path="/categories/add" element={<AddCategoryForm />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Box>
    </Box>
  );
}

// Wrapper for LoginPage to handle redirect after login
import LoginPage from './features/authentication/pages/LoginPage';
import React from 'react';

interface LoginPageWrapperProps {
  onLogin: () => void;
}

const LoginPageWrapper: React.FC<LoginPageWrapperProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  return <LoginPage onLoginSuccess={() => {
    onLogin();
    navigate('/');
  }} />;
};

// Protected route for UsersListPage
const ProtectedUsersListPage: React.FC = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h6" color="error" align="center">
            Please login to view users.
          </Typography>
          <Button component={Link} to="/login" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }
  return <UsersListPage />;
};

// Wrap App with Router to use useNavigate inside App
const AppWithRouter: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
