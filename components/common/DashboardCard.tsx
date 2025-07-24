import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface DashboardCardProps {
  title: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
}

export const DashboardCard = ({ title, value, color = 'primary.main', icon }: DashboardCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div"
              sx={{ 
                color: color,
                fontWeight: 'bold',
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
          </Box>
          {icon && (
            <Box
              sx={{
                color: color,
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 