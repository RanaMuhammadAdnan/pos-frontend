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
  Box,
  Typography,
  Chip
} from '@mui/material';
import { SaleInvoice } from 'types';

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
  successMessage?: string | null;
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
  error,
  successMessage
}: PaymentDialogProps) => {
  const remainingAmount = Number(invoice?.remainingAmount) || 0;
  const paymentAmountNum = Number(paymentAmount) || 0;
  const isAmountValid = paymentAmountNum > 0 && paymentAmountNum <= remainingAmount;

  const handlePaymentAmountChange = (value: string) => {
    const numValue = Number(value);
    if (numValue <= remainingAmount) {
      onPaymentAmountChange(value);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Record Payment - Invoice #{invoice?.invoiceNumber}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        {/* Invoice Summary */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Invoice Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Total Amount:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {Number(invoice?.totalAmount || 0).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2">Due Payment:</Typography>
            <Chip 
              label={`${remainingAmount.toFixed(2)}`}
              color="warning"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Payment Amount"
            type="number"
            value={paymentAmount}
            onChange={(e) => handlePaymentAmountChange(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ 
              min: 0, 
              max: remainingAmount,
              step: 0.01 
            }}
            error={paymentAmountNum > remainingAmount}
            helperText={
              paymentAmountNum > remainingAmount 
                ? `Amount cannot exceed due payment of ${remainingAmount.toFixed(2)}`
                : ''
            }
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
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={onPayment} 
          variant="contained" 
          disabled={loading || !isAmountValid}
        >
          {loading ? 'Recording...' : 'Record Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 