"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { Customer, CustomerResponse } from 'types';
import { getCustomersAction, deleteCustomerAction } from 'actions';
import { CustomersTable } from './CustomersTable';
import { CustomerForm } from './CustomerForm';
import { ConfirmDialog } from 'components/common/ConfirmDialog';

interface CustomersContentProps {
  initialData?: CustomerResponse;
}

export const CustomersContent = ({ initialData }: CustomersContentProps) => {
  const [customers, setCustomers] = useState<Customer[]>(Array.isArray(initialData?.data) ? initialData.data : []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(initialData?.error || null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getCustomersAction();
      
      if (result.success && Array.isArray(result.data)) {
        setCustomers(result.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchCustomers();
    }
  }, [initialData]);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setDeletingCustomer(customer);
  };

  const confirmDelete = async () => {
    if (!deletingCustomer) return;

    try {
      setIsDeleting(true);
      const result = await deleteCustomerAction(deletingCustomer.id);
      
      if (result.success) {
        setCustomers(prev => prev.filter(customer => customer.id !== deletingCustomer.id));
        setSnackbar({
          open: true,
          message: 'Customer deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'Failed to delete customer',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An unexpected error occurred',
        severity: 'error',
      });
    } finally {
      setIsDeleting(false);
      setDeletingCustomer(null);
    }
  };

  const handleFormSuccess = () => {
    fetchCustomers();
    setSnackbar({
      open: true,
      message: `Customer ${editingCustomer ? 'updated' : 'created'} successfully`,
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <CustomersTable
        customers={customers}
        isLoading={isLoading}
        error={error}
        onAddClick={handleAddCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />

      <CustomerForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        customer={editingCustomer}
      />

      <ConfirmDialog
        open={Boolean(deletingCustomer)}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deletingCustomer?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingCustomer(null)}
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}; 