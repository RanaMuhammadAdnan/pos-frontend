'use client';

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
  Alert,
  Box
} from '@mui/material';
import { SaleInvoice } from 'types';
import { recordPayment } from 'actions';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: SaleInvoice | null;
  paymentAmount: string;
  paymentMethod: string;
  paymentNotes: string;
  onPaymentAmountChange: (amount: string) => void;
  onPaymentMethodChange: (method: string) => void;
  onPaymentNotesChange: (notes: string) => void;
  onPayment: () => void;
  loading: boolean;
  error: string | null;
}

export const PaymentDialog = ({
  open,
  onClose,
  invoice,
  paymentAmount,
  paymentMethod,
  paymentNotes,
  onPaymentAmountChange,
  onPaymentMethodChange,
  onPaymentNotesChange,
  onPayment,
  loading,
  error
}: PaymentDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Record Payment</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Payment Amount"
            type="number"
            value={paymentAmount}
            onChange={(e) => onPaymentAmountChange(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ min: 0, step: 0.01 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => onPaymentMethodChange(e.target.value)}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="check">Check</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            value={paymentNotes}
            onChange={(e) => onPaymentNotesChange(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onPayment} variant="contained" disabled={loading}>
          Record Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 