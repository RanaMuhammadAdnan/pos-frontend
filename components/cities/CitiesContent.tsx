"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { City, CityResponse } from 'types';
import { getCitiesAction, deleteCityAction } from 'actions';
import { CitiesTable } from './CitiesTable';
import { CityForm } from './CityForm';
import { ConfirmDialog } from 'components/common/ConfirmDialog';

interface CitiesContentProps {
  initialData?: CityResponse;
}

export const CitiesContent = ({ initialData }: CitiesContentProps) => {
  // Initial state: just use initialData?.data if it's an array
  const [cities, setCities] = useState<City[]>(Array.isArray(initialData?.data) ? initialData.data : []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(initialData?.error || null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [deletingCity, setDeletingCity] = useState<City | null>(null);
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

  const fetchCities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getCitiesAction();
      if (result.success && Array.isArray(result.data)) {
        setCities(result.data);
      } else {
        setCities([]);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchCities();
    }
  }, [initialData]);

  const handleAddCity = () => {
    setEditingCity(null);
    setIsFormOpen(true);
  };

  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setIsFormOpen(true);
  };

  const handleDeleteCity = (city: City) => {
    setDeletingCity(city);
  };

  const confirmDelete = async () => {
    if (!deletingCity) return;

    try {
      setIsDeleting(true);
      const result = await deleteCityAction(deletingCity.id);
      
      if (result.success) {
        setCities(prev => prev.filter(city => city.id !== deletingCity.id));
        setSnackbar({
          open: true,
          message: 'City deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'Failed to delete city',
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
      setDeletingCity(null);
    }
  };

  const handleFormSuccess = () => {
    fetchCities();
    setSnackbar({
      open: true,
      message: `City ${editingCity ? 'updated' : 'created'} successfully`,
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <CitiesTable
        cities={cities}
        isLoading={isLoading}
        error={error}
        onAddClick={handleAddCity}
        onEdit={handleEditCity}
        onDelete={handleDeleteCity}
      />

      <CityForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        city={editingCity}
      />

      <ConfirmDialog
        open={Boolean(deletingCity)}
        title="Delete City"
        message={`Are you sure you want to delete "${deletingCity?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingCity(null)}
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