import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'warning' | 'error' | 'info';
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  severity = 'warning',
}: ConfirmDialogProps) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return 'error.main';
      case 'warning':
        return 'warning.main';
      case 'info':
        return 'info.main';
      default:
        return 'warning.main';
    }
  };

  const getConfirmButtonColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'warning';
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: getSeverityColor() }} />
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined">
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={getConfirmButtonColor()}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 