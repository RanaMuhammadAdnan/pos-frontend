"use client";
import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { City } from 'types';

interface CityRowProps {
  city: City;
  onEdit: (city: City) => void;
  onDelete: (city: City) => void;
}

export const CityRow = ({ city, onEdit, onDelete }: CityRowProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {city.name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {city.state || '-'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {city.country || '-'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatDate(city.createdAt)}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <IconButton
            size="small"
            onClick={() => onEdit(city)}
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
            onClick={() => onDelete(city)}
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
