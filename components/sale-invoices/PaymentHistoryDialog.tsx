'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { SaleInvoice, PaymentHistoryItem } from 'types';
import { getPaymentHistory } from 'actions';

interface PaymentHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: SaleInvoice | null;
}

export const PaymentHistoryDialog = ({ open, onClose, invoice }: PaymentHistoryDialogProps) => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && invoice && mounted) {
      fetchPaymentHistory();
    } else if (!open) {
      // Reset state when dialog closes
      setPaymentHistory([]);
      setError(null);
      setLoading(false);
    }
  }, [open, invoice, mounted]);

  const fetchPaymentHistory = async () => {
    if (!invoice) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getPaymentHistory(invoice.id);
      if (result.success && result.data) {
        setPaymentHistory(result.data.paymentHistory);
      } else {
        setError(result.error || 'Failed to fetch payment history');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const formatPaymentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Use YYYY-MM-DD format for consistency
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'success';
      case 'pending': return 'warning';
      case 'returned': return 'error';
      default: return 'default';
    }
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Payment History - Invoice #{invoice?.invoiceNumber}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Invoice Summary</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                  <Typography variant="body1">{Number(invoice?.totalAmount) || 0}</Typography>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="text.secondary">Remaining Amount:</Typography>
                  <Typography variant="body1" color={(Number(invoice?.remainingAmount) || 0) > 0 ? 'error' : 'success'}>
                    {Number(invoice?.remainingAmount) || 0}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip 
                    label={invoice?.status} 
                    color={getStatusColor(invoice?.status || '')}
                    size="small"
                  />
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="text.secondary">Total Paid:</Typography>
                  <Typography variant="body1" color="success.main">
                    {(() => {
                      const totalAmount = Number(invoice?.totalAmount) || 0;
                      const remainingAmount = Number(invoice?.remainingAmount) || 0;
                      const totalPaid = totalAmount - remainingAmount;
                      return isNaN(totalPaid) ? 0 : totalPaid;
                    })()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>Payment History</Typography>
            {!paymentHistory || paymentHistory.length === 0 ? (
              <Alert severity="info">No payment records found for this invoice.</Alert>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentHistory?.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {formatPaymentDate(payment.paymentDate)}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            {Number(payment.amount) || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={payment.paymentMethod} size="small" />
                        </TableCell>
                        <TableCell>
                          {payment.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}; 