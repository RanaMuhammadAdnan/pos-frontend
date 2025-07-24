"use client";
import { useState } from 'react';
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
import { Vendor } from 'types';
import { VendorRow } from 'components/vendors/VendorRow';
import { useClientOnly } from '../../hooks/useClientOnly';

interface VendorsTableProps {
  vendors: Vendor[];
  isLoading?: boolean;
  error?: string | null;
  onAddClick?: () => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onInvoices?: (vendor: Vendor) => void;
}

export const VendorsTable = ({
  vendors,
  isLoading = false,
  error = null,
  onAddClick,
  onEdit,
  onDelete,
  onInvoices
}: VendorsTableProps) => {
  const mounted = useClientOnly();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    vendor.phone.includes(searchTerm) ||
    vendor.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedVendors = filteredVendors.slice(
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
            Vendors ({vendors.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{ borderRadius: 2 }}
          >
            Add Vendor
          </Button>
        </Stack>
      </Box>

      {/* Search Filter */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search vendors..."
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
              <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>
                <Typography variant="subtitle2">Email</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>
                <Typography variant="subtitle2">Phone</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>
                <Typography variant="subtitle2">Address</Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, minWidth: 120 }}>
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>
                    {error}
                  </Alert>
                </TableCell>
              </TableRow>
            ) : paginatedVendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'No vendors found matching your search' : 'No vendors found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedVendors.map((vendor) => (
                <VendorRow
                  key={vendor.id}
                  vendor={vendor}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onInvoices={onInvoices}
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
        count={filteredVendors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}; 