import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = ({ 
  title, 
  description, 
  actionText, 
  onAction, 
  icon 
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.secondary' }}>
          {icon}
        </Box>
      )}
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      
      {actionText && onAction && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAction}
          sx={{ borderRadius: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
}; 