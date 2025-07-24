"use client";
import React, { useState, useEffect } from 'react';
import { Vendor, CreateVendorPayload, UpdateVendorPayload } from 'types';
import { createVendorAction, updateVendorAction } from 'actions';
import { FormDialog } from 'components/common/FormDialog';
import { FormField } from 'components/common/FormField';

interface VendorFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendor?: Vendor | null;
}

export const VendorForm = ({ open, onClose, onSuccess, vendor }: VendorFormProps) => {
  const [formData, setFormData] = useState<CreateVendorPayload>({
    name: '',
    phone: '',
    address: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(vendor);

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        phone: vendor.phone,
        address: vendor.address,
        email: vendor.email || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        address: '',
        email: '',
      });
    }
    setError('');
  }, [vendor, open]);

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
      
      if (isEditing && vendor) {
        const updatePayload: UpdateVendorPayload = {
          id: vendor.id,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          email: formData.email?.trim() || undefined,
        };
        result = await updateVendorAction(updatePayload);
      } else {
        const createPayload: CreateVendorPayload = {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          email: formData.email?.trim() || undefined,
        };
        result = await createVendorAction(createPayload);
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || `Failed to ${isEditing ? 'update' : 'create'} vendor`);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
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
      title={isEditing ? 'Edit Vendor' : 'Add New Vendor'}
      submitText={isEditing ? 'Update' : 'Create'}
      isLoading={isLoading}
      error={error}
      disabled={!isFormValid}
    >
      <FormField
        name="name"
        label="Name *"
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
    </FormDialog>
  );
}; 