"use client";
import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { Item } from 'types';

interface ItemRowProps {
  item: Item;
  onEditClick: (item: Item) => void;
  onDeleteClick: (item: Item) => void;
  onStockUpdateClick: (item: Item) => void;
  showVendor?: boolean;
  showSku?: boolean;
  showGross?: boolean;
  showNet?: boolean;
}

export const ItemRow: React.FC<ItemRowProps> = React.memo(({
  item,
  onEditClick,
  onDeleteClick,
  onStockUpdateClick,
  showVendor,
  showSku,
  showGross,
  showNet
}) => {
  const getStockStatus = () => {
    if (item.currentStock === 0) return 'out-of-stock';
    if (item.currentStock <= item.minStockLevel) return 'low-stock';
    return 'in-stock';
  };

  const getStockColor = () => {
    const status = getStockStatus();
    switch (status) {
      case 'out-of-stock':
        return 'error';
      case 'low-stock':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getStatusColor = () => {
    return item.isActive ? 'success' : 'default';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (amount: number | undefined) =>
    amount !== undefined ? Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';

  return (
    <TableRow hover>
      <TableCell>
        <Stack>
          <Typography variant="body2" fontWeight={500}>
            {item.name}
          </Typography>
          {item.description && (
            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 200 }}>
              {item.description.length > 50 
                ? `${item.description.substring(0, 50)}...` 
                : item.description
              }
            </Typography>
          )}
        </Stack>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontFamily="monospace">
          {item.sku}
        </Typography>
      </TableCell>
      <TableCell>
        {item.vendor ? (
          <Typography variant="body2">{item.vendor.name}</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">No vendor</Typography>
        )}
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2">{formatNumber(item.grossPrice)}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2">
          {formatNumber(item.discount)}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2">
          {formatNumber(item.tax)}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2">
          {formatNumber(item.netPrice)}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" fontWeight={500}>
          {formatNumber(item.sellingPrice)}
        </Typography>
      </TableCell>
      <TableCell align="right">
      <Typography variant="body2">
            {item.currentStock}
          </Typography>
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="Edit Item">
            <IconButton
              size="small"
              onClick={() => onEditClick(item)}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Stock">
            <IconButton
              size="small"
              onClick={() => onStockUpdateClick(item)}
              color="info"
            >
              <InventoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Item">
            <IconButton
              size="small"
              onClick={() => onDeleteClick(item)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}); 