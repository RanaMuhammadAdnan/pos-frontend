"use client";
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  error?: string;
  disabled?: boolean;
}

export const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isLoading = false,
  error,
  disabled = false,
}: FormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      
      <form onSubmit={onSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {children}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || disabled}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Saving...' : submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 