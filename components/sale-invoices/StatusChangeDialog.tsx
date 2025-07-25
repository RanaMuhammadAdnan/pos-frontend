'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { SaleInvoice } from 'types';

interface StatusChangeDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: SaleInvoice | null;
  newStatus: string;
  onStatusChange: (newStatus: string) => void;
  loading: boolean;
  onStatusUpdate: () => void;
}

export const StatusChangeDialog = ({ 
  open, 
  onClose, 
  invoice, 
  newStatus, 
  onStatusChange, 
  loading,
  onStatusUpdate
}: StatusChangeDialogProps) => {
  const handleUpdateStatus = () => {
    if (!invoice) return;
    onStatusUpdate();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Invoice Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel>New Status</InputLabel>
          <Select
            value={newStatus}
            label="New Status"
            onChange={(e) => onStatusChange(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="pending">Pending</MenuItem>
            {/* <MenuItem value="complete">Complete</MenuItem> */}
            <MenuItem value="returned">Returned</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleUpdateStatus} 
          variant="contained" 
          disabled={loading || !invoice}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 