import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Typography, Box, Paper, Stack, Button, TextField, CircularProgress, Alert, TablePagination } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { PurchaseInvoice } from 'types/purchaseInvoice';
import { PurchaseInvoiceRow } from './PurchaseInvoiceRow';

interface PurchaseInvoiceTableProps {
  invoices: PurchaseInvoice[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
  error?: string | null;
  onAddClick?: () => void;
}

export const PurchaseInvoiceTable: React.FC<PurchaseInvoiceTableProps> = ({ invoices, onView, onEdit, onDelete, loading = false, error = null, onAddClick }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredInvoices = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const paginatedInvoices = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>
                <Typography variant="subtitle2">Invoice #</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>
                <Typography variant="subtitle2">Vendor</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>
                <Typography variant="subtitle2">Date</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 100 }} align="right">
                <Typography variant="subtitle2">Total</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 120 }} align="center">
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
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
            ) : paginatedInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'No purchase invoices found matching your search' : 'No purchase invoices found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedInvoices.map(inv => (
                <PurchaseInvoiceRow
                  key={inv.id}
                  invoice={inv}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
  );
}; 