import * as React from 'react';
import { Box, Typography, Button, Container, Stack, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', py: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 5, borderRadius: 4, textAlign: 'center', background: 'rgba(255,255,255,0.95)' }}>
          <SavingsOutlinedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" fontWeight={700} color="primary.dark" gutterBottom>
            Welcome to Personal Finances
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Take control of your financial future with our easy-to-use platform. Track your expenses, set budgets, and achieve your goals.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button component={Link} to="/register" variant="contained" size="large" color="primary">
              Get Started
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
