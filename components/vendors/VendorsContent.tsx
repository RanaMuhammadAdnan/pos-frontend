"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from 'components/common/Layout';
import { VendorsTable } from 'components/vendors/VendorsTable';
import { VendorForm } from 'components/vendors/VendorForm';
import { ConfirmDialog } from 'components/common/ConfirmDialog';
import { VendorResponse, Vendor } from 'types';
import { deleteVendorAction, getVendorsAction } from 'actions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface VendorsContentProps {
  initialData: VendorResponse;
}

export const VendorsContent = ({ initialData }: VendorsContentProps) => {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>(Array.isArray(initialData?.data) ? initialData.data : []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const refreshVendors = async () => {
    setIsLoading(true);
    try {
      const result = await getVendorsAction();
      if (result.success && Array.isArray(result.data)) {
        setVendors(result.data);
      } else {
        setVendors([]);
      }
    } catch (error) {
      console.error('Failed to refresh vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVendor = () => {
    setSelectedVendor(null);
    setIsFormOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsFormOpen(true);
  };

  const handleDeleteVendor = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setIsDeleteDialogOpen(true);
  };

  const handleInvoicesClick = (vendor: Vendor) => {
    const params = new URLSearchParams({
      vendorId: vendor.id.toString(),
      vendorName: vendor.name
    });
    router.push(`/purchase-invoices?${params.toString()}`);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedVendor(null);
  };

  const handleVendorSuccess = () => {
    setIsFormOpen(false);
    refreshVendors(); // Refresh the list after create/update
  };

  const handleConfirmDelete = async () => {
    if (!vendorToDelete) return;

    try {
      const result = await deleteVendorAction(vendorToDelete.id);
      
      if (result.success) {
        setVendors(prev => prev.filter(v => v.id !== vendorToDelete.id));
        setIsDeleteDialogOpen(false);
        setVendorToDelete(null);
        setSnackbar({ open: true, message: 'Vendor deleted successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to delete vendor', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'An unexpected error occurred', severity: 'error' });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  if (!initialData.success) {
    return (
      <Layout title="Vendors">
        <div>
          <h1>Vendors</h1>
          <p>Error: {initialData.error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <VendorsTable 
        vendors={vendors} 
        onAddClick={handleAddVendor}
        onEdit={handleEditVendor}
        onDelete={handleDeleteVendor}
        onInvoices={handleInvoicesClick}
      />
      
      <VendorForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleVendorSuccess}
        vendor={selectedVendor}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Vendor"
        message={`Are you sure you want to delete "${vendorToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}; 