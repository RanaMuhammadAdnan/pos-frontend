"use client";
import { useSession } from 'next-auth/react';
import { Layout } from 'components/common/Layout';
import { DashboardCard } from 'components/common/DashboardCard';
import { Box, Typography } from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

export const DashboardContent = () => {
  const { data: session, status } = useSession();

  const dashboardData = [
    {
      title: 'Total Vendors',
      value: '25',
      icon: <PeopleIcon />,
      color: 'primary.main',
    },
    {
      title: 'Total Products',
      value: '150',
      icon: <ShoppingCartIcon />,
      color: 'secondary.main',
    },
    {
      title: 'Monthly Sales',
      value: '$12,500',
      icon: <TrendingUpIcon />,
      color: 'success.main',
    },
    {
      title: 'Revenue',
      value: '$45,200',
      icon: <MoneyIcon />,
      color: 'warning.main',
    },
  ];

  if (status === 'loading') {
    return (
      <Layout title="Dashboard">
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {session?.user?.username || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your business today.
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3 
      }}>
        {dashboardData.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </Box>
    </Layout>
  );
}; 