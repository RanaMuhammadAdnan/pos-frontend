'use client';

import { useState, useEffect } from 'react';
import { Paper, Box, Alert } from '@mui/material';
import { SaleInvoiceTable } from './SaleInvoiceTable';
import { SaleInvoiceFormDialog } from './SaleInvoiceFormDialog';
import { SaleInvoiceListResponse, CreateSaleInvoiceRequest } from 'types';
import { createSaleInvoice, updateSaleInvoice, getSaleInvoiceById, getSaleInvoices } from 'actions';
import { getCustomersAction } from 'actions';
import { getItemsAction } from 'actions';

interface SaleInvoicesContentProps {
  initialData: { success: boolean; data?: SaleInvoiceListResponse; error?: string };
}

export const SaleInvoicesContent = ({ initialData }: SaleInvoicesContentProps) => {
  const [data, setData] = useState<SaleInvoiceListResponse>(initialData.data || { saleInvoices: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([]);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersResult = await getCustomersAction();
        if (customersResult.success && Array.isArray(customersResult.data)) {
          setCustomers(customersResult.data.map(c => ({ id: c.id, name: c.name })));
        } else {
          setCustomers([]);
        }

        // Fetch items
        const itemsResult = await getItemsAction();
        if (itemsResult.success && itemsResult.data && Array.isArray(itemsResult.data.items)) {
          setItems(itemsResult.data.items);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);



  const refreshData = async () => {
    try {
      const result = await getSaleInvoices({ page: 1, limit: 10 });
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const handleEdit = async (invoice: any) => {
    setIsFormOpen(true);
    if (invoice.id) {
      const saleInvoice = await getSaleInvoiceById(invoice.id);
      if (saleInvoice.success && saleInvoice.data) {
        setEditingInvoice(saleInvoice.data);
      } else {
        setEditingInvoice(invoice);
      }
    } else {
      setEditingInvoice(invoice);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingInvoice(null);
  };

  const handleSubmit = async (data: CreateSaleInvoiceRequest) => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (editingInvoice) {
        result = await updateSaleInvoice({ id: editingInvoice.id, ...data });
      } else {
        result = await createSaleInvoice(data);
      }

      if (result.success) {
        handleCloseForm();
        // Refresh the data instead of reloading the page
        await refreshData();
      } else {
        setError(result.error || 'Failed to save sale invoice');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save sale invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <SaleInvoiceTable 
        initialData={data}
        onEdit={handleEdit}
        onAdd={() => setIsFormOpen(true)}
      />
      
      <SaleInvoiceFormDialog
        open={isFormOpen}
        invoice={editingInvoice}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        loading={loading}
        customers={customers}
        items={items}
      />
    </Paper>
  );
}; 