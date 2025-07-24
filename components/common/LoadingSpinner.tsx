import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 60, 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }),
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
      )}
    </Box>
  );

  return content;
}; 