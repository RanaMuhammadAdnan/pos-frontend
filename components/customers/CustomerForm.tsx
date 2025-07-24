"use client";
import React, { useState, useEffect } from 'react';
import { Customer, CreateCustomerPayload, UpdateCustomerPayload, City } from 'types';
import { createCustomerAction, updateCustomerAction, getCitiesAction } from 'actions';
import { FormDialog } from 'components/common/FormDialog';
import { FormField } from 'components/common/FormField';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: Customer | null;
}

export const CustomerForm = ({ open, onClose, onSuccess, customer }: CustomerFormProps) => {
  const [formData, setFormData] = useState<CreateCustomerPayload>({
    name: '',
    phone: '',
    address: '',
    email: '',
    cityId: undefined,
  });
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(customer);

  useEffect(() => {
    if (open) {
      fetchCities();
    }
  }, [open]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        email: customer.email || '',
        cityId: customer.cityId || undefined,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        address: '',
        email: '',
        cityId: undefined,
      });
    }
    setError('');
  }, [customer, open]);

  const fetchCities = async () => {
    try {
      const result = await getCitiesAction();
      if (result.success && result.data) {
        setCities(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
        setError('Please fill in all required fields');
        return;
      }

      let result;
      
      if (isEditing && customer) {
        const updatePayload: UpdateCustomerPayload = {
          id: customer.id,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          email: formData.email?.trim() || undefined,
          cityId: formData.cityId,
        };
        result = await updateCustomerAction(updatePayload);
      } else {
        const createPayload: CreateCustomerPayload = {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          email: formData.email?.trim() || undefined,
          cityId: formData.cityId,
        };
        result = await createCustomerAction(createPayload);
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || `Failed to ${isEditing ? 'update' : 'create'} customer`);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = formData.name.trim() && formData.phone.trim() && formData.address.trim();

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditing ? 'Edit Customer' : 'Add New Customer'}
      submitText={isEditing ? 'Update' : 'Create'}
      isLoading={isLoading}
      error={error}
      disabled={!isFormValid}
    >
      <FormField
        name="name"
        label="Customer Name *"
        value={formData.name}
        onChange={handleFieldChange}
        required
        disabled={isLoading}
      />

      <FormField
        name="phone"
        label="Phone *"
        value={formData.phone}
        onChange={handleFieldChange}
        required
        disabled={isLoading}
      />

      <FormField
        name="address"
        label="Address *"
        value={formData.address}
        onChange={handleFieldChange}
        required
        multiline
        rows={3}
        disabled={isLoading}
      />

      <FormField
        name="email"
        label="Email"
        type="email"
        value={formData.email || ''}
        onChange={handleFieldChange}
        disabled={isLoading}
      />

      <FormControl fullWidth disabled={isLoading}>
        <InputLabel id="city-select-label">City</InputLabel>
        <Select
          labelId="city-select-label"
          value={formData.cityId || ''}
          label="City"
          onChange={(e) => handleFieldChange('cityId', e.target.value)}
        >
          <MenuItem value="">
            <em>Select a city</em>
          </MenuItem>
          {cities.map((city) => (
            <MenuItem key={city.id} value={city.id}>
              <Box>
                <Typography variant="body2">{city.name}</Typography>
                {city.state && (
                  <Typography variant="caption" color="text.secondary">
                    {city.state}, {city.country}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FormDialog>
  );
}; 