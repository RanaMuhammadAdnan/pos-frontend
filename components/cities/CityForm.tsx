"use client";
import React, { useState, useEffect } from 'react';
import { City, CreateCityPayload, UpdateCityPayload } from 'types';
import { createCityAction, updateCityAction } from 'actions';
import { FormDialog } from 'components/common/FormDialog';
import { FormField } from 'components/common/FormField';

interface CityFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  city?: City | null;
}

export const CityForm = ({ open, onClose, onSuccess, city }: CityFormProps) => {
  const [formData, setFormData] = useState<CreateCityPayload>({
    name: '',
    state: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(city);

  useEffect(() => {
    if (city) {
      setFormData({
        name: city.name,
        state: city.state || '',
        country: city.country || '',
      });
    } else {
      setFormData({
        name: '',
        state: '',
        country: '',
      });
    }
    setError('');
  }, [city, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.name.trim()) {
        setError('Please fill in the city name');
        return;
      }

      let result;
      
      if (isEditing && city) {
        const updatePayload: UpdateCityPayload = {
          id: city.id,
          name: formData.name.trim(),
          state: formData.state?.trim() || undefined,
          country: formData.country?.trim() || undefined,
        };
        result = await updateCityAction(updatePayload);
      } else {
        const createPayload: CreateCityPayload = {
          name: formData.name.trim(),
          state: formData.state?.trim() || undefined,
          country: formData.country?.trim() || undefined,
        };
        result = await createCityAction(createPayload);
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || `Failed to ${isEditing ? 'update' : 'create'} city`);
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

  const isFormValid = formData.name.trim();

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditing ? 'Edit City' : 'Add New City'}
      submitText={isEditing ? 'Update' : 'Create'}
      isLoading={isLoading}
      error={error}
      disabled={!isFormValid}
    >
      <FormField
        name="name"
        label="City Name *"
        value={formData.name}
        onChange={handleFieldChange}
        required
        disabled={isLoading}
      />

      <FormField
        name="state"
        label="State"
        value={formData.state || ''}
        onChange={handleFieldChange}
        disabled={isLoading}
      />

      <FormField
        name="country"
        label="Country"
        value={formData.country || ''}
        onChange={handleFieldChange}
        disabled={isLoading}
      />
    </FormDialog>
  );
}; 