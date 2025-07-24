"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Alert,
  Box,
  Chip,
  Snackbar
} from '@mui/material';
import { Item, UpdateStockPayload } from 'types';

interface StockUpdateDialogProps {
  open: boolean;
  item: Item | null;
  onClose: () => void;
  onSubmit: (payload: UpdateStockPayload) => void;
  loading: boolean;
}

export const StockUpdateDialog: React.FC<StockUpdateDialogProps> = ({
  open,
  item,
  onClose,
  onSubmit,
  loading
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [type, setType] = useState<'add' | 'subtract'>('add');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (item) {
      setQuantity(0);
      setType('add');
      setErrors({});
    }
  }, [item, open]);

  // Show notification when loading starts
  useEffect(() => {
    if (loading) {
      setShowNotification(true);
    }
  }, [loading]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (type === 'subtract' && item && quantity > item.currentStock) {
      newErrors.quantity = `Cannot subtract more than current stock (${item.currentStock})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({ quantity, type });
  };

  const getNewStockLevel = () => {
    if (!item) return 0;
    
    switch (type) {
      case 'add':
        return item.currentStock + quantity;
      case 'subtract':
        return Math.max(0, item.currentStock - quantity);
      default:
        return item.currentStock;
    }
  };

  const getTypeDescription = () => {
    switch (type) {
      case 'add':
        return 'Add stock to current inventory';
      case 'subtract':
        return 'Remove stock from current inventory';
      default:
        return '';
    }
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Stock - {item.name}
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3}>
              {/* Current Stock Info */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Current Stock
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h6">
                    {item.currentStock}
                  </Typography>
                  <Chip
                    label={item.currentStock <= item.minStockLevel ? 'Low Stock' : 'In Stock'}
                    color={item.currentStock <= item.minStockLevel ? 'warning' : 'success'}
                    size="small"
                  />
                </Stack>
              </Box>

              {/* Type Selection */}
              <FormControl fullWidth>
                <InputLabel>Operation</InputLabel>
                <Select
                  value={type}
                  label="Operation"
                  onChange={(e) => setType(e.target.value as 'add' | 'subtract')}
                >
                  <MenuItem value="add">Add Stock</MenuItem>
                  <MenuItem value="subtract">Subtract Stock</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary">
                {getTypeDescription()}
              </Typography>

              {/* Quantity Input */}
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                error={!!errors.quantity}
                helperText={errors.quantity}
                inputProps={{ min: 0, step: 1 }}
                required
              />

              {/* Preview */}
              {quantity > 0 && (
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Stock Level Preview
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2">
                      Current: {item.currentStock}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      →
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {getNewStockLevel()}
                    </Typography>
                  </Stack>
                  
                  {getNewStockLevel() <= item.minStockLevel && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      This will result in low stock level
                    </Alert>
                  )}
                </Box>
              )}

              {/* Warnings */}
              {type === 'subtract' && quantity > item.currentStock && (
                <Alert severity="error">
                  Cannot subtract more than current stock level
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading || quantity <= 0}
            >
              {loading ? 'Updating...' : 'Update Stock'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Loading Notification */}
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
          Updating stock level...
        </Alert>
      </Snackbar>
    </>
  );
}; 