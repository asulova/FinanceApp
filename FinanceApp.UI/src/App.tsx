import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './features/users/pages/RegisterPage';
import HomePage from './features/home/HomePage';
import UsersListPage from './features/users/pages/UsersListPage';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import './App.css';

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
        <AppBar position="static" color="primary" elevation={2}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
                Personal Finances
              </Typography>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
              <Button color="inherit" component={Link} to="/users">Users</Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box className="main-content" sx={{ bgcolor: 'transparent', boxShadow: 'none', borderRadius: 0 }}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/users" element={<UsersListPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
