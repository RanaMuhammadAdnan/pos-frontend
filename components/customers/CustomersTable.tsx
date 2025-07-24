"use client";
import React, { useState } from 'react';
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
  Typography,
  Stack,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { Customer } from 'types';
import { CustomerRow } from './CustomerRow';
import { useClientOnly } from '../../hooks/useClientOnly';

interface CustomersTableProps {
  customers: Customer[];
  isLoading?: boolean;
  error?: string | null;
  onAddClick?: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomersTable = ({
  customers,
  isLoading = false,
  error = null,
  onAddClick,
  onEdit,
  onDelete
}: CustomersTableProps) => {
  const mounted = useClientOnly();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    customer.phone.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Customers ({customers.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{ borderRadius: 2 }}
          >
            Add Customer
          </Button>
        </Stack>
      </Box>

      {/* Search Filter */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search customers..."
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
                <Typography variant="subtitle2">Customer Name</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>
                <Typography variant="subtitle2">Phone</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>
                <Typography variant="subtitle2">Email</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>
                <Typography variant="subtitle2">City</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>
                <Typography variant="subtitle2">Address</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>
                <Typography variant="subtitle2">Created</Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, minWidth: 120 }}>
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>
                    {error}
                  </Alert>
                </TableCell>
              </TableRow>
            ) : paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'No customers found matching your search' : 'No customers found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}; 