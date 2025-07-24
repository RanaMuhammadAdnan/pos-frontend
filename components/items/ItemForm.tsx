"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { FormDialog } from 'components/common';
import { Item, CreateItemPayload, UpdateItemPayload } from 'types';
import { getVendorsAction } from 'actions/vendor/getVendors';

interface ItemFormProps {
  open: boolean;
  item?: Item | null;
  onClose: () => void;
  onSubmit: (data: CreateItemPayload | UpdateItemPayload) => void;
  loading: boolean;
}

// Update form state type for grossPrice, tax, discount
interface ItemFormState {
  name: string;
  sku: string;
  grossPrice: number | '';
  tax: number | '';
  discount: number | '';
  sellingPrice: number | '';
  minStockLevel: number;
  currentStock: number;
  vendorId?: number;
  description?: string;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  open,
  item,
  onClose,
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState<ItemFormState>({
    name: '',
    sku: '',
    grossPrice: '',
    tax: '',
    discount: '',
    sellingPrice: '',
    minStockLevel: 0,
    currentStock: 0,
    vendorId: undefined,
    description: '',
  });
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getVendorsAction().then((result) => {
      if (result.success && result.data) {
        setVendors(result.data.map((v: any) => ({ id: v.id, name: v.name })));
      }
    });
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        sku: item.sku,
        grossPrice: item.grossPrice ?? '',
        tax: item.tax ?? '',
        discount: item.discount ?? '',
        sellingPrice: item.sellingPrice ?? '',
        minStockLevel: item.minStockLevel,
        currentStock: item.currentStock,
        vendorId: item.vendorId,
        description: item.description || '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        grossPrice: '',
        tax: '',
        discount: '',
        sellingPrice: '',
        minStockLevel: 0,
        currentStock: 0,
        vendorId: undefined,
        description: '',
      });
    }
    setErrors({});
  }, [item, open]);

  useEffect(() => {
    if (loading) setShowNotification(true);
  }, [loading]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vendorId) newErrors.vendorId = 'Vendor is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';

    // Numeric required fields
    if (formData.grossPrice === undefined || isNaN(Number(formData.grossPrice)) || Number(formData.grossPrice) < 0)
      newErrors.grossPrice = 'Gross price must be a non-negative number';

    if (formData.tax !== undefined && (isNaN(Number(formData.tax)) || Number(formData.tax) < 0))
      newErrors.tax = 'Tax cannot be negative';

    if (formData.discount !== undefined && (isNaN(Number(formData.discount)) || Number(formData.discount) < 0))
      newErrors.discount = 'Discount cannot be negative';

    if (formData.currentStock === undefined || isNaN(Number(formData.currentStock)) || Number(formData.currentStock) < 0)
      newErrors.currentStock = 'Stock must be a non-negative number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ItemFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateForm()) return;

    // Final validation for required fields
    if (!formData.sku.trim()) {
      setSubmitError('SKU is required.');
      return;
    }
    if (formData.grossPrice === '' || isNaN(Number(formData.grossPrice))) {
      setSubmitError('Gross Price is required.');
      return;
    }
    if (formData.sellingPrice === '' || isNaN(Number(formData.sellingPrice))) {
      setSubmitError('Selling Price is required.');
      return;
    }

    // Convert form state to payload, defaulting empty fields to 0
    const payload = {
      ...formData,
      grossPrice: Number(formData.grossPrice || 0),
      tax: Number(formData.tax || 0),
      discount: Number(formData.discount || 0),
      sellingPrice: Number(formData.sellingPrice || 0),
    };

    if (item) {
      // Editing: include id
      onSubmit({ ...payload, id: item.id });
    } else {
      // Creating: no id
      onSubmit(payload);
    }
  };

  const formatCurrency = (amount: number) => {
    // Show only numbers with two decimals, no currency symbol
    return Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculate net price live
  const netPrice = Number(formData.grossPrice || 0) + Number(formData.tax || 0) - Number(formData.discount || 0);

  return (
    <>
      <FormDialog
        open={open}
        title={item ? 'Edit Item' : 'Add New Item'}
        onClose={onClose}
        onSubmit={handleSubmit}
        isLoading={loading}
      >
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
        )}
        <Stack spacing={3}>
          {/* Vendor */}
          <FormControl fullWidth required error={!!errors.vendorId}>
            <InputLabel>Vendor</InputLabel>
            <Select
              value={formData.vendorId || ''}
              label="Vendor"
              onChange={(e) => handleChange('vendorId', Number(e.target.value))}
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>
              ))}
            </Select>
            {errors.vendorId && <Typography color="error" variant="caption">{errors.vendorId}</Typography>}
          </FormControl>

          {/* Name and SKU in a row */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Item Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
            <TextField
              fullWidth
              label="SKU"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              error={!!errors.sku}
              helperText={errors.sku}
              required
              disabled={!!item}
            />
          </Stack>

          {/* Pricing fields in a row */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Gross Price"
              type="number"
              value={formData.grossPrice}
              onChange={(e) => handleChange('grossPrice', e.target.value === '' ? '' : parseFloat(e.target.value))}
              error={!!errors.grossPrice}
              helperText={errors.grossPrice}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Tax"
              type="number"
              value={formData.tax}
              onChange={(e) => handleChange('tax', e.target.value === '' ? '' : parseFloat(e.target.value))}
              error={!!errors.tax}
              helperText={errors.tax}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Discount"
              type="number"
              value={formData.discount}
              onChange={(e) => handleChange('discount', e.target.value === '' ? '' : parseFloat(e.target.value))}
              error={!!errors.discount}
              helperText={errors.discount}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Net Price"
              value={netPrice}
              InputProps={{ readOnly: true }}
            />
          </Stack>
          {/* Selling Price and Stock/Quantity in a row */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Selling Price"
              type="number"
              value={formData.sellingPrice}
              onChange={(e) => handleChange('sellingPrice', e.target.value === '' ? '' : parseFloat(e.target.value))}
              error={!!errors.sellingPrice}
              helperText={errors.sellingPrice}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Stock / Quantity"
              type="number"
              value={formData.currentStock}
              onChange={(e) => handleChange('currentStock', e.target.value === '' ? '' : parseInt(e.target.value))}
              error={!!errors.currentStock}
              helperText={errors.currentStock}
              inputProps={{ min: 0, step: 1 }}
            />
          </Stack>

          {/* Description (last, optional) */}
          <TextField
            fullWidth
            label="Description (optional)"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={2}
          />
        </Stack>
      </FormDialog>
      <Snackbar
        open={showNotification && loading}
        autoHideDuration={null}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="info" 
          sx={{ width: '100%' }}
          onClose={() => setShowNotification(false)}
        >
          {item ? 'Updating item...' : 'Creating item...'}
        </Alert>
      </Snackbar>
    </>
  );
}; 