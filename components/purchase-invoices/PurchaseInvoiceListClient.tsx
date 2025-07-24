"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Stack, Typography, Alert, Snackbar, Button, TextField, Paper, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Chip, TableContainer } from '@mui/material';
import { useRouter } from 'next/navigation';
import { PurchaseInvoiceTable } from './PurchaseInvoiceTable';
import { getPurchaseInvoicesAction } from 'actions/purchaseInvoice/getPurchaseInvoices';
import { PurchaseInvoice } from 'types/purchaseInvoice';
import { getVendorsAction } from 'actions/vendor/getVendors';
import { getItemsAction } from 'actions/item/getItems';
import { createPurchaseInvoiceAction } from 'actions/purchaseInvoice/createPurchaseInvoice';
import { updatePurchaseInvoiceAction } from 'actions/purchaseInvoice/updatePurchaseInvoice';
import { getPurchaseInvoiceByIdAction } from 'actions/purchaseInvoice/getPurchaseInvoiceById';
import { deletePurchaseInvoiceAction } from 'actions/purchaseInvoice/deletePurchaseInvoice';
import { Close as CloseIcon } from '@mui/icons-material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { Vendor, Item } from 'types';
import { PurchaseInvoiceFormDialog } from './PurchaseInvoiceFormDialog';

interface VendorFilter {
  vendorId?: string;
  vendorName?: string;
}

interface PurchaseInvoiceListClientProps {
  vendorFilter?: VendorFilter;
}

export const PurchaseInvoiceListClient: React.FC<PurchaseInvoiceListClientProps> = ({ vendorFilter }) => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; totalPages: number } | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });
  const [search, setSearch] = useState(vendorFilter?.vendorName || '');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<PurchaseInvoice | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<number | null>(null);

  const fetchInvoices = useCallback(async (params?: { search?: string; page?: number; limit?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPurchaseInvoicesAction({
        search: params?.search ?? search,
        vendorId: vendorFilter?.vendorId ? Number(vendorFilter.vendorId) : undefined,
        page: params?.page ?? page,
        limit: params?.limit ?? limit,
      });
      if (result.success && result.data) {
        setInvoices(result.data.invoices || []);
        setPagination(result.data.pagination);
      } else {
        setError(result.error || 'Failed to fetch invoices');
        setNotification({ open: true, message: result.error || 'Failed to fetch invoices', severity: 'error' });
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setNotification({ open: true, message: 'An unexpected error occurred', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, vendorFilter]);

  useEffect(() => {
    fetchInvoices();
    // Preload vendors/items for form
    getVendorsAction().then(result => {
      if (result.success && Array.isArray(result.data)) setVendors(result.data);
      else setVendors([]);
    });
    getItemsAction().then(result => {
      if (result.success && result.data && Array.isArray(result.data.items)) setItems(result.data.items);
      else setItems([]);
    });
  }, [fetchInvoices]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    setPage(1);
    // If vendor filter is active, search within vendor results
    fetchInvoices({ search: newSearch, page: 1 });
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage + 1);
    fetchInvoices({ page: newPage + 1 });
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
    fetchInvoices({ limit: parseInt(e.target.value, 10), page: 1 });
  };

  const handleAddClick = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingInvoice(null);
  };
  const handleFormSubmit = async (payload: any) => {
    setLoading(true);
    setError(null);
    let result;
    if (editingInvoice) {
      result = await updatePurchaseInvoiceAction(editingInvoice.id, payload);
    } else {
      result = await createPurchaseInvoiceAction(payload);
    }
    setLoading(false);
    if (result.success) {
      setIsFormOpen(false);
      setEditingInvoice(null);
      fetchInvoices();
      setNotification({ open: true, message: editingInvoice ? 'Purchase invoice updated successfully!' : 'Purchase invoice created successfully!', severity: 'success' });
    } else {
      setError(result.error || 'Failed to save invoice');
      setNotification({ open: true, message: result.error || 'Failed to save invoice', severity: 'error' });
    }
  };

  const handleView = (id: number) => {
    router.push(`/purchase-invoices/${id}`);
  };
  const handleEdit = async (id: number) => {
    setLoading(true);
    try {
      const result = await getPurchaseInvoiceByIdAction(id);
      if (result.success && result.data) {
        setEditingInvoice(result.data as PurchaseInvoice);
        setIsFormOpen(true);
      } else {
        setNotification({ open: true, message: result.error || 'Failed to fetch invoice details', severity: 'error' });
      }
    } catch (err) {
      setNotification({ open: true, message: 'An unexpected error occurred', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (id: number) => {
    setDeletingInvoiceId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInvoiceId) return;
    
    setLoading(true);
    try {
      const result = await deletePurchaseInvoiceAction(deletingInvoiceId);
      if (result.success) {
        setNotification({ open: true, message: 'Purchase invoice deleted successfully!', severity: 'success' });
        fetchInvoices(); // Refresh the list
      } else {
        setNotification({ open: true, message: result.error || 'Failed to delete invoice', severity: 'error' });
      }
    } catch (err) {
      setNotification({ open: true, message: 'An unexpected error occurred', severity: 'error' });
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setDeletingInvoiceId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeletingInvoiceId(null);
  };

  const handleClearVendorFilter = () => {
    setSearch('');
    setPage(1);
    router.push('/purchase-invoices');
  };

  const handleCloseNotification = () => setNotification(prev => ({ ...prev, open: false }));

  return (
    <>
      <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
        {/* Header with Add Button */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Purchase Invoices ({invoices?.length || 0})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ borderRadius: 2 }}
            >
              Add Invoice
            </Button>
          </Stack>
        </Box>
        
        {/* Vendor Filter Indicator */}
        {vendorFilter?.vendorName && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Filtered by vendor:
              </Typography>
              <Chip
                label={vendorFilter.vendorName}
                color="primary"
                variant="outlined"
                onDelete={handleClearVendorFilter}
                deleteIcon={<CloseIcon />}
              />
            </Stack>
          </Box>
        )}
        
        {/* Filters */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder={vendorFilter?.vendorName ? "Search by invoice number..." : "Search by invoice number or vendor..."}
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 300 }}
            />
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Table */}
        <TableContainer>
          <PurchaseInvoiceTable
            invoices={invoices}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </TableContainer>

        {/* Pagination */}
        {pagination && (
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            rowsPerPage={pagination.limit}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </Paper>

      <PurchaseInvoiceFormDialog
        open={isFormOpen}
        invoice={editingInvoice}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        loading={loading}
        vendors={vendors}
        items={items}
      />
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this purchase invoice? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
         </>
   );
 }; 