'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Box,
  Stack,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { SaleInvoice, CreateSaleInvoiceRequest } from 'types';

interface SaleInvoiceFormDialogProps {
  open: boolean;
  invoice?: SaleInvoice | null;
  onClose: () => void;
  onSubmit: (data: CreateSaleInvoiceRequest) => void;
  loading: boolean;
  customers: { id: number; name: string }[];
  items: any[];
}

interface FormState {
  invoiceNumber: string;
  customerId: number | '';
  invoiceDate: string;
  notes: string;
  items: Array<{ itemId: number; quantity: number; discount: number }>;
}

export const SaleInvoiceFormDialog: React.FC<SaleInvoiceFormDialogProps> = ({
  open,
  invoice,
  onClose,
  onSubmit,
  loading,
  customers,
  items
}) => {
  const [formData, setFormData] = useState<FormState>({
    invoiceNumber: '',
    customerId: '',
    invoiceDate: '',
    notes: '',
    items: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        invoiceDate: invoice.invoiceDate?.slice(0, 10) || '',
        notes: invoice.notes || '',
        items: (invoice.items || []).map((it: any) => ({ 
          itemId: it.itemId || it.item?.id, 
          quantity: it.quantity || 1,
          discount: (it.quantity && it.quantity > 0) ? (it.discount || 0) / it.quantity : 0
        })) || []
      });
    } else {
      setFormData({ 
        invoiceNumber: '', 
        customerId: '', 
        invoiceDate: new Date().toISOString().split('T')[0], 
        notes: '', 
        items: [] 
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [invoice, open]);

  useEffect(() => {
    if (loading) setShowNotification(true);
  }, [loading]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required';
    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.invoiceDate) newErrors.invoiceDate = 'Date is required';
    if (!formData.items.length) newErrors.items = 'At least one item is required';
    formData.items.forEach((it, idx) => {
      if (!it.itemId || it.itemId === 0) newErrors[`itemId_${idx}`] = 'Item is required';
      if (!it.quantity || it.quantity <= 0) newErrors[`quantity_${idx}`] = 'Quantity must be > 0';
      if (it.discount < 0) newErrors[`discount_${idx}`] = 'Discount cannot be negative';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleItemChange = (idx: number, field: 'itemId' | 'quantity' | 'discount', value: any) => {
    const newItems = [...formData.items];
    if (field === 'itemId') {
      newItems[idx] = { ...newItems[idx], itemId: Number(value) || 0 };
    } else if (field === 'quantity') {
      newItems[idx] = { ...newItems[idx], quantity: Number(value) || 0 };
    } else if (field === 'discount') {
      newItems[idx] = { ...newItems[idx], discount: Number(value) || 0 };
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemId: 0, quantity: 1, discount: 0 }]
    }));
  };

  const handleRemoveItem = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData: CreateSaleInvoiceRequest = {
      invoiceNumber: formData.invoiceNumber.trim(),
      customerId: Number(formData.customerId),
      invoiceDate: formData.invoiceDate,
      items: formData.items.map(item => ({
        itemId: Number(item.itemId),
        quantity: Number(item.quantity),
        discount: Number(item.discount || 0)
      })),
      notes: formData.notes.trim() || undefined
    };

    onSubmit(submitData);
  };

  // Calculate running total
  const getItemSellingPrice = (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    return item ? Number(item.sellingPrice) : 0;
  };

  const getItemNetPrice = (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    return item ? Number(item.netPrice) : 0;
  };

  const calculateItemTotal = (item: { itemId: number; quantity: number; discount: number }) => {
    const sellingPrice = getItemSellingPrice(item.itemId || 0);
    const subtotal = sellingPrice * Number(item.quantity || 0);
    const discountPerUnit = Number(item.discount || 0);
    const totalDiscount = discountPerUnit * Number(item.quantity || 0); // Discount per unit × quantity
    return subtotal - totalDiscount;
  };

  const calculateItemNetAmount = (item: { itemId: number; quantity: number; discount: number }) => {
    const netPrice = getItemNetPrice(item.itemId || 0);
    return netPrice * Number(item.quantity || 0);
  };

  const total = formData.items.reduce((sum, it) => sum + calculateItemTotal(it), 0);
  const totalDiscount = formData.items.reduce((sum, it) => {
    const discountPerUnit = Number(it.discount || 0);
    return sum + (discountPerUnit * Number(it.quantity)); // Total discount = sum of (discount per unit × quantity)
  }, 0);
  
  const netAmount = formData.items.reduce((sum, it) => sum + calculateItemNetAmount(it), 0);
  const profit = total - netAmount;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{invoice ? 'Edit Sale Invoice' : 'Add Sale Invoice'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label="Invoice Number"
              value={formData.invoiceNumber}
              onChange={e => handleChange('invoiceNumber', e.target.value)}
              error={!!errors.invoiceNumber}
              helperText={errors.invoiceNumber}
              fullWidth
              required
              disabled={loading}
            />
            <FormControl fullWidth required error={!!errors.customerId} disabled={loading}>
              <InputLabel>Customer</InputLabel>
              <Select
                value={formData.customerId}
                label="Customer"
                onChange={e => handleChange('customerId', Number(e.target.value))}
              >
                <MenuItem value="">Select Customer</MenuItem>
                {customers.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
              {errors.customerId && <Typography color="error" variant="caption">{errors.customerId}</Typography>}
            </FormControl>
            <TextField
              label="Invoice Date"
              type="date"
              value={formData.invoiceDate}
              onChange={e => handleChange('invoiceDate', e.target.value)}
              error={!!errors.invoiceDate}
              helperText={errors.invoiceDate}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={e => handleChange('notes', e.target.value)}
              fullWidth
              multiline
              rows={2}
              disabled={loading}
            />
            <Box>
              <Typography variant="subtitle1">Items</Typography>
              {errors.items && <Typography color="error">{errors.items}</Typography>}
              <Stack spacing={1} mt={1}>
                {formData.items.map((it, idx) => (
                  <Stack direction="row" spacing={2} alignItems="center" key={idx}>
                    <FormControl sx={{ minWidth: 180 }} error={!!errors[`itemId_${idx}`]} disabled={loading}>
                      <InputLabel>Item</InputLabel>
                      <Select
                        value={it.itemId || 0}
                        label="Item"
                        onChange={e => handleItemChange(idx, 'itemId', Number(e.target.value))}
                      >
                        <MenuItem value={0}>Select Item</MenuItem>
                        {items.map((item: any) => (
                          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))}
                      </Select>
                      {errors[`itemId_${idx}`] && <Typography color="error" variant="caption">{errors[`itemId_${idx}`]}</Typography>}
                    </FormControl>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={it.quantity || ''}
                      onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      error={!!errors[`quantity_${idx}`]}
                      helperText={errors[`quantity_${idx}`]}
                      sx={{ width: 100 }}
                      inputProps={{ min: 1 }}
                      disabled={loading}
                    />
                    <TextField
                      label="Discount (per unit)"
                      type="number"
                      value={it.discount || ''}
                      onChange={e => handleItemChange(idx, 'discount', Number(e.target.value))}
                      error={!!errors[`discount_${idx}`]}
                      sx={{ width: 120 }}
                      inputProps={{ min: 0, step: 0.01 }}
                      disabled={loading}
                    />
                    <Typography variant="body2" sx={{ minWidth: 150 }}>
                      Price: {getItemSellingPrice(it.itemId || 0)} × {it.quantity || 0} = {(getItemSellingPrice(it.itemId || 0) * Number(it.quantity || 0)).toFixed(2)}
                      <br />
                      Net Price: {getItemNetPrice(it.itemId || 0)} × {it.quantity || 0} = {(getItemNetPrice(it.itemId || 0) * Number(it.quantity || 0)).toFixed(2)}
                      <br />
                      Discount: {it.discount || 0} × {it.quantity || 0} = {(Number(it.discount || 0) * Number(it.quantity || 0)).toFixed(2)}
                      <br />
                      Total: {calculateItemTotal(it).toFixed(2)}
                    </Typography>
                    <Button onClick={() => handleRemoveItem(idx)} color="error" disabled={loading}>Remove</Button>
                  </Stack>
                ))}
                <Button onClick={handleAddItem} variant="outlined" sx={{ mt: 1, alignSelf: 'flex-start' }} disabled={loading}>Add Item</Button>
              </Stack>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="body2">Net Amount: {netAmount.toFixed(2)}</Typography>
                <Typography variant="body2">Total Discount: {totalDiscount.toFixed(2)}</Typography>
                <Typography variant="h6">
                  Total Amount: {total.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Profit: {profit.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {invoice ? 'Update Invoice' : 'Add Invoice'}
          </Button>
        </DialogActions>
      </form>
      <Snackbar
        open={showNotification && loading}
        autoHideDuration={null}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }} onClose={() => setShowNotification(false)}>
          {invoice ? 'Updating invoice...' : 'Creating invoice...'}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}; 