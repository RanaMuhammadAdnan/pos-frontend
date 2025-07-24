'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Payment as PaymentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  SwapHoriz as StatusIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { SaleInvoiceListResponse, SaleInvoice, PaymentRequest } from 'types';
import { recordPayment, updateSaleInvoiceStatus } from 'actions';
import { PaymentHistoryDialog } from './PaymentHistoryDialog';
import { StatusChangeDialog } from './StatusChangeDialog';
import { PaymentDialog } from './PaymentDialog';

interface SaleInvoiceTableProps {
  initialData: SaleInvoiceListResponse;
  onEdit: (invoice: SaleInvoice) => void;
  onAdd: () => void;
}

export const SaleInvoiceTable = ({ initialData, onEdit, onAdd }: SaleInvoiceTableProps) => {
  const router = useRouter();
  const [data, setData] = useState<SaleInvoiceListResponse>(initialData);
  const [selectedInvoice, setSelectedInvoice] = useState<SaleInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dialog states
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const handlePayment = async () => {
    if (!selectedInvoice || !paymentAmount) return;

    setLoading(true);
    setError(null);

    try {
      const paymentRequest: PaymentRequest = {
        amount: parseFloat(paymentAmount),
        paymentMethod: paymentMethod,
        notes: paymentNotes
      };

      const result = await recordPayment(selectedInvoice.id, paymentRequest);

      if (result.success) {
        // Update the local data
        setData(prev => ({
          ...prev,
          saleInvoices: prev.saleInvoices.map(invoice =>
            invoice.id === selectedInvoice.id
              ? { 
                  ...invoice, 
                  remainingAmount: Math.max(0, invoice.remainingAmount - parseFloat(paymentAmount))
                }
              : invoice
          )
        }));
        setPaymentDialogOpen(false);
        setSelectedInvoice(null);
        setPaymentAmount('');
        setPaymentMethod('cash');
        setPaymentNotes('');
      } else {
        setError(result.error || 'Failed to record payment');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedInvoice || !newStatus) return;

    setLoading(true);
    setError(null);

    try {
      const result = await updateSaleInvoiceStatus(selectedInvoice.id, newStatus as 'complete' | 'pending' | 'returned');

      if (result.success) {
        // Update the local data
        setData(prev => ({
          ...prev,
          saleInvoices: prev.saleInvoices.map(invoice =>
            invoice.id === selectedInvoice.id
              ? { ...invoice, status: newStatus as 'complete' | 'pending' | 'returned' }
              : invoice
          )
        }));
        setStatusDialogOpen(false);
        setSelectedInvoice(null);
        setNewStatus('');
      } else {
        setError(result.error || 'Failed to update status');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'success';
      case 'pending': return 'warning';
      case 'returned': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Search and filter functions
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((event: any) => {
    setStatusFilter(event.target.value);
  }, []);

  // Filter the data based on search and status
  const filteredInvoices = data.saleInvoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  return (
    <>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Sale Invoices ({filteredInvoices?.length || 0})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{ borderRadius: 2 }}
          >
            Add Sale Invoice
          </Button>
        </Stack>
      </Box>
     

      {/* Search and Filter Section */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search by invoice number or customer..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="complete">Complete</MenuItem>
              <MenuItem value="returned">Returned</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Net Amount</TableCell>
              <TableCell align="right">Sub Total</TableCell>
              <TableCell align="right">Discount</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="right">Profit</TableCell>
              <TableCell align="right">Remaining</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
                     <TableBody>
             {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customer?.name || 'N/A'}</TableCell>
                <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                <TableCell align="right">{formatCurrency(invoice.netAmount)}</TableCell>
                <TableCell align="right">{formatCurrency(invoice.subtotal)}</TableCell>
                <TableCell align="right">{formatCurrency(invoice.discountAmount)}</TableCell>
                <TableCell align="right">{formatCurrency(invoice.totalAmount)}</TableCell>
                <TableCell align="right">{formatCurrency(invoice.profit)}</TableCell>
                <TableCell align="right">{formatCurrency(invoice.remainingAmount)}</TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status}
                    color={getStatusColor(invoice.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/sale-invoices/${invoice.id}`)}
                    title="View Details"
                  >
                    <ReceiptIcon />
                  </IconButton>
                  {invoice.remainingAmount > 0 && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setPaymentDialogOpen(true);
                      }}
                      title="Record Payment"
                    >
                      <PaymentIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setHistoryDialogOpen(true);
                    }}
                    title="Payment History"
                  >
                    <HistoryIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setNewStatus(invoice.status);
                      setStatusDialogOpen(true);
                    }}
                    title="Change Status"
                  >
                    <StatusIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(invoice)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  {/* <IconButton
                    size="small"
                    disabled
                    title="Delete (Disabled)"
                  >
                    <DeleteIcon />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        invoice={selectedInvoice}
        paymentAmount={paymentAmount}
        paymentMethod={paymentMethod}
        paymentNotes={paymentNotes}
        onPaymentAmountChange={setPaymentAmount}
        onPaymentMethodChange={setPaymentMethod}
        onPaymentNotesChange={setPaymentNotes}
        onPayment={handlePayment}
        loading={loading}
        error={error}
      />

      {/* Status Change Dialog */}
      <StatusChangeDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        invoice={selectedInvoice}
        newStatus={newStatus}
        onStatusChange={setNewStatus}
        loading={loading}
      />

      {/* Payment History Dialog */}
      <PaymentHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        invoice={selectedInvoice}
      />
    </>
  );
}; 