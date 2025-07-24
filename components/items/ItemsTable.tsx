"use client";
import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { ItemRow } from './ItemRow';
import { Item, ItemFilters } from 'types';

interface ItemsTableProps {
  items: Item[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  filters: ItemFilters;
  onAddClick: () => void;
  onEditClick: (item: Item) => void;
  onDeleteClick: (item: Item) => void;
  onStockUpdateClick: (item: Item) => void;
  onFiltersChange: (filters: ItemFilters) => void;
  onPageChange: (page: number) => void;
}

export const ItemsTable: React.FC<ItemsTableProps> = React.memo(({
  items,
  pagination,
  loading,
  filters,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onStockUpdateClick,
  onFiltersChange,
  onPageChange
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [lowStockFilter, setLowStockFilter] = useState(filters.lowStock || false);

  // Filtered and paginated items
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (item.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const paginatedItems = filteredItems.slice(
    ((pagination?.page || 1) - 1) * (pagination?.limit || 10),
    ((pagination?.page || 1) - 1) * (pagination?.limit || 10) + (pagination?.limit || 10)
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // MUI uses 0-based indexing
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    onFiltersChange({ ...filters, limit: newLimit, page: 1 });
  };

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Items ({filteredItems.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{ borderRadius: 2 }}
          >
            Add Item
          </Button>
        </Stack>
      </Box>

      {/* Search Filter */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 300 }}
          />
        </Stack>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>
                <Typography variant="subtitle2">Name</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>
                <Typography variant="subtitle2">SKU</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>
                <Typography variant="subtitle2">Vendor</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }} align="right">
                <Typography variant="subtitle2">Gross Price</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 80 }} align="right">
                <Typography variant="subtitle2">Discount</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 80 }} align="right">
                <Typography variant="subtitle2">Tax</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }} align="right">
                <Typography variant="subtitle2">Net Price</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }} align="right">
                <Typography variant="subtitle2">Selling Price</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 80 }} align="right">
                <Typography variant="subtitle2">Stock</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }} align="center">
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <Typography>Loading items...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm ? 'No items found matching your search' : 'No items found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
                  onStockUpdateClick={onStockUpdateClick}
                  showVendor
                  showSku
                  showGross
                  showNet
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <TablePagination
          component="div"
          count={filteredItems.length}
          page={(pagination.page || 1) - 1}
          rowsPerPage={pagination.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}); 