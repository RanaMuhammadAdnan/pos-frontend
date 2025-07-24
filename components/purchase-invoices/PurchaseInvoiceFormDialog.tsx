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
import { PurchaseInvoice, CreatePurchaseInvoicePayload } from 'types/purchaseInvoice';

interface PurchaseInvoiceFormDialogProps {
  open: boolean;
  invoice?: PurchaseInvoice | null;
  onClose: () => void;
  onSubmit: (data: CreatePurchaseInvoicePayload) => void;
  loading: boolean;
  vendors: { id: number; name: string }[];
  items: any[];
}

interface FormState {
  invoiceNumber: string;
  vendorId: number | '';
  date: string;
  items: Array<{ itemId: number; quantity: number }>;
}

export const PurchaseInvoiceFormDialog: React.FC<PurchaseInvoiceFormDialogProps> = ({
  open,
  invoice,
  onClose,
  onSubmit,
  loading,
  vendors,
  items
}) => {
  const [formData, setFormData] = useState<FormState>({
    invoiceNumber: '',
    vendorId: '',
    date: '',
    items: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        vendorId: invoice.vendorId,
        date: invoice.date?.slice(0, 10) || '',
        items: ((invoice as any).PurchaseInvoiceItems || []).map((it: any) => ({ 
          itemId: it.itemId, 
          quantity: it.quantity 
        })) || []
      });
    } else {
      setFormData({ invoiceNumber: '', vendorId: '', date: '', items: [] });
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
    if (!formData.vendorId) newErrors.vendorId = 'Vendor is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.items.length) newErrors.items = 'At least one item is required';
    formData.items.forEach((it, idx) => {
      if (!it.itemId) newErrors[`itemId_${idx}`] = 'Item is required';
      if (!it.quantity || it.quantity <= 0) newErrors[`quantity_${idx}`] = 'Quantity must be > 0';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleItemChange = (idx: number, field: 'itemId' | 'quantity', value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((it, i) => i === idx ? { ...it, [field]: value } : it)
    }));
    if (errors[`${field}_${idx}`]) setErrors(prev => ({ ...prev, [`${field}_${idx}`]: '' }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, { itemId: 0, quantity: 1 }] }));
  };
  const handleRemoveItem = (idx: number) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateForm()) return;
    onSubmit({
      invoiceNumber: formData.invoiceNumber,
      vendorId: Number(formData.vendorId),
      date: formData.date,
      items: formData.items
    });
  };

  // Calculate running total
  const getItemNetPrice = (itemId: number) => {
    const item = items.find((i: any) => i.id === itemId);
    return item ? Number(item.netPrice) : 0;
  };
  const total = formData.items.reduce((sum, it) => sum + getItemNetPrice(it.itemId) * Number(it.quantity), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{invoice ? 'Edit Purchase Invoice' : 'Add Purchase Invoice'}</DialogTitle>
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
            <FormControl fullWidth required error={!!errors.vendorId} disabled={loading}>
              <InputLabel>Vendor</InputLabel>
              <Select
                value={formData.vendorId}
                label="Vendor"
                onChange={e => handleChange('vendorId', Number(e.target.value))}
              >
                <MenuItem value="">Select Vendor</MenuItem>
                {vendors.map(v => (
                  <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
                ))}
              </Select>
              {errors.vendorId && <Typography color="error" variant="caption">{errors.vendorId}</Typography>}
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={e => handleChange('date', e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
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
                        value={it.itemId}
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
                      value={it.quantity}
                      onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      error={!!errors[`quantity_${idx}`]}
                      helperText={errors[`quantity_${idx}`]}
                      sx={{ width: 100 }}
                      inputProps={{ min: 1 }}
                      disabled={loading}
                    />
                    <Typography variant="body2" sx={{ minWidth: 80 }}>
                      Net: {getItemNetPrice(it.itemId)} × {it.quantity} = {getItemNetPrice(it.itemId) * Number(it.quantity)}
                    </Typography>
                    <Button onClick={() => handleRemoveItem(idx)} color="error" disabled={loading}>Remove</Button>
                  </Stack>
                ))}
                <Button onClick={handleAddItem} variant="outlined" sx={{ mt: 1, alignSelf: 'flex-start' }} disabled={loading}>Add Item</Button>
              </Stack>
              <Typography variant="h6" align="right" mt={2}>
                Total: {total}
              </Typography>
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