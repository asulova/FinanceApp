import React, { useState, useEffect } from 'react';
import { getBudgetVsActual } from '../api/budgetApi';
import type { BudgetVsActual } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Alert,
  AlertTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Container,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalanceWallet as WalletIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  ShowChart as ChartIcon,
} from '@mui/icons-material';

export const BudgetVsActualPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [budgetVsActual, setBudgetVsActual] = useState<BudgetVsActual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !id) {
      setError('You must be logged in to view this page.');
      setLoading(false);
      return;
    }

    fetchBudgetVsActual();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const fetchBudgetVsActual = async () => {
    if (!token || !id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getBudgetVsActual(Number(id), token);
      setBudgetVsActual(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load budget vs actual data.');
      console.error('Error fetching budget vs actual:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'Under Budget':
        return 'success';
      case 'Approaching Budget':
        return 'warning';
      case 'Over Budget':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Under Budget':
        return <CheckCircleIcon />;
      case 'Approaching Budget':
        return <WarningIcon />;
      case 'Over Budget':
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  const getProgressBarColor = (percentageUsed: number): 'success' | 'warning' | 'error' => {
    if (percentageUsed < 90) return 'success';
    if (percentageUsed <= 100) return 'warning';
    return 'error';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box maxWidth={1200} mx="auto" mt={6}>
        <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
          <Stack spacing={3}>
            <Skeleton variant="text" width="40%" height={50} />
            <Skeleton variant="rectangular" height={60} />
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
            </Grid>
            <Skeleton variant="rectangular" height={20} sx={{ mt: 3, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth={600} mx="auto" mt={6}>
        <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={700} color="primary.dark" align="center" mb={3}>
            Budget vs Actual
          </Typography>
          <Alert 
            severity="error" 
            sx={{ 
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>Error Loading Budget Data</AlertTitle>
            {error}
          </Alert>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }} justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/budgets')}
            >
              Back to Budgets
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (!budgetVsActual) {
    return (
      <Box maxWidth={600} mx="auto" mt={6}>
        <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={700} color="primary.dark" align="center" mb={3}>
            Budget vs Actual
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 3,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                mb: 3,
              }}
            >
              <ChartIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
            </Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              No Data Available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
              Unable to load budget information. Please try again later.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/budgets')}
            >
              Back to Budgets
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box maxWidth={1200} mx="auto" mt={6}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
            Budget vs Actual
          </Typography>
          {budgetVsActual && (
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.5,
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
            }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Period:
              </Typography>
              <Typography variant="body1" fontWeight={600} color="primary.main">
                {formatDate(budgetVsActual.periodStart)} - {formatDate(budgetVsActual.periodEnd)}
              </Typography>
            </Box>
          )}
        </Box>

      {/* Budget Summary Card */}
      <Card sx={{ mb: 4, overflow: 'visible' }} elevation={2}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WalletIcon color="primary" fontSize="medium" />
              Budget Overview
            </Typography>
            {budgetVsActual.budgetId && (
              <Chip
                icon={getStatusIcon(budgetVsActual.status)}
                label={budgetVsActual.status}
                color={getStatusColor(budgetVsActual.status)}
                sx={{ fontWeight: 600, height: 36 }}
              />
            )}
          </Stack>
        
          {budgetVsActual.budgetId ? (
            <>
              <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      bgcolor: 'primary.50', 
                      borderColor: 'primary.200',
                      borderWidth: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        fontWeight={700} 
                        letterSpacing={0.5}
                        display="block"
                        sx={{ mb: 1 }}
                      >
                        BUDGETED AMOUNT
                      </Typography>
                      <Typography 
                        variant="h5" 
                        fontWeight={700} 
                        color="primary.main" 
                        sx={{ wordBreak: 'break-word', lineHeight: 1.2 }}
                      >
                        {formatCurrency(budgetVsActual.budgetAmount)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      bgcolor: 'info.50', 
                      borderColor: 'info.200',
                      borderWidth: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        fontWeight={700} 
                        letterSpacing={0.5}
                        display="block"
                        sx={{ mb: 1 }}
                      >
                        TOTAL SPENDING
                      </Typography>
                      <Typography 
                        variant="h5" 
                        fontWeight={700} 
                        color="info.main" 
                        sx={{ wordBreak: 'break-word', lineHeight: 1.2 }}
                      >
                        {formatCurrency(budgetVsActual.totalSpending)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      bgcolor: budgetVsActual.variance >= 0 ? 'success.50' : 'error.50',
                      borderColor: budgetVsActual.variance >= 0 ? 'success.200' : 'error.200',
                      borderWidth: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          fontWeight={700}
                          letterSpacing={0.5}
                        >
                          {budgetVsActual.variance >= 0 ? 'REMAINING' : 'OVER BUDGET'}
                        </Typography>
                        {budgetVsActual.variance >= 0 ? (
                          <TrendingUpIcon fontSize="small" color="success" />
                        ) : (
                          <TrendingDownIcon fontSize="small" color="error" />
                        )}
                      </Stack>
                      <Typography 
                        variant="h5" 
                        fontWeight={700} 
                        color={budgetVsActual.variance >= 0 ? 'success.main' : 'error.main'}
                        sx={{ wordBreak: 'break-word', lineHeight: 1.2 }}
                      >
                        {formatCurrency(Math.abs(budgetVsActual.variance))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Budget Usage
                  </Typography>
                  <Chip 
                    label={`${budgetVsActual.percentageUsed.toFixed(1)}%`} 
                    size="small" 
                    color={getProgressBarColor(budgetVsActual.percentageUsed)}
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(budgetVsActual.percentageUsed, 100)} 
                  color={getProgressBarColor(budgetVsActual.percentageUsed)}
                  sx={{ 
                    height: 12, 
                    borderRadius: 2,
                    bgcolor: 'grey.200',
                  }}
                />
              </Box>

              {/* Additional Info */}
              {budgetVsActual.percentageUsed > 90 && (
                <Alert 
                  severity={budgetVsActual.percentageUsed > 100 ? 'error' : 'warning'} 
                  sx={{ mt: 2 }}
                  icon={budgetVsActual.percentageUsed > 100 ? <ErrorIcon /> : <WarningIcon />}
                >
                  {budgetVsActual.percentageUsed > 100 
                    ? `You've exceeded your budget by ${formatCurrency(Math.abs(budgetVsActual.variance))}. Consider reviewing your spending.`
                    : `You're approaching your budget limit. You have ${formatCurrency(budgetVsActual.variance)} remaining.`
                  }
                </Alert>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 3,
                  borderRadius: '50%',
                  bgcolor: 'grey.100',
                  mb: 3,
                }}
              >
                <WalletIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
              </Box>
              <Typography variant="h6" gutterBottom color="text.secondary" fontWeight={600}>
                No Budget Set for This Period
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                Create a budget to start tracking your spending and monitor your financial goals
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/budgets/add')}
              >
                Create Budget
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Category Spending List */}
      {budgetVsActual.categoryBreakdown.length > 0 && (
        <Card elevation={2}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon color="primary" fontSize="medium" />
              Spending by Category
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>% of Total</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>Distribution</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {budgetVsActual.categoryBreakdown.map((category, index) => (
                    <TableRow 
                      key={category.categoryId}
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transform: 'scale(1.01)',
                        },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: `hsl(${(index * 360) / budgetVsActual.categoryBreakdown.length}, 70%, 50%)`,
                            }}
                          />
                          <Typography fontWeight={600}>
                            {category.categoryName}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 120 }}>
                        <Typography fontWeight={600} color="primary.main" sx={{ whiteSpace: 'nowrap' }}>
                          {formatCurrency(category.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 100 }}>
                        <Chip 
                          label={`${category.percentageOfTotal.toFixed(1)}%`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={category.percentageOfTotal}
                              sx={{
                                height: 8,
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: `hsl(${(index * 360) / budgetVsActual.categoryBreakdown.length}, 70%, 50%)`,
                                  borderRadius: 1,
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Summary Statistics */}
            <Box sx={{ mt: 3, p: 2.5, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    CATEGORIES
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                    {budgetVsActual.categoryBreakdown.length}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    HIGHEST SPENDING
                  </Typography>
                  <Tooltip title={budgetVsActual.categoryBreakdown[0]?.categoryName || 'N/A'}>
                    <Typography variant="h6" fontWeight={700} noWrap sx={{ mt: 0.5 }}>
                      {budgetVsActual.categoryBreakdown[0]?.categoryName || 'N/A'}
                    </Typography>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    AVERAGE PER CATEGORY
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5, wordBreak: 'break-word' }}>
                    {formatCurrency(budgetVsActual.totalSpending / budgetVsActual.categoryBreakdown.length)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}

      {budgetVsActual.categoryBreakdown.length === 0 && budgetVsActual.budgetId && (
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center', py: 8, px: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 3,
                borderRadius: '50%',
                bgcolor: 'grey.100',
                mb: 3,
              }}
            >
              <ReceiptIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
            </Box>
            <Typography variant="h6" gutterBottom color="text.secondary" fontWeight={600}>
              No Expenses Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              Start adding transactions to see your spending breakdown and track your budget usage.
            </Typography>
          </CardContent>
        </Card>
      )}

        {/* Bottom Navigation */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/budgets')}
            sx={{ minWidth: 200 }}
          >
            Back to Budgets
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
