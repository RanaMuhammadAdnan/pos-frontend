"use client";
import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Alert,
  CircularProgress,
  Stack,
  Snackbar,
  Paper
} from '@mui/material';
import { ItemsTable } from './ItemsTable';
import { ItemForm } from './ItemForm';
import { StockUpdateDialog } from './StockUpdateDialog';
import { ConfirmDialog } from 'components/common';
import { 
  getItemsAction, 
  createItemAction, 
  updateItemAction, 
  deleteItemAction,
  updateStockAction,
  DeleteItemResponse
} from 'actions';
import { 
  Item, 
  CreateItemPayload, 
  UpdateItemPayload, 
  UpdateStockPayload,
  ItemsPaginatedResponse,
  ItemFilters
} from 'types';
import { Layout } from 'components/common/Layout';

interface ItemsContentProps {
  initialData: ItemsPaginatedResponse;
}

export const ItemsContent: React.FC<ItemsContentProps> = ({ initialData }) => {
  const [items, setItems] = useState<Item[]>(Array.isArray(initialData.data?.items) ? initialData.data.items : []);
  const [pagination, setPagination] = useState(initialData.data?.pagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialData.error || null);
  
  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Selected item states
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  // Filters state
  const [filters, setFilters] = useState<ItemFilters>({
    page: 1,
    limit: 10
  });

  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const fetchItems = async (newFilters?: ItemFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      const result = await getItemsAction(currentFilters);
      
      if (result.success && result.data && Array.isArray(result.data.items)) {
        setItems(result.data.items);
        setPagination(result.data.pagination);
      } else {
        setItems([]);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      showNotification('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Memoize handlers
  const handleAddClick = useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEditClick = useCallback((item: Item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((item: Item) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleStockUpdateClick = useCallback((item: Item) => {
    setSelectedItem(item);
    setIsStockDialogOpen(true);
  }, []);

  const handleFormSubmit = async (data: CreateItemPayload | UpdateItemPayload) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (editingItem) {
        result = await updateItemAction({ ...data, id: editingItem.id });
      } else {
        result = await createItemAction(data as CreateItemPayload);
      }
      
      if (result.success) {
        setIsFormOpen(false);
        setEditingItem(null);
        fetchItems(); // Refresh the list
        showNotification(
          editingItem ? 'Item updated successfully!' : 'Item created successfully!', 
          'success'
        );
      } else {
        setError(result.error || 'Failed to save item');
        showNotification(result.error || 'Failed to save item', 'error');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      showNotification('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result: DeleteItemResponse = await deleteItemAction(selectedItem.id);
      
      if (result.success) {
        setIsDeleteDialogOpen(false);
        setSelectedItem(null);
        fetchItems(); // Refresh the list
        showNotification('Item deleted successfully!', 'success');
      } else {
        setError(result.error || 'Failed to delete item');
        showNotification(result.error || 'Failed to delete item', 'error');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      showNotification('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (payload: UpdateStockPayload) => {
    if (!selectedItem) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateStockAction(selectedItem.id, payload);
      
      if (result.success) {
        setIsStockDialogOpen(false);
        setSelectedItem(null);
        fetchItems(); // Refresh the list
        showNotification('Stock updated successfully!', 'success');
      } else {
        setError(result.error || 'Failed to update stock');
        showNotification(result.error || 'Failed to update stock', 'error');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      showNotification('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: ItemFilters) => {
    setFilters(newFilters);
    fetchItems(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchItems(newFilters);
  };

  // Refresh data when component mounts
  // useEffect(() => {
  //   if (!initialData.success) {
  //     fetchItems();
  //   }
  // }, []);

  return (
    <>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <ItemsTable
          items={items}
          pagination={pagination}
          loading={loading}
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onStockUpdateClick={handleStockUpdateClick}
          onFiltersChange={handleFiltersChange}
          onPageChange={handlePageChange}
          filters={filters}
        />
        
        {/* Item Form Dialog */}
        <ItemForm
          open={isFormOpen}
          item={editingItem}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
        
        {/* Stock Update Dialog */}
        <StockUpdateDialog
          open={isStockDialogOpen}
          item={selectedItem}
          onClose={() => {
            setIsStockDialogOpen(false);
            setSelectedItem(null);
          }}
          onSubmit={handleStockUpdate}
          loading={loading}
        />
        
        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          title="Delete Item"
          message={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteDialogOpen(false);
            setSelectedItem(null);
          }}
          severity="error"
        />

        {/* Success/Error Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={hideNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={hideNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
    </>
  );
}; 