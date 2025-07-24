"use client";
import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Customer } from 'types';

interface CustomerRowProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerRow = ({ customer, onEdit, onDelete }: CustomerRowProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableRow hover>
      <TableCell>
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {customer.name}
          </Typography>
        </Box>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {customer.phone}
        </Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {customer.email || '-'}
        </Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {customer.city?.name || '-'}
        </Typography>
        {customer.city?.state && (
          <Typography variant="caption" color="text.secondary" display="block">
            {customer.city.state}, {customer.city.country}
          </Typography>
        )}
      </TableCell>
      
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {customer.address}
        </Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatDate(customer.createdAt)}
        </Typography>
      </TableCell>
      
      <TableCell align="center">
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <IconButton
            size="small"
            onClick={() => onEdit(customer)}
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          
          <IconButton
            size="small"
            onClick={() => onDelete(customer)}
            sx={{
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}; 